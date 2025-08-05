import React from 'react';
import { SidebarMenu, useSidebar } from '@/components/ui/sidebar';
import { Profile } from './settings/Profile';
import { UserSettings } from './settings/UserSettings';
import { UserCustomization } from './settings/UserCustomization';
import { NotificationButton } from './notifications';
import { SignInOut } from './settings/SignInOut';
import { SidebarDarkModeToggle } from './SidebarDarkModeToggle';
import { useSettings } from '@/contexts/SettingsContext';

// Navigation component mapping
const navigationComponents = {
  'DarkModeToggle': SidebarDarkModeToggle,
  'Profile': Profile,
  'NotificationButton': NotificationButton,
  'UserSettings': UserSettings,
  'UserCustomization': UserCustomization,
  'SignInOut': SignInOut,
};

export function UserNavigation() {
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';
  const { 
    hideDividers = false, 
    userNavigationOrder
  } = useSettings();

  return (
    <div className={`${hideDividers ? '' : 'border-t border-sidebar-border'} ${isCollapsed ? 'p-2' : 'px-4 pt-4 pb-2'}`}>
      <SidebarMenu className={isCollapsed ? 'flex-col gap-2 items-center' : 'flex-col gap-1'}>
        {userNavigationOrder.map((componentId) => {
          const Component = navigationComponents[componentId as keyof typeof navigationComponents];
          if (!Component) return null;

          // Add visual separator after dark mode toggle
          const addSeparator = componentId === 'DarkModeToggle';

          return (
            <div key={componentId}>
              <Component />
              {addSeparator && !isCollapsed && (
                <div className="my-2 h-px w-full bg-sidebar-border" />
              )}
            </div>
          );
        })}
      </SidebarMenu>
    </div>
  );
}