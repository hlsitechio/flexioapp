import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { KanbanBoard as KanbanBoardCmp } from '@/components/kanban/KanbanBoard';
import type { KanbanColumn } from '@/types/kanban';

interface HeroKanbanTileProps {
  columns: KanbanColumn[];
  onColumnsChange: (cols: KanbanColumn[]) => void;
  className?: string;
}

function ColumnWave() {
  const bars = [12, 16, 10];
  return (
    <div className="flex items-end gap-0.5 h-4" aria-hidden>
      {bars.map((base, i) => (
        <motion.div
          key={i}
          className="w-1 rounded-sm bg-primary/70"
          initial={{ height: base - 4 }}
          animate={{ height: [base - 4, base + 4, base - 2, base] }}
          transition={{ duration: 1 + i * 0.1, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

export function HeroKanbanTile({ columns, onColumnsChange, className }: HeroKanbanTileProps) {
  const [dragging, setDragging] = React.useState(false);

  React.useEffect(() => {
    const up = () => setDragging(false);
    window.addEventListener('pointerup', up);
    window.addEventListener('mouseup', up);
    return () => {
      window.removeEventListener('pointerup', up);
      window.removeEventListener('mouseup', up);
    };
  }, []);

  return (
    <motion.div
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.995 }}
      animate={{ boxShadow: dragging ? '0 0 0 3px hsl(var(--primary) / 0.25)' : '0 0 0 0 hsl(var(--primary) / 0)' }}
      className={className}
      onPointerDown={() => setDragging(true)}
    >
      <Card className="lg:col-span-2 border-0 shadow-lg hover:shadow-2xl transition-shadow ring-1 ring-border/40 hover:ring-primary/40 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 dark:from-primary/10 dark:via-accent/10 dark:to-secondary/10">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-base">Kanban Board</CardTitle>
          <div className="flex items-center gap-2">
            <ColumnWave />
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
