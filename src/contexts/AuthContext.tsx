import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { createRateLimiter } from '@/lib/security';
import { isPublicPath } from '@/lib/routes/publicPaths';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  signUp: (email: string, password: string, options?: { data?: { full_name: string } }) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Rate limiter for auth operations (5 attempts per minute)
  const authRateLimiter = createRateLimiter(5, 60000);

  useEffect(() => {
    // Initialize auth state on all pages to avoid navigation loops

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.warn('Session error:', error);
        // Clear any corrupted session data
        localStorage.removeItem('sb-dfyemumhufbsznjnwvlt-auth-token');
        setSession(null);
        setUser(null);
      } else {
        setSession(session);
        setUser(session?.user ?? null);
      }
      setLoading(false);
    }).catch((error) => {
      console.warn('Failed to get session:', error);
      // Clear corrupted session data
      localStorage.removeItem('sb-dfyemumhufbsznjnwvlt-auth-token');
      setSession(null);
      setUser(null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, options?: { data?: { full_name: string } }) => {
    // Check rate limit
    if (!authRateLimiter(email)) {
      return { error: { message: 'Too many sign up attempts. Please try again later.' } };
    }
    
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: options?.data
      }
    });
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    // Check rate limit
    if (!authRateLimiter(email)) {
      return { error: { message: 'Too many sign in attempts. Please try again later.' } };
    }

    // Attempt to fetch the user id by email to enforce lockout logic
    let userId: string | null = null;
    try {
      const { data: fetchedId } = await (supabase as any).rpc('get_user_id_by_email', { _email: email });
      userId = (fetchedId as unknown as string) || null;
    } catch (e) {
      // Ignore lookup errors to avoid leaking user existence
      userId = null;
    }

    // If we have a user id, check lockout before attempting sign in
    if (userId) {
      try {
        const { data: isLocked } = await supabase.rpc('is_account_locked', { _user_id: userId });
        if (isLocked) {
          return { error: { message: 'Your account is temporarily locked due to multiple failed attempts. Please try again later.' } };
        }
      } catch {}
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      // Track failed login attempt if we have a user id
      if (userId) {
        try {
          const { data: nowLocked } = await supabase.rpc('track_failed_login', { _user_id: userId, _ip_address: null });
          if (nowLocked) {
            return { error: { message: 'Your account has been locked due to too many failed attempts. Please wait 15 minutes and try again.' } };
          }
        } catch {}
      }
    } else if (data?.user && userId) {
      // Reset failed attempts on successful login
      try {
        await supabase.rpc('reset_failed_login_attempts', { _user_id: userId });
      } catch {}
    }

    return { error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    // Clear persisted profile to prevent conflicts on next login
    localStorage.removeItem('currentWorkspaceProfile');
    return { error };
  };

  const value = {
    user,
    session,
    signUp,
    signIn,
    signOut,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}