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
  const { editMode, setEditMode, dashboardBackground, gradientMode } = useSettings();
  const [draggedItem, setDraggedItem] = useState<KanbanItem | null>(null);
  
  
  // Apply mesh gradient styles when dashboardBackground or gradientMode changes
  useEffect(() => {
    const gradient = gradients.find(g => g.id === dashboardBackground);
    
    if (gradient && 'style' in gradient && gradient.style) {
      const glassmorphicClass = gradient.class.split(' ').find(cls => cls.startsWith('glassmorphic-')) || '';
      const gradientStyle = { ...gradient.style as React.CSSProperties, transition: 'all 0.5s ease-in-out' };
      
      // Clear all previous gradient styles from all potential targets
      const allSelectors = [
        '.dashboard-container',
        '.main-content-area', 
        '[data-sidebar="sidebar"]',
        '[data-component="header"]'
      ];
      
      allSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
          if (element instanceof HTMLElement) {
            element.style.background = '';
            element.style.backdropFilter = '';
            element.style.border = '';
            element.style.boxShadow = '';
            element.className = element.className.replace(/glassmorphic-\w+/g, '');
          }
        });
      });
      
      // Apply gradients based on mode
      switch (gradientMode) {
        case 'full':
          const fullElement = document.querySelector('.dashboard-container') as HTMLElement;
          if (fullElement) {
            Object.assign(fullElement.style, gradientStyle);
            fullElement.classList.add(glassmorphicClass);
          }
          break;
          
        case 'main':
          const mainElement = document.querySelector('.main-content-area') as HTMLElement;
          if (mainElement) {
            Object.assign(mainElement.style, gradientStyle);
            mainElement.classList.add(glassmorphicClass);
          }
          break;
          
        case 'main-nav':
          // Apply to main content
          const mainNavMainElement = document.querySelector('.main-content-area') as HTMLElement;
          if (mainNavMainElement) {
            Object.assign(mainNavMainElement.style, gradientStyle);
            mainNavMainElement.classList.add(glassmorphicClass);
          }
          // Apply to header
          const headerElement = document.querySelector('[data-component="header"]') as HTMLElement;
          if (headerElement) {
            Object.assign(headerElement.style, gradientStyle);
            headerElement.classList.add(glassmorphicClass);
          }
          break;
          
        case 'main-sidebar':
          // Apply to main content
          const mainSidebarMainElement = document.querySelector('.main-content-area') as HTMLElement;
          if (mainSidebarMainElement) {
            Object.assign(mainSidebarMainElement.style, gradientStyle);
            mainSidebarMainElement.classList.add(glassmorphicClass);
          }
          // Apply to sidebar
          const sidebarElement = document.querySelector('[data-sidebar="sidebar"]') as HTMLElement;
          if (sidebarElement) {
            Object.assign(sidebarElement.style, gradientStyle);
            sidebarElement.classList.add(glassmorphicClass);
          }
          break;
      }
    }
  }, [dashboardBackground, gradientMode]);
  
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
      <div className={`min-h-screen flex w-full dashboard-container ${gradientMode === 'full' ? 'dashboard-background' : ''} ${typeof dashboardBackground === 'string' && dashboardBackground.startsWith('bg-') ? dashboardBackground : ''}`}>
        <div className="gradient-sidebar">
          <DashboardSidebar />
        </div>
        
        <div className="flex-1 flex flex-col">
          <div className="gradient-header">
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
  );
}