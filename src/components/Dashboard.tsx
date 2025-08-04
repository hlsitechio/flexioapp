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
import { GradientCoverageManager } from './gradient-coverage';

export function Dashboard() {
  const { editMode, setEditMode, dashboardBackground, gradientMode, minimalNavigationMode } = useSettings();
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

  // Prevent page reload in edit mode
  useEffect(() => {
    if (!editMode) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = 'You are in edit mode. Are you sure you want to leave?';
      return 'You are in edit mode. Are you sure you want to leave?';
    };

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href]');
      
      if (anchor && anchor.hasAttribute('href')) {
        const href = anchor.getAttribute('href');
        if (href && (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:'))) {
          // Allow external links, but prevent internal navigation
          return;
        }
        // Prevent navigation for internal links in edit mode
        e.preventDefault();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('click', handleClick, true);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('click', handleClick, true);
    };
  }, [editMode]);

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
        <div className={`min-h-screen w-full dashboard-container ${typeof dashboardBackground === 'string' && dashboardBackground.startsWith('bg-') ? dashboardBackground : ''}`}>
          {/* Single unified background container */}
          <div className="flex min-h-screen w-full">
            <div className="gradient-sidebar">
              <DashboardSidebar />
            </div>
            
            <div className="flex-1 flex flex-col">
              <div className="gradient-header">
                <UnifiedHeader editMode={editMode} />
              </div>
              
              <ImageBanner />
              
              <main className={`flex-1 main-content-area -ml-4 ${minimalNavigationMode ? 'pt-0 pr-1.5 pb-1.5' : 'p-1.5 pt-1.5'}`}>
                <div className="ml-4">
                  <GridLayout editMode={editMode} />
                </div>
              </main>
            </div>
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