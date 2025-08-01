import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSidebar } from '@/components/ui/sidebar';
import { Crown, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';

interface DashboardTitleProps {
  editMode?: boolean;
}

export function DashboardTitle({ editMode = false }: DashboardTitleProps) {
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';
  const navigate = useNavigate();
  const [showCrown, setShowCrown] = useState(true);
  const [customTitle, setCustomTitle] = useState('Premium Dashboard');
  const [isCustomizing, setIsCustomizing] = useState(false);

  return (
    <div className="flex items-center justify-center w-full">
      {isCollapsed ? (
        <motion.button 
          initial={{ opacity: 0, scale: 0.8 }} 
          animate={{ opacity: 1, scale: 1 }} 
          onClick={() => navigate('/')} 
          className="w-10 h-10 p-0 rounded-lg text-sidebar-foreground hover:text-sidebar-primary hover:bg-sidebar-accent transition-all cursor-pointer flex items-center justify-center"
        >
          {showCrown && <Crown className="h-4 w-4" />}
        </motion.button>
      ) : (
        <div className="w-full space-y-2">
          <motion.button 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => navigate('/')} 
            className="text-lg font-semibold text-sidebar-foreground hover:text-sidebar-primary transition-colors cursor-pointer flex items-center space-x-2"
          >
            {showCrown && <Crown className="h-5 w-5" />}
            <span>{customTitle}</span>
          </motion.button>
          
          {editMode && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: 0.1 }}
            >
              <Popover open={isCustomizing} onOpenChange={setIsCustomizing}>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm" className="w-full text-xs h-6 text-sidebar-foreground/60 hover:text-sidebar-foreground">
                    <Settings className="h-3 w-3 mr-1" />
                    Customize Title
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64" side="right" align="start">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Sidebar Title</Label>
                      <Input
                        value={customTitle}
                        onChange={(e) => setCustomTitle(e.target.value)}
                        placeholder="Enter custom title"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium">Show Crown Icon</Label>
                        <Switch
                          checked={showCrown}
                          onCheckedChange={setShowCrown}
                        />
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}