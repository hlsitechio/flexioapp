import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/contexts/AuthContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { SettingsProvider } from "@/contexts/SettingsContext";
import App from "./App.tsx";
import "./index.css";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <NotificationProvider>
          <SettingsProvider>
            <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
              <TooltipProvider>
                <SidebarProvider defaultOpen={true}>
                  <App />
                </SidebarProvider>
              </TooltipProvider>
            </ThemeProvider>
          </SettingsProvider>
        </NotificationProvider>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
);
