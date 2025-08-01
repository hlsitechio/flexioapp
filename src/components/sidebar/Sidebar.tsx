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
  
  console.log('DashboardSidebar render - state:', state, 'isCollapsed:', isCollapsed);

  return (
    <motion.div
      initial={false}
      animate={{
        width: isCollapsed ? 60 : 300,
      }}
      transition={{
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1],
      }}
      className="relative"
      style={{
        border: 'none', 
        margin: '0', 
        padding: '0', 
        borderRight: 'none', 
        gap: '0'
      }}
    >
      <Sidebar 
        className="border-r-0 bg-sidebar-background backdrop-blur-xl h-full m-0 p-0 transition-all duration-300" 
        style={{border: 'none', margin: '0', padding: '0'}}
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

        <SidebarContent className="flex flex-col h-full">
          {/* Header - only when expanded */}
          {!isCollapsed && (
            <SidebarHeader className="p-4 border-b border-sidebar-border">
              <DashboardTitle />
            </SidebarHeader>
          )}

          {/* Main Content Area */}
          <div className={`flex-1 ${isCollapsed ? 'py-4' : 'px-6 py-4'} space-y-${isCollapsed ? '3' : '8'}`}>
            {/* Action Section */}
            <div className={`${isCollapsed ? 'flex justify-center' : 'space-y-3'}`}>
              <Action />
            </div>
            
            {/* Divider - only when expanded */}
            {!isCollapsed && <div className="border-t border-sidebar-border/50" />}
            
            {/* Tools Section */}
            <div className={`${isCollapsed ? 'flex justify-center' : 'space-y-3'}`}>
              <Tools />
            </div>
            
            {/* Divider - only when expanded */}
            {!isCollapsed && <div className="border-t border-sidebar-border/50" />}
            
            {/* Settings Section */}
            <div className={`${isCollapsed ? 'flex justify-center' : 'space-y-3'}`}>
              <Settings />
            </div>
          </div>

          {/* Bottom Section */}
          <div className={`${!isCollapsed ? 'border-t border-sidebar-border/50' : ''} mt-auto ${isCollapsed ? 'flex justify-center py-2' : ''}`}>
            <UserNavigation />
          </div>
        </SidebarContent>
      </Sidebar>
    </motion.div>
  );
}