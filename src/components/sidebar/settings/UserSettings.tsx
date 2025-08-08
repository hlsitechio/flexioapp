import { Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SidebarMenuItem, SidebarMenuButton, useSidebar } from '@/components/ui/sidebar';
import { useWorkspaceUrl } from '@/hooks/useWorkspaceUrl';

export function UserSettings() {
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';
  const navigate = useNavigate();
  const { buildWorkspaceUrl } = useWorkspaceUrl();

  return (
    <SidebarMenuItem>
      <SidebarMenuButton 
        className={`w-full ${
          isCollapsed ? 'w-10 h-10 p-0 justify-center mx-auto flex items-center' : 'justify-start'
        } hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-200 rounded-lg`}
        onClick={() => navigate(buildWorkspaceUrl('/settings'))}
      >
        <Settings className="h-4 w-4" />
        {!isCollapsed && <span className="ml-2">Settings</span>}
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
