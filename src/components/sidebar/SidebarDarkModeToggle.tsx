import { Sun, Moon } from 'lucide-react';
import { SidebarMenuItem, SidebarMenuButton, useSidebar } from '@/components/ui/sidebar';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';

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
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <SidebarMenuButton 
          className={`w-full ${
            isCollapsed ? 'w-10 h-10 p-0 justify-center mx-auto flex items-center' : 'justify-start'
          } hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-300 rounded-lg overflow-hidden`}
          onClick={toggleDarkMode}
        >
          <div className="relative flex items-center justify-center w-4 h-4">
            <AnimatePresence mode="wait">
              {isDark ? (
                <motion.div
                  key="moon"
                  initial={{ opacity: 0, rotate: -90, scale: 0.8 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 90, scale: 0.8 }}
                  transition={{ 
                    duration: 0.4, 
                    ease: [0.23, 1, 0.320, 1],
                    opacity: { duration: 0.2 }
                  }}
                  className="absolute"
                >
                  <Moon className="h-4 w-4" />
                </motion.div>
              ) : (
                <motion.div
                  key="sun"
                  initial={{ opacity: 0, rotate: -90, scale: 0.8 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 90, scale: 0.8 }}
                  transition={{ 
                    duration: 0.4, 
                    ease: [0.23, 1, 0.320, 1],
                    opacity: { duration: 0.2 }
                  }}
                  className="absolute"
                >
                  <Sun className="h-4 w-4" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {!isCollapsed && (
            <motion.span 
              className="ml-2"
              key={isDark ? 'light-text' : 'dark-text'}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            >
              {isDark ? 'Light Mode' : 'Dark Mode'}
            </motion.span>
          )}
        </SidebarMenuButton>
      </motion.div>
    </SidebarMenuItem>
  );
}