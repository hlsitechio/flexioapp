import { motion, AnimatePresence } from 'framer-motion';
import { useSidebar } from '@/components/ui/sidebar';
import { Wrench } from 'lucide-react';

export function Tools() {
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  console.log('Tools component render - isCollapsed:', isCollapsed);
  
  if (isCollapsed) {
    return (
      <div className="flex justify-center">
        <button 
          className="p-2 rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
          title="Tools"
        >
          <Wrench className="h-4 w-4" />
        </button>
      </div>
    );
  }
  
  return (
    <div className="space-y-3">
      <AnimatePresence mode="wait">
        <motion.h3
          key="tools-title"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2, delay: 0.15 }}
          className="text-xs font-semibold text-sidebar-foreground/70 uppercase tracking-wider px-2 flex items-center space-x-1"
        >
          <Wrench className="h-3 w-3" />
          <span>Tools</span>
        </motion.h3>
      </AnimatePresence>
      <div className="space-y-2">
        <AnimatePresence mode="wait">
          <motion.div
            key="tools-content"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2, delay: 0.2 }}
            className="text-xs text-sidebar-foreground/50 px-2"
          >
            No tools available yet
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}