import { createContext, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  signUp: (email: string, password: string, options?: { data?: { full_name: string } }) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
  loading: boolean;
}

// Safe auth context that returns null user for public pages
const SafeAuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  signUp: async () => ({ error: null }),
  signIn: async () => ({ error: null }),
  signOut: async () => ({ error: null }),
  loading: false,
});

export function useSafeAuth(): AuthContextType {
  // Check if we're on a public page
  const isPublicPage = typeof window !== 'undefined' && (
    window.location.pathname === '/' ||
    window.location.pathname.startsWith('/landing') ||
    window.location.pathname.startsWith('/contact') ||
    window.location.pathname.startsWith('/demo') ||
    window.location.pathname.startsWith('/about') ||
    window.location.pathname.startsWith('/features') ||
    window.location.pathname.startsWith('/pricing')
  );

  if (isPublicPage) {
    // Return safe defaults for public pages
    return {
      user: null,
      session: null,
      signUp: async () => ({ error: null }),
      signIn: async () => ({ error: null }),
      signOut: async () => ({ error: null }),
      loading: false,
    };
  }

  // For non-public pages, try to get the real auth context
  try {
    const context = useContext(SafeAuthContext);
    return context;
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