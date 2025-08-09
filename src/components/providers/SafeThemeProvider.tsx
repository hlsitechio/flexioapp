import React, { useEffect, useState } from 'react';
import { ThemeProvider } from "next-themes";

interface SafeThemeProviderProps {
  children: React.ReactNode;
}

export function SafeThemeProvider({ children }: SafeThemeProviderProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch and context issues
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeProvider 
      attribute="class" 
      defaultTheme="dark" 
      enableSystem={false}
      disableTransitionOnChange
      storageKey="theme"
    >
      {children}
    </ThemeProvider>
  );
}