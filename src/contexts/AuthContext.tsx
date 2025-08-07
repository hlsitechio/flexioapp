import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { createRateLimiter } from '@/lib/security';

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
    // Skip auth initialization on public pages for performance
    const isPublicPage = typeof window !== 'undefined' && (
      window.location.pathname === '/' ||                      // Root path
      window.location.pathname.startsWith('/landing') ||
      window.location.pathname.startsWith('/contact') ||
      window.location.pathname.startsWith('/demo') ||
      window.location.pathname.startsWith('/about') ||
      window.location.pathname.startsWith('/features') ||
      window.location.pathname.startsWith('/pricing')
    );

    if (isPublicPage) {
      setLoading(false);
      return;
    }

    // Set up auth state listener for authenticated pages only
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
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error && data?.user) {
      // Track failed login attempt
      await supabase.rpc('track_failed_login', {
        _user_id: data.user.id
      });
    } else if (data?.user && !error) {
      // Reset failed attempts on successful login
      await supabase.rpc('reset_failed_login_attempts', {
        _user_id: data.user.id
      });
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