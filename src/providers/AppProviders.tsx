import React from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/contexts/AuthContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { WorkspaceProvider } from "@/contexts/WorkspaceContext";
import { WorkspaceProfileProvider } from "@/contexts/WorkspaceProfileContext";
import { UISettingsProvider } from "@/contexts/UISettingsContext";
import { DashboardSettingsProvider } from "@/contexts/DashboardSettingsContext";
import { NavigationSettingsProvider } from "@/contexts/NavigationSettingsContext";
import { SettingsProvider } from "@/contexts/SettingsContext";

const queryClient = new QueryClient();

interface AppProvidersProps {
  children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider 
        attribute="class" 
        defaultTheme="system" 
        enableSystem 
        disableTransitionOnChange
        storageKey="theme"
      >
        <AuthProvider>
          <NotificationProvider>
            <WorkspaceProvider>
              <WorkspaceProfileProvider>
                <SettingsProvider>
                  <UISettingsProvider>
                    <DashboardSettingsProvider>
                      <NavigationSettingsProvider>
                        <TooltipProvider>
                          <SidebarProvider defaultOpen={true}>
                            {children}
                          </SidebarProvider>
                        </TooltipProvider>
                      </NavigationSettingsProvider>
                    </DashboardSettingsProvider>
                  </UISettingsProvider>
                </SettingsProvider>
              </WorkspaceProfileProvider>
            </WorkspaceProvider>
          </NotificationProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}