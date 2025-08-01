import { SidebarMenu, useSidebar } from '@/components/ui/sidebar';
import { Profile } from './settings/Profile';
import { UserSettings } from './settings/UserSettings';
import { SignInOut } from './settings/SignInOut';
import { SidebarDarkModeToggle } from './SidebarDarkModeToggle';

export function UserNavigation() {
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  if (isCollapsed) {
    return (
      <div className="flex flex-col items-center space-y-2">
        <SidebarDarkModeToggle />
        <Profile />
        <UserSettings />
        <SignInOut />
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