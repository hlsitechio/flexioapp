import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GripVertical, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnalyticsWidget {
  id: string;
  title: string;
  component: React.ComponentType<any>;
  props?: any;
  size: 'small' | 'medium' | 'large' | 'full';
}

interface SortableWidgetProps {
  widget: AnalyticsWidget;
  editMode: boolean;
  onRemove: (id: string) => void;
}

function SortableWidget({ widget, editMode, onRemove }: SortableWidgetProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: widget.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const sizeClasses = {
    small: 'col-span-1 row-span-1',
    medium: 'col-span-1 lg:col-span-2 row-span-1',
    large: 'col-span-1 lg:col-span-2 row-span-2',
    full: 'col-span-1 lg:col-span-3 row-span-1',
  };

  const Component = widget.component;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'relative',
        sizeClasses[widget.size],
        isDragging && 'z-50 opacity-50'
      )}
      {...attributes}
    >
      {editMode && (
        <div className="absolute top-2 right-2 z-10 flex gap-1">
          <Button
            size="sm"
            variant="outline"
            className="h-8 w-8 p-0 bg-background/80 backdrop-blur-sm"
            {...listeners}
          >
            <GripVertical className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-8 w-8 p-0 bg-background/80 backdrop-blur-sm"
            onClick={() => onRemove(widget.id)}
          >
            ×
          </Button>
        </div>
      )}
      
      <div className="h-full">
        <Component {...widget.props} />
      </div>
    </div>
  );
}

interface AnalyticsGridLayoutProps {
  widgets: AnalyticsWidget[];
  editMode: boolean;
  onWidgetsChange: (widgets: AnalyticsWidget[]) => void;
}

export function AnalyticsGridLayout({ 
  widgets, 
  editMode, 
  onWidgetsChange 
}: AnalyticsGridLayoutProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = widgets.findIndex((widget) => widget.id === active.id);
      const newIndex = widgets.findIndex((widget) => widget.id === over.id);

      onWidgetsChange(arrayMove(widgets, oldIndex, newIndex));
    }
  }

  function handleRemoveWidget(id: string) {
    onWidgetsChange(widgets.filter(widget => widget.id !== id));
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={widgets.map(w => w.id)}
        strategy={rectSortingStrategy}
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 auto-rows-fr">
          {widgets.map((widget) => (
            <SortableWidget
              key={widget.id}
              widget={widget}
              editMode={editMode}
              onRemove={handleRemoveWidget}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}