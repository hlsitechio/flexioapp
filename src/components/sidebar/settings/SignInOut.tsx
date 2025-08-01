import { motion, AnimatePresence } from 'framer-motion';
import { LogIn } from 'lucide-react';
import { SidebarMenuItem, SidebarMenuButton, useSidebar } from '@/components/ui/sidebar';

export function SignInOut() {
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  return (
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
  );
}