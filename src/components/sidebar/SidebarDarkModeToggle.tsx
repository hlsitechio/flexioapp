import { useState } from 'react';

import { Sun, Moon } from 'lucide-react';
import { SidebarMenuItem, SidebarMenuButton, useSidebar } from '@/components/ui/sidebar';

export function SidebarDarkModeToggle() {
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';
  const [isDark, setIsDark] = useState(false);

  const toggleDarkMode = () => {
    setIsDark(!isDark);
    // TODO: Implement actual dark mode functionality
  };

  return (
    <SidebarMenuItem>
      <SidebarMenuButton 
        className={`w-full ${
          isCollapsed ? 'justify-center px-3' : 'justify-start'
        } hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-200 rounded-lg`}
        onClick={toggleDarkMode}
      >
        {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        {!isCollapsed && (
          <span className="ml-2">
            {isDark ? 'Light Mode' : 'Dark Mode'}
          </span>
        )}
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}