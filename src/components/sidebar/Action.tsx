import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSidebar } from '@/components/ui/sidebar';
import { useNavigate } from 'react-router-dom';

export function Action() {
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';
  const navigate = useNavigate();

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
            className={`${
              isCollapsed 
                ? 'w-10 h-10 p-0 mx-auto hover:bg-sidebar-accent text-sidebar-foreground hover:text-sidebar-accent-foreground transition-all duration-300 flex items-center justify-center' 
                : 'w-full justify-start hover:bg-sidebar-accent text-sidebar-foreground hover:text-sidebar-accent-foreground transition-all duration-300'
            }`}
            variant="ghost"
            onClick={() => navigate('/components')}
          >
            <Plus className={isCollapsed ? "h-4 w-4" : "h-4 w-4"} />
            {!isCollapsed && (
              <span className="ml-2">Add Component</span>
            )}
          </Button>
        </motion.div>
      </div>
    </div>
  );
}