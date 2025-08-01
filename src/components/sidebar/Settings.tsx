import { motion, AnimatePresence } from 'framer-motion';
import { useSidebar } from '@/components/ui/sidebar';
import { Settings as SettingsIcon, Edit3, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

interface SettingsProps {
  editMode?: boolean;
  setEditMode?: (editMode: boolean) => void;
}

export function Settings({ editMode = false, setEditMode }: SettingsProps) {
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  return (
    <div className="space-y-3">
      {isCollapsed ? (
        <div className="flex justify-center">
          <button 
            className="w-10 h-10 p-0 rounded-lg text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-all cursor-pointer flex items-center justify-center mx-auto"
            onClick={() => setEditMode && setEditMode(!editMode)}
          >
            {editMode ? <Eye className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
          </button>
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
                className="px-2 space-y-3"
              >
                {/* Edit Mode */}
                <button
                  onClick={() => setEditMode && setEditMode(!editMode)}
                  className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-sidebar-accent transition-all cursor-pointer text-left"
                >
                  {editMode ? <Eye className="h-4 w-4 text-sidebar-foreground/70" /> : <Edit3 className="h-4 w-4 text-sidebar-foreground/70" />}
                  <div className="flex-1">
                    <div className="text-sm font-medium text-sidebar-foreground">
                      Edit Mode
                    </div>
                  </div>
                </button>
              </motion.div>
            </AnimatePresence>
          </div>
        </>
      )}
    </div>
  );
}