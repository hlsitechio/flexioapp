import { SidebarMenu, useSidebar } from '@/components/ui/sidebar';
import { Profile } from './settings/Profile';
import { UserSettings } from './settings/UserSettings';
import { UserCustomization } from './settings/UserCustomization';
import { NotificationButton } from './notifications';
import { SignInOut } from './settings/SignInOut';
import { SidebarDarkModeToggle } from './SidebarDarkModeToggle';

export function UserNavigation() {
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  return (
    <div className={`border-t border-sidebar-border ${isCollapsed ? 'p-2' : 'p-4'}`}>
      <SidebarMenu className={isCollapsed ? 'space-y-2 items-center' : 'space-y-1'}>
        <SidebarDarkModeToggle />
        <Profile />
        <NotificationButton />
        <UserSettings />
        <UserCustomization />
        <SignInOut />
      </SidebarMenu>
    </div>
  );
}