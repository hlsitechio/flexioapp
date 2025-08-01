import { SidebarMenu, useSidebar } from '@/components/ui/sidebar';
import { Profile } from './settings/Profile';
import { UserSettings } from './settings/UserSettings';
import { SignInOut } from './settings/SignInOut';
import { SidebarDarkModeToggle } from './SidebarDarkModeToggle';
import { User } from 'lucide-react';

export function UserNavigation() {
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  if (isCollapsed) {
    return (
      <div className="flex justify-center">
        <button 
          className="p-2 rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
          title="User Menu"
        >
          <User className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="border-t border-white/10 p-4">
      <SidebarMenu className="space-y-1">
        <SidebarDarkModeToggle />
        <Profile />
        <UserSettings />
        <SignInOut />
      </SidebarMenu>
    </div>
  );
}