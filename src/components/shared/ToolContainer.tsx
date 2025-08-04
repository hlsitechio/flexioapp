import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { useSidebar } from '@/components/ui/sidebar';

interface ToolContainerProps {
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
  collapsedContent?: React.ReactNode;
  className?: string;
}

export function ToolContainer({ 
  title, 
  icon: Icon, 
  children, 
  collapsedContent,
  className = "" 
}: ToolContainerProps) {
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  if (isCollapsed && collapsedContent) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`p-2 rounded-lg border bg-card text-card-foreground ${className}`}
      >
        {collapsedContent}
      </motion.div>
    );
  }

  if (isCollapsed) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`p-2 rounded-lg border bg-card text-card-foreground ${className}`}
      >
        <div className="flex flex-col items-center space-y-1">
          <Icon className="h-4 w-4 text-primary" />
          <div className="text-[10px] text-muted-foreground text-center">
            {title}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.2 }}
      >
        <Card className={`animate-fade-in ${className}`}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Icon className="h-5 w-5 text-primary" />
              {title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {children}
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}