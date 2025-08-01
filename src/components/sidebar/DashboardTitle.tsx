import { motion, AnimatePresence } from 'framer-motion';
import { useSidebar, SidebarTrigger } from '@/components/ui/sidebar';

export function DashboardTitle() {
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  return (
    <div className="flex items-center justify-between">
      <AnimatePresence>
        {!isCollapsed && (
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="text-lg font-semibold text-sidebar-foreground"
          >
            Dashboard
          </motion.h2>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            <SidebarTrigger className="ml-auto text-sidebar-foreground hover:text-sidebar-primary transition-colors" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}