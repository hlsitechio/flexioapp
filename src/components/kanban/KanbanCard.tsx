import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { KanbanItem } from '@/types/kanban';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Grip, LayoutDashboard, Puzzle, Wrench } from 'lucide-react';

interface KanbanCardProps {
  item: KanbanItem;
  isDragging?: boolean;
}

export function KanbanCard({ item, isDragging = false }: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({
    id: item.id,
    data: {
      type: 'item',
      item,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getIcon = () => {
    switch (item.type) {
      case 'widget':
        return <LayoutDashboard className="h-4 w-4" />;
      case 'component':
        return <Puzzle className="h-4 w-4" />;
      case 'tool':
        return <Wrench className="h-4 w-4" />;
      default:
        return <LayoutDashboard className="h-4 w-4" />;
    }
  };

  const getTypeColor = () => {
    switch (item.type) {
      case 'widget':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'component':
        return 'bg-secondary/10 text-secondary-foreground border-secondary/20';
      case 'tool':
        return 'bg-accent/10 text-accent-foreground border-accent/20';
      default:
        return 'bg-muted/30 text-muted-foreground border-border/30';
    }
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`
        group cursor-grab active:cursor-grabbing p-3 space-y-2
        transition-all duration-300 ease-out hover:shadow-md hover-scale
        ring-1 ring-transparent group-hover:ring-primary/20 bg-background/80 backdrop-blur-sm
        ${isDragging || isSortableDragging ? 'scale-[1.03] rotate-2 shadow-xl ring-primary/30 bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10' : ''}
        ${isDragging ? 'z-50 pointer-events-none' : ''}
      `}
      {...attributes}
      {...listeners}
    >
      {/* Card Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-2 flex-1">
          {getIcon()}
          <h4 className="font-medium text-sm text-card-foreground line-clamp-1">
            {item.title}
          </h4>
        </div>
        <div className="flex items-center space-x-1">
          <Badge variant="outline" className={`text-xs ${getTypeColor()}`}>
            {item.type}
          </Badge>
          <Grip className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>

      {/* Card Content - Hidden when content is empty */}
      {item.content && (
        <p className="text-xs text-muted-foreground line-clamp-2">
          {item.content}
        </p>
      )}

      {/* Card Data Preview */}
      {item.data && Object.keys(item.data).length > 0 && (
        <div className="pt-2 border-t border-border/30">
          <div className="flex flex-wrap gap-1">
            {Object.entries(item.data).slice(0, 3).map(([key, value]) => (
              <Badge key={key} variant="secondary" className="text-xs">
                {key}: {String(value).slice(0, 10)}
              </Badge>
            ))}
            {Object.keys(item.data).length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{Object.keys(item.data).length - 3}
              </Badge>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}