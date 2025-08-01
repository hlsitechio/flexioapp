
import { LogIn } from 'lucide-react';
import { SidebarMenuItem, SidebarMenuButton, useSidebar } from '@/components/ui/sidebar';

export function SignInOut() {
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  return (
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
  );
}