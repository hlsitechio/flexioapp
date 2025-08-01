import { Bell } from 'lucide-react';
import { SidebarMenuItem, SidebarMenuButton, useSidebar } from '@/components/ui/sidebar';
import { useNotification } from '@/contexts/NotificationContext';

export function NotificationButton() {
  const { state } = useSidebar();
  const { toggleNotification, isNotificationOpen } = useNotification();
  const isCollapsed = state === 'collapsed';

  return (
    <SidebarMenuItem>
      <SidebarMenuButton 
        onClick={toggleNotification}
        className={`w-full ${
          isCollapsed ? 'w-10 h-10 p-0 justify-center mx-auto flex items-center' : 'justify-start'
        } hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-200 rounded-lg cursor-pointer ${
          isNotificationOpen ? 'bg-sidebar-accent text-sidebar-accent-foreground' : ''
        }`}
      >
        <Bell className="h-4 w-4" />
        {!isCollapsed && <span className="ml-2">Notification</span>}
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}