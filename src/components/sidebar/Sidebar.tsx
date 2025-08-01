import { ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { DashboardTitle } from './DashboardTitle';
import { Action } from './Action';
import { Tools } from './Tools';
import { Settings } from './Settings';
import { UserNavigation } from './UserNavigation';

export function DashboardSidebar() {
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  return (
    <motion.div
      initial={false}
      animate={{
        width: isCollapsed ? 64 : 280,
      }}
      transition={{
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1],
      }}
      className="relative"
    >
      <Sidebar 
        className="border-r border-sidebar-border bg-sidebar-background backdrop-blur-xl h-full"
        collapsible="icon"
      >
        {/* Collapsed state expand button */}
        <AnimatePresence>
          {isCollapsed && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="absolute -right-3 top-4 z-50"
            >
              <SidebarTrigger className="h-6 w-6 rounded-full bg-sidebar-primary hover:bg-sidebar-primary/80 text-sidebar-primary-foreground shadow-lg border border-sidebar-border/50 p-0">
                <ChevronRight className="h-3 w-3" />
              </SidebarTrigger>
            </motion.div>
          )}
        </AnimatePresence>

        <SidebarHeader className="p-4 border-b border-sidebar-border">
          <DashboardTitle />
        </SidebarHeader>

        <SidebarContent className="flex flex-col h-full">
          {/* Main Content Area with Panels */}
          <div className="flex-1 p-4 space-y-6">
            <Action />
            
            {/* Divider */}
            <div className="h-px bg-white/10" />
            
            <Tools />
            
            {/* Divider */}
            <div className="h-px bg-white/10" />
            
            <Settings />
          </div>

          {/* Bottom Section - Profile, Settings, Sign In */}
          <UserNavigation />
        </SidebarContent>
      </Sidebar>
    </motion.div>
  );
}