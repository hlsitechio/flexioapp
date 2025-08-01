import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function SidebarDarkModeToggle() {
  const [isDark, setIsDark] = useState(false);

  const toggleDarkMode = () => {
    setIsDark(!isDark);
    // TODO: Implement actual dark mode functionality
  };

  return (
    <div className="px-4 py-2 border-b border-sidebar-border">
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleDarkMode}
        className="w-full justify-start text-sidebar-foreground hover:text-sidebar-primary transition-colors"
      >
        <motion.div
          key={isDark ? 'dark' : 'light'}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="flex items-center space-x-2"
        >
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
          <motion.span
            key={isDark ? 'dark-text' : 'light-text'}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, delay: 0.1 }}
          >
            {isDark ? 'Light Mode' : 'Dark Mode'}
          </motion.span>
        </motion.div>
      </Button>
    </div>
  );
}