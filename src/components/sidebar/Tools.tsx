import { motion, AnimatePresence } from 'framer-motion';
import { useSidebar } from '@/components/ui/sidebar';
import { Wrench } from 'lucide-react';
import { SidebarCompactCalendar } from '@/components/calendar';
import { CountdownTimer, TaskCounter, QuickNote, RandomQuote } from './tools';

export function Tools() {
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  return (
    <div className="space-y-3">
      {isCollapsed ? (
        <div className="space-y-2">
          {/* Tools heading icon when collapsed */}
          <div className="flex justify-center">
            <button className="w-10 h-10 p-0 rounded-lg text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-all cursor-pointer flex items-center justify-center mx-auto">
              <Wrench className="h-4 w-4" />
            </button>
          </div>
          
          {/* Tool components in collapsed mode */}
          <SidebarCompactCalendar />
          <CountdownTimer />
          <TaskCounter />
          <QuickNote />
          <RandomQuote />
        </div>
      ) : (
        <>
          <AnimatePresence>
            <motion.h3
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, delay: 0.15 }}
              className="text-xs font-semibold text-sidebar-foreground/70 uppercase tracking-wider px-2 flex items-center space-x-1"
            >
              <Wrench className="h-3 w-3" />
              <span>Tools</span>
            </motion.h3>
          </AnimatePresence>
          
          <div className="space-y-3">
            {/* Mini Calendar Tool */}
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2, delay: 0.2 }}
              >
                <SidebarCompactCalendar />
              </motion.div>
            </AnimatePresence>

            {/* Countdown Timer */}
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2, delay: 0.25 }}
              >
                <CountdownTimer />
              </motion.div>
            </AnimatePresence>

            {/* Task Counter */}
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2, delay: 0.3 }}
              >
                <TaskCounter />
              </motion.div>
            </AnimatePresence>

            {/* Quick Note */}
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2, delay: 0.35 }}
              >
                <QuickNote />
              </motion.div>
            </AnimatePresence>

            {/* Random Quote */}
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2, delay: 0.4 }}
              >
                <RandomQuote />
              </motion.div>
            </AnimatePresence>
          </div>
        </>
      )}
    </div>
  );
}