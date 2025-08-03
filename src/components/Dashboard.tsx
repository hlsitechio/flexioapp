import { useState, useEffect } from 'react';
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
import { gradients } from '@/pages/customization/gallery-gradient/gradients';

export function Dashboard() {
  const { editMode, setEditMode, dashboardBackground } = useSettings();
  const [draggedItem, setDraggedItem] = useState<KanbanItem | null>(null);
  
  
  // Apply mesh gradient styles when dashboardBackground changes
  useEffect(() => {
    const gradient = gradients.find(g => g.id === dashboardBackground);
    const dashboardElement = document.querySelector('.dashboard-background') as HTMLElement;
    
    if (gradient && 'style' in gradient && gradient.style && dashboardElement) {
      // Clear previous styles
      dashboardElement.style.background = '';
      dashboardElement.style.backdropFilter = '';
      dashboardElement.style.border = '';
      dashboardElement.style.boxShadow = '';
      dashboardElement.className = dashboardElement.className.replace(/glassmorphic-\w+/g, '');
      
      // Apply new styles with enhanced appearance
      Object.assign(dashboardElement.style, gradient.style);
      dashboardElement.classList.add(gradient.class.split(' ').find(cls => cls.startsWith('glassmorphic-')) || '');
      
      // Add smooth transition effect
      dashboardElement.style.transition = 'all 0.5s ease-in-out';
    }
  }, [dashboardBackground]);
  
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
      <div className={`min-h-screen flex w-full dashboard-background ${typeof dashboardBackground === 'string' && dashboardBackground.startsWith('bg-') ? dashboardBackground : ''}`}>
        <DashboardSidebar />
        
      <div className="flex-1 flex flex-col">
        <UnifiedHeader editMode={editMode} />
        
        <ImageBanner />
        
        <main className="flex-1 p-6">
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
  );
}