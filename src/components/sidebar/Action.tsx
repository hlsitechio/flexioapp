import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useSidebar } from '@/components/ui/sidebar';

export function Action() {
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';
  const navigate = useNavigate();

  console.log('Action component render - isCollapsed:', isCollapsed);
  
  return (
    <div className="space-y-3">
      <AnimatePresence mode="wait">
        {!isCollapsed && (
          <motion.h3
            key="action-title"
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
            onClick={() => navigate('/components')}
          >
            <Plus className="h-4 w-4" />
            <AnimatePresence mode="wait">
              {!isCollapsed && (
                <motion.span
                  key="action-text"
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