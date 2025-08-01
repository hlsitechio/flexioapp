import { Plus, User, Settings, LogIn } from 'lucide-react';
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
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <h2 className="text-lg font-semibold text-sidebar-foreground">
              Dashboard
            </h2>
          )}
          <SidebarTrigger className="ml-auto text-sidebar-foreground hover:text-sidebar-primary transition-colors" />
        </div>
      </SidebarHeader>

      <SidebarContent className="p-4 space-y-4">
        {/* Add Component Button */}
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

        {/* Navigation Menu */}
        <SidebarMenu className="space-y-2">
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
      </SidebarContent>
    </Sidebar>
  );
}