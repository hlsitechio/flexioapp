import { SidebarMenu } from '@/components/ui/sidebar';
import { Profile } from './settings/Profile';
import { UserSettings } from './settings/UserSettings';
import { SignInOut } from './settings/SignInOut';

export function UserNavigation() {
  return (
    <div className="border-t border-white/10 p-4">
      <SidebarMenu className="space-y-1">
        <Profile />
        <UserSettings />
        <SignInOut />
      </SidebarMenu>
    </div>
  );
}