import React from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
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
import { useLocation } from 'react-router-dom';
import { isPublicPath } from "@/lib/routes/publicPaths";

// Wrapper for authenticated-only providers
function AuthenticatedProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
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
    </AuthProvider>
  );
}

// Minimal wrapper for public pages
function PublicProviders({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

interface AppProvidersProps {
  children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes
        retry: (failureCount, error) => {
          if (failureCount < 2) return true;
          console.error('Query failed:', error);
          return false;
        },
      },
    },
  });

  const location = useLocation();
  const isPublic = isPublicPath(location.pathname);

  const ProvidersWrapper = isPublic ? PublicProviders : AuthenticatedProviders;

  return (
    <QueryClientProvider client={queryClient}>
      <SafeThemeProvider>
        <TooltipProvider>
          <SidebarProvider defaultOpen={!isPublic}>
            <ProvidersWrapper>
              {children}
            </ProvidersWrapper>
          </SidebarProvider>
        </TooltipProvider>
      </SafeThemeProvider>
    </QueryClientProvider>
  );
}