import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import RealtimeSparkline from './RealtimeSparkline';
import { KanbanBoard as KanbanBoardCmp } from '@/components/kanban/KanbanBoard';
import type { KanbanColumn } from '@/types/kanban';

interface HeroKanbanTileProps {
  columns: KanbanColumn[];
  onColumnsChange: (cols: KanbanColumn[]) => void;
  className?: string;
}

export function HeroKanbanTile({ columns, onColumnsChange, className }: HeroKanbanTileProps) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.995 }}
      className={className}
    >
      <Card className="lg:col-span-2 border-0 shadow-lg hover:shadow-2xl transition-shadow ring-1 ring-border/40 hover:ring-primary/40 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 dark:from-primary/10 dark:via-accent/10 dark:to-secondary/10">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-base">Kanban Board</CardTitle>
          <div className="flex items-center gap-2">
            <RealtimeSparkline />
            <Badge variant="secondary" className="pulse">Live</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <KanbanBoardCmp
            columns={columns}
            onColumnsChange={onColumnsChange}
            className="p-1"
          />
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default HeroKanbanTile;
