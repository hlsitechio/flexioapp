import { Plus, User, Settings, LogIn, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';

export function DashboardSidebar() {
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  return (
    <motion.div
      initial={false}
      animate={{
        width: isCollapsed ? 60 : 280,
      }}
      transition={{
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1],
      }}
      className="relative"
    >
      <Sidebar className="border-r border-sidebar-border bg-sidebar-background backdrop-blur-xl h-full">
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
          <div className="flex items-center justify-between">
            <AnimatePresence>
              {!isCollapsed && (
                <motion.h2
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="text-lg font-semibold text-sidebar-foreground"
                >
                  Dashboard
                </motion.h2>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  <SidebarTrigger className="ml-auto text-sidebar-foreground hover:text-sidebar-primary transition-colors" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </SidebarHeader>

        <SidebarContent className="flex flex-col h-full">
          {/* Main Content Area with Panels */}
          <div className="flex-1 p-4 space-y-6">
            {/* Action Panel */}
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
                    className={`w-full ${
                      isCollapsed ? 'px-3' : 'justify-start'
                    } button-premium text-primary-foreground hover:shadow-lg transition-all duration-300`}
                    size={isCollapsed ? 'sm' : 'default'}
                  >
                    <Plus className="h-4 w-4" />
                    <AnimatePresence>
                      {!isCollapsed && (
                        <motion.span
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

            {/* Divider */}
            <div className="h-px bg-white/10" />

            {/* Tools Panel */}
            <div className="space-y-3">
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.h3
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2, delay: 0.15 }}
                    className="text-xs font-semibold text-sidebar-foreground/70 uppercase tracking-wider px-2"
                  >
                    Tools
                  </motion.h3>
                )}
              </AnimatePresence>
              <div className="space-y-2">
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2, delay: 0.2 }}
                      className="text-xs text-sidebar-foreground/50 px-2"
                    >
                      No tools available yet
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-white/10" />

            {/* Settings Panel */}
            <div className="space-y-3">
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.h3
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2, delay: 0.2 }}
                    className="text-xs font-semibold text-sidebar-foreground/70 uppercase tracking-wider px-2"
                  >
                    Settings
                  </motion.h3>
                )}
              </AnimatePresence>
              <div className="space-y-2">
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2, delay: 0.25 }}
                      className="text-xs text-sidebar-foreground/50 px-2"
                    >
                      No settings available yet
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Bottom Section - Profile, Settings, Sign In */}
          <div className="border-t border-white/10 p-4">
            <SidebarMenu className="space-y-1">
              <SidebarMenuItem>
                <motion.div whileHover={{ x: 2 }} transition={{ duration: 0.2 }}>
                  <SidebarMenuButton 
                    className={`w-full ${
                      isCollapsed ? 'justify-center px-3' : 'justify-start'
                    } hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-200 rounded-lg`}
                  >
                    <User className="h-4 w-4" />
                    <AnimatePresence>
                      {!isCollapsed && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: 'auto' }}
                          exit={{ opacity: 0, width: 0 }}
                          transition={{ duration: 0.2 }}
                          className="ml-2 overflow-hidden"
                        >
                          Profile
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </SidebarMenuButton>
                </motion.div>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <motion.div whileHover={{ x: 2 }} transition={{ duration: 0.2 }}>
                  <SidebarMenuButton 
                    className={`w-full ${
                      isCollapsed ? 'justify-center px-3' : 'justify-start'
                    } hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-200 rounded-lg`}
                  >
                    <Settings className="h-4 w-4" />
                    <AnimatePresence>
                      {!isCollapsed && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: 'auto' }}
                          exit={{ opacity: 0, width: 0 }}
                          transition={{ duration: 0.2 }}
                          className="ml-2 overflow-hidden"
                        >
                          Settings
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </SidebarMenuButton>
                </motion.div>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <motion.div whileHover={{ x: 2 }} transition={{ duration: 0.2 }}>
                  <SidebarMenuButton 
                    className={`w-full ${
                      isCollapsed ? 'justify-center px-3' : 'justify-start'
                    } hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-200 rounded-lg`}
                  >
                    <LogIn className="h-4 w-4" />
                    <AnimatePresence>
                      {!isCollapsed && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: 'auto' }}
                          exit={{ opacity: 0, width: 0 }}
                          transition={{ duration: 0.2 }}
                          className="ml-2 overflow-hidden"
                        >
                          Sign In
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </SidebarMenuButton>
                </motion.div>
              </SidebarMenuItem>
            </SidebarMenu>
          </div>
        </SidebarContent>
      </Sidebar>
    </motion.div>
  );
}