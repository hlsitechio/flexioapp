import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSidebar } from '@/components/ui/sidebar';

export function Action() {
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  return (
    <div className="space-y-3">
      <AnimatePresence>
        {!isCollapsed && (
          <motion.h3
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, delay: 0.1 }}
            className="text-xs font-semibold text-sidebar-foreground/70 uppercase tracking-wider px-2"
          >
            Action
          </motion.h3>
        )}
      </AnimatePresence>
      <div className="space-y-2">
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button 
            className={`w-full ${
              isCollapsed ? 'px-3' : 'justify-start'
            } button-premium text-primary-foreground hover:shadow-lg transition-all duration-300`}
            size={isCollapsed ? 'sm' : 'default'}
          >
            <Plus className="h-4 w-4" />
            <AnimatePresence>
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="ml-2 overflow-hidden"
                >
                  Add Component
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
        </motion.div>
      </div>
    </div>
  );
}