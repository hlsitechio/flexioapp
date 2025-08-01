import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSidebar, SidebarTrigger } from '@/components/ui/sidebar';
import { Crown } from 'lucide-react';

export function DashboardTitle() {
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between">
      {isCollapsed ? (
        <motion.button
          key="collapsed-button"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => navigate('/')}
          className="w-10 h-10 p-0 rounded-lg text-sidebar-foreground hover:text-sidebar-primary hover:bg-sidebar-accent transition-all cursor-pointer mx-auto flex items-center justify-center"
        >
          <Crown className="h-5 w-5" />
        </motion.button>
      ) : (
        <>
          <motion.button
            key="expanded-button"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => navigate('/')}
            className="text-lg font-semibold text-sidebar-foreground hover:text-sidebar-primary transition-colors cursor-pointer flex items-center space-x-2"
          >
            <Crown className="h-5 w-5" />
            <span>Premium Dashboard</span>
          </motion.button>
          <motion.div
            key="expanded-trigger"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <SidebarTrigger className="ml-auto text-sidebar-foreground hover:text-sidebar-primary transition-colors" />
          </motion.div>
        </>
      )}
    </div>
  );
}