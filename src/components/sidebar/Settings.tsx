import { motion, AnimatePresence } from 'framer-motion';
import { useSidebar } from '@/components/ui/sidebar';
import { Settings as SettingsIcon } from 'lucide-react';

export function Settings() {
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  return (
    <div className="space-y-3">
      {isCollapsed ? (
        <div className="flex justify-center">
          <div className="p-2 rounded-lg text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-all cursor-pointer">
            <SettingsIcon className="h-4 w-4" />
          </div>
        </div>
      ) : (
        <>
          <AnimatePresence>
            <motion.h3
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, delay: 0.2 }}
              className="text-xs font-semibold text-sidebar-foreground/70 uppercase tracking-wider px-2 flex items-center space-x-1"
            >
              <SettingsIcon className="h-3 w-3" />
              <span>Settings</span>
            </motion.h3>
          </AnimatePresence>
          <div className="space-y-2">
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2, delay: 0.25 }}
                className="text-xs text-sidebar-foreground/50 px-2"
              >
                No settings available yet
              </motion.div>
            </AnimatePresence>
          </div>
        </>
      )}
    </div>
  );
}