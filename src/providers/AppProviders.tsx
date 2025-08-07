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

// Minimal providers for public pages
function PublicProviders({ children }: { children: React.ReactNode }) {
  return (
    <UISettingsProvider>
      {children}
    </UISettingsProvider>
  );
}

const queryClient = new QueryClient();

interface AppProvidersProps {
  children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  // Check if we're on a public page that doesn't need authentication contexts
  const isPublicPage = typeof window !== 'undefined' && (
    window.location.pathname.startsWith('/landing') ||
    window.location.pathname.startsWith('/contact') ||
    window.location.pathname.startsWith('/demo') ||
    window.location.pathname.startsWith('/about') ||
    window.location.pathname.startsWith('/careers') ||
    window.location.pathname.startsWith('/blog') ||
    window.location.pathname.startsWith('/features') ||
    window.location.pathname.startsWith('/pricing') ||
    window.location.pathname.startsWith('/integrations') ||
    window.location.pathname.startsWith('/documentation') ||
    window.location.pathname.startsWith('/help-center') ||
    window.location.pathname.startsWith('/privacy-policy') ||
    window.location.pathname.startsWith('/terms-of-service')
  );

  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <SafeThemeProvider>
          <AuthProvider>
            <TooltipProvider>
              <SidebarProvider defaultOpen={true}>
                {isPublicPage ? (
                  <PublicProviders>{children}</PublicProviders>
                ) : (
                  <AuthenticatedProviders>{children}</AuthenticatedProviders>
                )}
              </SidebarProvider>
            </TooltipProvider>
          </AuthProvider>
        </SafeThemeProvider>
      </HelmetProvider>
    </QueryClientProvider>
  );
}