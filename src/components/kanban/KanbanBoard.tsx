import React from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverEvent,
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useState } from 'react';
import { KanbanColumn as KanbanColumnType, KanbanItem } from '@/types/kanban';
import { KanbanColumn } from './KanbanColumn';
import { KanbanCard } from './KanbanCard';

interface KanbanBoardProps {
  columns: KanbanColumnType[];
  onColumnsChange: (columns: KanbanColumnType[]) => void;
  className?: string;
}

export function KanbanBoard({ columns, onColumnsChange, className = '' }: KanbanBoardProps) {
  const [activeItem, setActiveItem] = useState<KanbanItem | null>(null);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const activeColumn = columns.find(col => 
      col.items.some(item => item.id === active.id)
    );
    const activeItemData = activeColumn?.items.find(item => item.id === active.id);
    
    if (activeItemData) {
      setActiveItem(activeItemData);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    // Find the columns
    const activeColumn = columns.find(col => 
      col.items.some(item => item.id === activeId) || col.id === activeId
    );
    const overColumn = columns.find(col => 
      col.items.some(item => item.id === overId) || col.id === overId
    );

    if (!activeColumn || !overColumn) return;

    // Moving between different columns
    if (activeColumn.id !== overColumn.id) {
      const activeItems = activeColumn.items;
      const overItems = overColumn.items;

      const activeIndex = activeItems.findIndex(item => item.id === activeId);
      const overIndex = overItems.findIndex(item => item.id === overId);

      if (activeIndex !== -1) {
        const [removedItem] = activeItems.splice(activeIndex, 1);
        
        // If dropping on a column, add to end; if on item, insert at position
        if (overColumn.id === overId) {
          overItems.push(removedItem);
        } else {
          overItems.splice(overIndex, 0, removedItem);
        }

        const newColumns = columns.map(col => {
          if (col.id === activeColumn.id) {
            return { ...col, items: activeItems };
          }
          if (col.id === overColumn.id) {
            return { ...col, items: overItems };
          }
          return col;
        });

        onColumnsChange(newColumns);
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    setActiveItem(null);
    
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    // Find the column containing the active item
    const activeColumn = columns.find(col => 
      col.items.some(item => item.id === activeId)
    );

    if (!activeColumn) return;

    const activeIndex = activeColumn.items.findIndex(item => item.id === activeId);
    const overIndex = activeColumn.items.findIndex(item => item.id === overId);

    // Reordering within the same column
    if (activeIndex !== overIndex && activeIndex !== -1 && overIndex !== -1) {
      const newItems = arrayMove(activeColumn.items, activeIndex, overIndex);
      
      const newColumns = columns.map(col => 
        col.id === activeColumn.id 
          ? { ...col, items: newItems }
          : col
      );

      onColumnsChange(newColumns);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className={`flex gap-6 h-full w-full ${className}`}>
        {columns.map((column) => (
          <KanbanColumn
            key={column.id}
            column={column}
          />
        ))}
      </div>
      
      <DragOverlay>
        {activeItem ? (
          <KanbanCard 
            item={activeItem} 
            isDragging 
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}