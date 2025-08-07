import { User, Session } from '@supabase/supabase-js';
import { useAuth } from '@/contexts/AuthContext';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  signUp: (email: string, password: string, options?: { data?: { full_name: string } }) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
  loading: boolean;
}

export function useSafeAuth(): AuthContextType {
  try {
    // Always use real auth context; provider handles performance internally
    return useAuth();
  } catch {
    // Fallback if context is not available
    return {
      user: null,
      session: null,
      signUp: async () => ({ error: null }),
      signIn: async () => ({ error: null }),
      signOut: async () => ({ error: null }),
      loading: false,
    };
  }
}
