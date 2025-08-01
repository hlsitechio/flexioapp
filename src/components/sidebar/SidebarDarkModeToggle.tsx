import { Sun, Moon } from 'lucide-react';
import { SidebarMenuItem, SidebarMenuButton, useSidebar } from '@/components/ui/sidebar';
import { useTheme } from 'next-themes';

export function SidebarDarkModeToggle() {
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';

  const toggleDarkMode = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <SidebarMenuItem>
      <SidebarMenuButton 
        className={`w-full ${
          isCollapsed ? 'w-10 h-10 p-0 justify-center mx-auto flex items-center' : 'justify-start'
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