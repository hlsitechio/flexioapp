import { Plus, User, Settings, LogIn, ChevronRight } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';

export function DashboardSidebar() {
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  return (
    <Sidebar className="border-r border-sidebar-border bg-sidebar-background backdrop-blur-xl">
      {/* Collapsed state expand button */}
      {isCollapsed && (
        <div className="absolute -right-3 top-4 z-50">
          <SidebarTrigger className="h-6 w-6 rounded-full bg-sidebar-primary hover:bg-sidebar-primary/80 text-sidebar-primary-foreground shadow-lg border border-sidebar-border/50 p-0">
            <ChevronRight className="h-3 w-3" />
          </SidebarTrigger>
        </div>
      )}

      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <h2 className="text-lg font-semibold text-sidebar-foreground">
              Dashboard
            </h2>
          )}
          {!isCollapsed && (
            <SidebarTrigger className="ml-auto text-sidebar-foreground hover:text-sidebar-primary transition-colors" />
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="flex flex-col h-full">
        {/* Main Content Area with Panels */}
        <div className="flex-1 p-4 space-y-6">
          {/* Action Panel */}
          <div className="space-y-3">
            {!isCollapsed && (
              <h3 className="text-xs font-semibold text-sidebar-foreground/70 uppercase tracking-wider px-2">
                Action
              </h3>
            )}
            <div className="space-y-2">
              <Button 
                className={`w-full ${
                  isCollapsed ? 'px-3' : 'justify-start'
                } button-premium text-primary-foreground hover:shadow-lg transition-all duration-300`}
                size={isCollapsed ? 'sm' : 'default'}
              >
                <Plus className="h-4 w-4" />
                {!isCollapsed && <span className="ml-2">Add Component</span>}
              </Button>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-white/10" />

          {/* Tools Panel */}
          <div className="space-y-3">
            {!isCollapsed && (
              <h3 className="text-xs font-semibold text-sidebar-foreground/70 uppercase tracking-wider px-2">
                Tools
              </h3>
            )}
            <div className="space-y-2">
              {/* Add tool items here later */}
              <div className="text-xs text-sidebar-foreground/50 px-2">
                {!isCollapsed ? 'No tools available yet' : ''}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-white/10" />

          {/* Settings Panel */}
          <div className="space-y-3">
            {!isCollapsed && (
              <h3 className="text-xs font-semibold text-sidebar-foreground/70 uppercase tracking-wider px-2">
                Settings
              </h3>
            )}
            <div className="space-y-2">
              {/* Add settings items here later */}
              <div className="text-xs text-sidebar-foreground/50 px-2">
                {!isCollapsed ? 'No settings available yet' : ''}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Profile, Settings, Sign In */}
        <div className="border-t border-white/10 p-4">
          <SidebarMenu className="space-y-1">
            <SidebarMenuItem>
              <SidebarMenuButton 
                className={`w-full ${
                  isCollapsed ? 'justify-center px-3' : 'justify-start'
                } hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-200 rounded-lg`}
              >
                <User className="h-4 w-4" />
                {!isCollapsed && <span className="ml-2">Profile</span>}
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton 
                className={`w-full ${
                  isCollapsed ? 'justify-center px-3' : 'justify-start'
                } hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-200 rounded-lg`}
              >
                <Settings className="h-4 w-4" />
                {!isCollapsed && <span className="ml-2">Settings</span>}
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton 
                className={`w-full ${
                  isCollapsed ? 'justify-center px-3' : 'justify-start'
                } hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-200 rounded-lg`}
              >
                <LogIn className="h-4 w-4" />
                {!isCollapsed && <span className="ml-2">Sign In</span>}
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}