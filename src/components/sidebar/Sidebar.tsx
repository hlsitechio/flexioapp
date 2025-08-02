import { motion } from 'framer-motion';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  useSidebar,
} from '@/components/ui/sidebar';
import { Edit3, Eye } from 'lucide-react';
import { DashboardTitle } from './DashboardTitle';
import { Action } from './Action';
import { Tools } from './Tools';
import { Settings } from './Settings';
import { UserNavigation } from './UserNavigation';
import { useSettings } from '@/contexts/SettingsContext';

export function DashboardSidebar() {
  const { editMode, setEditMode } = useSettings();
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
            {/* Edit Mode Toggle */}
            <div className="space-y-3">
              {isCollapsed ? (
                <div className="flex justify-center">
                  <button 
                    className="w-10 h-10 p-0 rounded-lg text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-all cursor-pointer flex items-center justify-center mx-auto"
                    onClick={() => setEditMode(!editMode)}
                  >
                    {editMode ? <Eye className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setEditMode(!editMode)}
                  className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-sidebar-accent transition-all cursor-pointer text-left"
                >
                  {editMode ? <Eye className="h-4 w-4 text-sidebar-foreground/70" /> : <Edit3 className="h-4 w-4 text-sidebar-foreground/70" />}
                  <div className="flex-1">
                    <div className="text-sm font-medium text-sidebar-foreground">
                      Edit Mode
                    </div>
                  </div>
                </button>
              )}
            </div>
            
            {/* Divider */}
            <div className="h-px bg-sidebar-border" />
            
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