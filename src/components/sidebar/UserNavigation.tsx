import React from 'react';
import { Plus, Sidebar as SidebarIcon, Edit3, Eye } from 'lucide-react';
import { SidebarMenu, useSidebar } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Profile } from './settings/Profile';
import { UserSettings } from './settings/UserSettings';
import { UserCustomization } from './settings/UserCustomization';
import { NotificationButton } from './notifications';
import { SignInOut } from './settings/SignInOut';
import { AdminAccess } from './settings/AdminAccess';
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
  const navigate = useNavigate();
  const isCollapsed = state === 'collapsed';
  const { 
    hideDividers = false, 
    userNavigationOrder,
    editMode,
    setEditMode
  } = useSettings();

  return (
    <div className={`${hideDividers ? '' : 'border-t border-sidebar-border'} ${isCollapsed ? 'p-2' : 'px-4 pt-4 pb-0'}`}>
      {/* Edit Mode and Action Buttons */}
      <div className="space-y-3 mb-4">
        {/* Edit Mode Toggle */}
        {isCollapsed ? (
          <div className="flex justify-center">
            <Button 
              className="w-10 h-10 p-0 rounded-lg text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-all cursor-pointer flex items-center justify-center mx-auto"
              variant="ghost"
              onClick={() => setEditMode(!editMode)}
            >
              {editMode ? <Eye className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
            </Button>
          </div>
        ) : (
          <Button
            onClick={() => setEditMode(!editMode)}
            className="w-full justify-start hover:bg-sidebar-accent transition-all cursor-pointer text-left"
            variant="ghost"
          >
            {editMode ? <Eye className="h-4 w-4 text-sidebar-foreground/70" /> : <Edit3 className="h-4 w-4 text-sidebar-foreground/70" />}
            <div className="flex-1 ml-3">
              <div className="text-sm font-medium text-sidebar-foreground">
                Edit Mode {editMode && !isCollapsed && <span className="text-xs text-sidebar-foreground/50 normal-case">(Drag to reorder)</span>}
              </div>
            </div>
          </Button>
        )}

        {/* Action Buttons */}
        {editMode && (
          <div className={isCollapsed ? "flex flex-col gap-2 items-center" : "space-y-2"}>
            <Button 
              className={`${
                isCollapsed 
                  ? 'w-10 h-10 p-0 hover:bg-sidebar-accent text-sidebar-foreground hover:text-sidebar-accent-foreground transition-all duration-300 flex items-center justify-center' 
                  : 'w-full justify-start hover:bg-sidebar-accent text-sidebar-foreground hover:text-sidebar-accent-foreground transition-all duration-300'
              }`}
              variant="ghost"
              onClick={() => navigate('/components')}
            >
              <Plus className="h-4 w-4" />
              {!isCollapsed && <span className="ml-2">Add Widget</span>}
            </Button>
            
            {!isCollapsed && (
              <Button 
                className="w-full justify-start hover:bg-sidebar-accent text-sidebar-foreground hover:text-sidebar-accent-foreground transition-all duration-300"
                variant="ghost"
                onClick={() => console.log('Sidebar transparency toggle clicked')}
              >
                <SidebarIcon className="h-4 w-4" />
                <span className="ml-2">Solid Sidebar</span>
              </Button>
            )}
          </div>
        )}

        {/* Separator */}
        {!isCollapsed && <div className="h-px w-full bg-sidebar-border" />}
      </div>

      <SidebarMenu className={isCollapsed ? 'flex-col gap-2 items-center' : 'flex-col gap-1'}>
        {/* Admin Access - Always show first if user is admin */}
        <AdminAccess />
        
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