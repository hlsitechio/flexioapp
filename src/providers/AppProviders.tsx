import React from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from 'react-helmet-async';
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SafeThemeProvider } from "@/components/providers/SafeThemeProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { WorkspaceProvider } from "@/contexts/WorkspaceContext";
import { WorkspaceProfileProvider } from "@/contexts/WorkspaceProfileContext";
import { UISettingsProvider } from "@/contexts/UISettingsContext";
import { DashboardSettingsProvider } from "@/contexts/DashboardSettingsContext";
import { NavigationSettingsProvider } from "@/contexts/NavigationSettingsContext";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { isPublicPath } from "@/lib/routes/publicPaths";

// Wrapper for authenticated-only providers
function AuthenticatedProviders({ children }: { children: React.ReactNode }) {
  return (
    <NotificationProvider>
      <WorkspaceProvider>
        <WorkspaceProfileProvider>
          <SettingsProvider>
            <UISettingsProvider>
              <DashboardSettingsProvider>
                <NavigationSettingsProvider>
                  {children}
                </NavigationSettingsProvider>
              </DashboardSettingsProvider>
            </UISettingsProvider>
          </SettingsProvider>
        </WorkspaceProfileProvider>
      </WorkspaceProvider>
    </NotificationProvider>
  );
}

// Minimal providers for public pages - NO auth-related contexts
function PublicProviders({ children }: { children: React.ReactNode }) {
  return (
    <>{children}</>
  );
}

const queryClient = new QueryClient();

interface AppProvidersProps {
  children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  // Check if we're on a public page that doesn't need authentication contexts
  const isPublicPage = typeof window !== 'undefined' && isPublicPath(window.location.pathname);

  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <SafeThemeProvider>
          {isPublicPage ? (
            // No AuthProvider on public pages to prevent Supabase calls
            <TooltipProvider>
              <SidebarProvider defaultOpen={true}>
                <PublicProviders>{children}</PublicProviders>
              </SidebarProvider>
            </TooltipProvider>
          ) : (
            // Full providers for authenticated pages
            <AuthProvider>
              <TooltipProvider>
                <SidebarProvider defaultOpen={true}>
                  <AuthenticatedProviders>{children}</AuthenticatedProviders>
                </SidebarProvider>
              </TooltipProvider>
            </AuthProvider>
          )}
        </SafeThemeProvider>
      </HelmetProvider>
    </QueryClientProvider>
  );
}