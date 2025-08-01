import { motion } from 'framer-motion';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  useSidebar,
} from '@/components/ui/sidebar';
import { DashboardTitle } from './DashboardTitle';
import { Action } from './Action';
import { Tools } from './Tools';
import { Settings } from './Settings';
import { UserNavigation } from './UserNavigation';
import { useSettings } from '@/contexts/SettingsContext';

export function DashboardSidebar() {
  const { editMode } = useSettings();
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

        <SidebarHeader className="p-4 border-b border-sidebar-border">
          <DashboardTitle editMode={editMode} />
        </SidebarHeader>

        <SidebarContent className="flex flex-col h-full">
          {/* Main Content Area with Panels */}
          <div className="flex-1 p-4 space-y-6">
            <Action />
            
            {/* Divider */}
            <div className="h-px bg-sidebar-border" />
            
            <Tools />
            
            {/* Divider */}
            <div className="h-px bg-sidebar-border" />
            
            <Settings />
          </div>

          {/* Bottom Section - Profile, Settings, Sign In */}
          <UserNavigation />
        </SidebarContent>
      </Sidebar>
    </motion.div>
  );
}