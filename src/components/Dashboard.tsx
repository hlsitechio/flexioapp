import { useState } from 'react';
import { DndContext, DragOverlay, closestCorners, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { DashboardSidebar } from './sidebar';
import { TopNavigation } from './top-navigation';
import { DashboardGrid } from './DashboardGrid';
import { KanbanCard } from './kanban/KanbanCard';
import { Button } from '@/components/ui/button';
import { Edit3, Eye } from 'lucide-react';
import { KanbanItem } from '@/types/kanban';
import { useSettings } from '@/contexts/SettingsContext';

export function Dashboard() {
  const { editMode, setEditMode } = useSettings();
  const [draggedItem, setDraggedItem] = useState<KanbanItem | null>(null);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    })
  );

  const handleDragStart = (event: any) => {
    const { active } = event;
    if (active.data.current?.item) {
      setDraggedItem(active.data.current.item);
    }
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="min-h-screen flex w-full bg-background">
        <DashboardSidebar />
        
      <div className="flex-1 flex flex-col">
        <TopNavigation editMode={editMode} />
        
        <main className="flex-1 p-6">
          <DashboardGrid editMode={editMode} setEditMode={setEditMode} />
        </main>
      </div>
      </div>
      
      <DragOverlay>
        {draggedItem ? (
          <KanbanCard item={draggedItem} isDragging />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}