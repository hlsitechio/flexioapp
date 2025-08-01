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
        return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'component':
        return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'tool':
        return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
      default:
        return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
    }
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`
        group cursor-grab active:cursor-grabbing p-3 space-y-2
        transition-all duration-200 hover:shadow-md
        ${isDragging || isSortableDragging ? 'shadow-lg rotate-3 opacity-80' : ''}
        ${isDragging ? 'z-50' : ''}
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