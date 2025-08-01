import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSidebar, SidebarTrigger } from '@/components/ui/sidebar';
import { Crown } from 'lucide-react';

export function DashboardTitle() {
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between">
      <AnimatePresence>
        {!isCollapsed && (
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            onClick={() => navigate('/')}
            className="text-lg font-semibold text-sidebar-foreground hover:text-sidebar-primary transition-colors cursor-pointer flex items-center space-x-2"
          >
            <Crown className="h-5 w-5" />
            <span>Premium Dashboard</span>
          </motion.button>
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