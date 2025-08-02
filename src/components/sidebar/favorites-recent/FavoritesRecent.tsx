import { motion, AnimatePresence } from 'framer-motion';
import { useSidebar } from '@/components/ui/sidebar';
import { Heart, Star, Pin, Activity } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useState } from 'react';
import { StarredTasks } from './StarredTasks';
import { PinnedNotes } from './PinnedNotes';
import { RecentActivity } from './RecentActivity';

interface FavoritesRecentProps {}

export function FavoritesRecent({}: FavoritesRecentProps) {
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';
  const [openSections, setOpenSections] = useState({
    starred: true,
    pinned: true,
    recent: true
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  if (isCollapsed) {
    return (
      <div className="space-y-4">
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="space-y-3"
          >
            <div className="flex justify-center">
              <Heart className="h-4 w-4 text-primary" />
            </div>
            <StarredTasks isCollapsed={true} />
            <PinnedNotes isCollapsed={true} />
            <RecentActivity isCollapsed={true} />
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <AnimatePresence>
        <motion.h3
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2, delay: 0.2 }}
          className="text-xs font-semibold text-sidebar-foreground/70 uppercase tracking-wider px-2 flex items-center space-x-1"
        >
          <Heart className="h-3 w-3" />
          <span>Favorites & Recent</span>
        </motion.h3>
      </AnimatePresence>

      <div className="space-y-3">
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2, delay: 0.25 }}
            className="space-y-3"
          >
            {/* Starred Tasks */}
            <Collapsible 
              open={openSections.starred} 
              onOpenChange={() => toggleSection('starred')}
            >
              <CollapsibleTrigger className="flex items-center justify-between w-full px-2 py-1 text-xs font-medium text-sidebar-foreground/80 hover:text-sidebar-foreground transition-colors">
                <div className="flex items-center gap-2">
                  <Star className="h-3 w-3" />
                  <span>Starred</span>
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-1">
                <StarredTasks isCollapsed={false} />
              </CollapsibleContent>
            </Collapsible>

            {/* Pinned Notes */}
            <Collapsible 
              open={openSections.pinned} 
              onOpenChange={() => toggleSection('pinned')}
            >
              <CollapsibleTrigger className="flex items-center justify-between w-full px-2 py-1 text-xs font-medium text-sidebar-foreground/80 hover:text-sidebar-foreground transition-colors">
                <div className="flex items-center gap-2">
                  <Pin className="h-3 w-3" />
                  <span>Pinned</span>
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-1">
                <PinnedNotes isCollapsed={false} />
              </CollapsibleContent>
            </Collapsible>

            {/* Recent Activity */}
            <Collapsible 
              open={openSections.recent} 
              onOpenChange={() => toggleSection('recent')}
            >
              <CollapsibleTrigger className="flex items-center justify-between w-full px-2 py-1 text-xs font-medium text-sidebar-foreground/80 hover:text-sidebar-foreground transition-colors">
                <div className="flex items-center gap-2">
                  <Activity className="h-3 w-3" />
                  <span>Recent</span>
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-1">
                <RecentActivity isCollapsed={false} />
              </CollapsibleContent>
            </Collapsible>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}