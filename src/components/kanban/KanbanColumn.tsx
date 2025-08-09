import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { KanbanColumn as KanbanColumnType } from '@/types/kanban';
import { KanbanCard } from './KanbanCard';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface KanbanColumnProps {
  column: KanbanColumnType;
}

export function KanbanColumn({ column }: KanbanColumnProps) {
  const {
    setNodeRef,
    isOver,
  } = useDroppable({
    id: column.id,
    data: {
      type: 'column',
      columnId: column.id,
      accepts: ['widget', 'component', 'tool'],
    },
  });

  return (
    <Card
      ref={setNodeRef}
      className={`
        flex-1 min-w-0 flex flex-col bg-card/60 backdrop-blur-sm
        transition-all duration-300 ease-out border-2 hover:shadow-md
        ${isOver ? 'border-primary/50 ring-2 ring-primary/30 bg-primary/5 pulse' : 'border-border/50'}
      `}
    >
      {/* Column Header */}
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-card-foreground">
            {column.title}
          </h3>
          <Badge variant="secondary" className="text-xs">
            {column.items.length}
            {column.maxItems && `/${column.maxItems}`}
          </Badge>
        </div>
      </div>

      {/* Column Content */}
      <div className="flex-1 p-4 space-y-3 min-h-[220px] max-h-[calc(100vh-300px)] overflow-y-auto">
        <SortableContext
          items={column.items.map(item => item.id)}
          strategy={verticalListSortingStrategy}
        >
          {column.items.map((item) => (
            <KanbanCard
              key={item.id}
              item={item}
            />
          ))}
        </SortableContext>
        
        {/* Empty State */}
        {column.items.length === 0 && (
          <div className="flex items-center justify-center h-32 text-muted-foreground text-sm border-2 border-dashed border-border/30 rounded-lg">
            Drop items here
          </div>
        )}
      </div>
    </Card>
  );
}