import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSidebar } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

interface AnimatedSidebarTriggerProps {
  className?: string;
  minimalMode?: boolean;
}

export const AnimatedSidebarTrigger = React.forwardRef<
  HTMLButtonElement,
  AnimatedSidebarTriggerProps
>(({ className, minimalMode = false, ...props }, ref) => {
  const { toggleSidebar, state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  const handleClick = () => {
    toggleSidebar();
  };

  return (
    <motion.button
      ref={ref}
      onClick={handleClick}
      className={cn(
        "relative flex items-center justify-center w-10 h-10 overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors duration-200",
        minimalMode 
          ? "bg-gray-800/90 hover:bg-gray-700/90 text-white backdrop-blur-sm border-gray-600/50" 
          : "bg-sidebar-accent/50 hover:bg-sidebar-accent/80 text-sidebar-foreground backdrop-blur-sm border-sidebar-border/30",
        "border-0", // Remove rounded border as requested
        className
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      {...props}
    >
      {/* Animated hamburger menu */}
      <div className="relative w-5 h-4 flex flex-col justify-between">
        <motion.div
          className={cn(
            "h-0.5 w-full origin-center transition-colors duration-200",
            minimalMode ? "bg-white" : "bg-sidebar-foreground"
          )}
          animate={{
            rotate: isCollapsed ? 0 : 45,
            y: isCollapsed ? 0 : 6,
            opacity: isCollapsed ? 1 : 0.8
          }}
          transition={{ duration: 0.3, ease: [0.23, 1, 0.320, 1] }}
        />
        <AnimatePresence>
          {isCollapsed && (
            <motion.div
              className={cn(
                "h-0.5 w-full transition-colors duration-200",
                minimalMode ? "bg-white" : "bg-sidebar-foreground"
              )}
              initial={{ opacity: 1, scaleX: 1 }}
              animate={{ opacity: 1, scaleX: 1 }}
              exit={{ opacity: 0, scaleX: 0 }}
              transition={{ duration: 0.2, delay: 0.1 }}
            />
          )}
        </AnimatePresence>
        <motion.div
          className={cn(
            "h-0.5 w-full origin-center transition-colors duration-200",
            minimalMode ? "bg-white" : "bg-sidebar-foreground"
          )}
          animate={{
            rotate: isCollapsed ? 0 : -45,
            y: isCollapsed ? 0 : -6,
            opacity: isCollapsed ? 1 : 0.8
          }}
          transition={{ duration: 0.3, ease: [0.23, 1, 0.320, 1] }}
        />
      </div>

      {/* Subtle glow effect on hover */}
      <motion.div
        className="absolute inset-0 rounded-lg opacity-0"
        style={{
          background: minimalMode 
            ? "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)"
            : "radial-gradient(circle, hsl(var(--primary) / 0.1) 0%, transparent 70%)"
        }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      />

      <span className="sr-only">Toggle Sidebar</span>
    </motion.button>
  );
});

AnimatedSidebarTrigger.displayName = "AnimatedSidebarTrigger";