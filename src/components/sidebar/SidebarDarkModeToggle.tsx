import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
      <motion.div whileHover={{ x: 2 }} transition={{ duration: 0.2 }}>
        <SidebarMenuButton 
          className={`w-full ${
            isCollapsed ? 'justify-center px-3' : 'justify-start'
          } hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-200 rounded-lg`}
          onClick={toggleDarkMode}
        >
          {/* Icon Animation */}
          <AnimatePresence mode="wait">
              {isDark ? (
                <motion.div
                  key="moon"
                  initial={{ rotate: -180, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 180, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Moon className="h-4 w-4" />
                </motion.div>
              ) : (
                <motion.div
                  key="sun"
                  initial={{ rotate: 180, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -180, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Sun className="h-4 w-4" />
                </motion.div>
              )}
          </AnimatePresence>
          
          {/* Text with smoother transition */}
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="ml-2 overflow-hidden"
              >
                <motion.span
                  key={isDark ? 'dark-text' : 'light-text'}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                >
                  {isDark ? 'Light Mode' : 'Dark Mode'}
                </motion.span>
              </motion.span>
            )}
          </AnimatePresence>
        </SidebarMenuButton>
      </motion.div>
    </SidebarMenuItem>
  );
}