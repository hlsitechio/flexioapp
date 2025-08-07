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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GripVertical, Settings, MoreVertical, Grid3X3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GridSize, getGridDimensions, isVerticalGrid, isSquareGrid } from '@/components/grid-layouts';

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
  gridSize?: GridSize;
  onGridSizeChange?: (size: GridSize) => void;
}

export function AnalyticsGridLayout({ 
  widgets, 
  editMode, 
  onWidgetsChange,
  gridSize = '3x3',
  onGridSizeChange
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

  const getGridIcon = (size: GridSize) => {
    if (isVerticalGrid(size)) {
      return <MoreVertical className="h-4 w-4 text-primary" />;
    }
    return <Grid3X3 className="h-4 w-4 text-primary" />;
  };

  const getGridClasses = (size: GridSize) => {
    const dimensions = getGridDimensions(size);
    const { rows, cols } = dimensions;
    
    // Use responsive grid for analytics
    if (cols === 1) {
      return 'grid grid-cols-1 gap-6 auto-rows-fr';
    } else if (cols === 2) {
      return 'grid grid-cols-1 lg:grid-cols-2 gap-6 auto-rows-fr';
    } else {
      return 'grid grid-cols-1 lg:grid-cols-3 gap-6 auto-rows-fr';
    }
  };

  return (
    <div className="w-full">
      {/* Grid Size Selector */}
      {editMode && onGridSizeChange && (
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              {getGridIcon(gridSize)}
              <span className="text-sm font-medium text-foreground">Grid Size</span>
            </div>
            
            {/* Vertical Grids Dropdown */}
            <div className="flex items-center space-x-2">
              <MoreVertical className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground">Vertical</span>
              <Select 
                value={isVerticalGrid(gridSize) ? gridSize : ''} 
                onValueChange={onGridSizeChange}
              >
                <SelectTrigger className="w-24 bg-background border-border z-50">
                  <SelectValue placeholder="1x" />
                </SelectTrigger>
                <SelectContent className="bg-background border-border shadow-lg z-50">
                  <SelectItem value="1x2">1×2</SelectItem>
                  <SelectItem value="1x3">1×3</SelectItem>
                  <SelectItem value="1x4">1×4</SelectItem>
                  <SelectItem value="1x6">1×6</SelectItem>
                  <SelectItem value="1x8">1×8</SelectItem>
                  <SelectItem value="1x12">1×12</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Square Grids Dropdown */}
            <div className="flex items-center space-x-2">
              <Grid3X3 className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground">Square</span>
              <Select 
                value={isSquareGrid(gridSize) ? gridSize : ''} 
                onValueChange={onGridSizeChange}
              >
                <SelectTrigger className="w-24 bg-background border-border z-50">
                  <SelectValue placeholder="NxN" />
                </SelectTrigger>
                <SelectContent className="bg-background border-border shadow-lg z-50">
                  <SelectItem value="2x2">2×2</SelectItem>
                  <SelectItem value="3x3">3×3</SelectItem>
                  <SelectItem value="4x4">4×4</SelectItem>
                  <SelectItem value="6x6">6×6</SelectItem>
                  <SelectItem value="9x9">9×9</SelectItem>
                  <SelectItem value="12x12">12×12</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={widgets.map(w => w.id)}
          strategy={rectSortingStrategy}
        >
          <div className={getGridClasses(gridSize)}>
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
    </div>
  );
}