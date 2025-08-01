
import { User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SidebarMenuItem, SidebarMenuButton, useSidebar } from '@/components/ui/sidebar';

export function Profile() {
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';
  const navigate = useNavigate();

  return (
    <SidebarMenuItem>
      <SidebarMenuButton 
        className={`w-full ${
          isCollapsed ? 'justify-center px-3' : 'justify-start'
        } hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-200 rounded-lg`}
        onClick={() => navigate('/profile')}
      >
        <User className="h-4 w-4" />
        {!isCollapsed && <span className="ml-2">Profile</span>}
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}