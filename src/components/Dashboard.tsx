import { useState } from 'react';
import { DndContext, DragOverlay, closestCorners, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { DashboardSidebar } from './sidebar';
import { NotificationSidebar } from './sidebar/notifications';
import { UnifiedHeader } from './top-navigation';
import { GridLayout } from './GridLayout';
import { ImageBanner } from './banner';
import { KanbanCard } from './kanban/KanbanCard';
import { Button } from '@/components/ui/button';
import { Edit3, Eye } from 'lucide-react';
import { KanbanItem } from '@/types/kanban';
import { useSettings } from '@/contexts/SettingsContext';
import { GradientCoverageManager } from './gradient-coverage';

export function Dashboard() {
  const { editMode, setEditMode, dashboardBackground, gradientMode } = useSettings();
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
    <>
      {/* Gradient Coverage Manager - handles all gradient application */}
      <GradientCoverageManager />
      
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className={`min-h-screen flex w-full dashboard-container ${typeof dashboardBackground === 'string' && dashboardBackground.startsWith('bg-') ? dashboardBackground : ''}`}>
          <div className="gradient-sidebar">
            <DashboardSidebar />
          </div>
          
          <div className="flex-1 flex flex-col -ml-px">
            <div className="gradient-header rounded-b-lg">
              <UnifiedHeader editMode={editMode} />
            </div>
            
            <ImageBanner />
            
            <main className="flex-1 p-6 main-content-area">
              <GridLayout editMode={editMode} />
            </main>
          </div>
        </div>
        
        {/* Notification Sidebar */}
        <NotificationSidebar />
        
        <DragOverlay>
          {draggedItem ? (
            <KanbanCard item={draggedItem} isDragging />
          ) : null}
        </DragOverlay>
      </DndContext>
    </>
  );
}