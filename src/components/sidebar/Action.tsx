import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Sidebar as SidebarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSidebar } from '@/components/ui/sidebar';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '@/contexts/SettingsContext';
import { useSidebarState } from '@/hooks/useSidebarState';

export function Action() {
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';
  const navigate = useNavigate();
  const { editMode } = useSettings();
  const { toggleSidebarTransparency } = useSidebarState();

  // Only show when in edit mode
  if (!editMode) {
    return null;
  }

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
      <div className={isCollapsed ? "flex justify-center" : "space-y-2"}>
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button 
            className={`${
              isCollapsed 
                ? 'w-10 h-10 p-0 hover:bg-sidebar-accent text-sidebar-foreground hover:text-sidebar-accent-foreground transition-all duration-300 flex items-center justify-center' 
                : 'w-full justify-start hover:bg-sidebar-accent text-sidebar-foreground hover:text-sidebar-accent-foreground transition-all duration-300'
            }`}
            variant="ghost"
            onClick={() => navigate('/components')}
          >
            <Plus className={isCollapsed ? "h-4 w-4" : "h-4 w-4"} />
            {!isCollapsed && (
              <span className="ml-2">Add Widget</span>
            )}
          </Button>
        </motion.div>
        
        {!isCollapsed && (
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              className="w-full justify-start hover:bg-sidebar-accent text-sidebar-foreground hover:text-sidebar-accent-foreground transition-all duration-300"
              variant="ghost"
              onClick={toggleSidebarTransparency}
            >
              <SidebarIcon className="h-4 w-4" />
              <span className="ml-2">Solid Sidebar</span>
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}