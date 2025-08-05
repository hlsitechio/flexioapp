import { motion } from 'framer-motion';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  useSidebar,
} from '@/components/ui/sidebar';
import { GripVertical } from 'lucide-react';
import { DashboardTitle } from './DashboardTitle';
import { Tools } from './Tools';
import { FavoritesRecent } from './favorites-recent';
import { UserNavigation } from './UserNavigation';
import { useSettings } from '@/contexts/SettingsContext';
import { useState, useCallback } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverlay,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Sidebar section configuration
const sidebarSections = [
  { id: 'tools', name: 'Tools', component: Tools },
  { id: 'favorites', name: 'Favorites & Recent', component: FavoritesRecent },
];

// Draggable section component
function DraggableSidebarSection({ 
  section, 
  index, 
  editMode, 
  hideDividers, 
  isCollapsed 
}: { 
  section: typeof sidebarSections[0]; 
  index: number; 
  editMode: boolean; 
  hideDividers: boolean;
  isCollapsed: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const Component = section.component;

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.2, delay: index * 0.05 }}
      className={`relative group ${isDragging ? 'z-50' : ''}`}
    >
      <div className={`relative ${isDragging ? 'opacity-50' : ''}`}>
        {/* Drag handle - only visible in edit mode and when not collapsed */}
        {editMode && !isCollapsed && (
          <div
            {...attributes}
            {...listeners}
            className="absolute -left-6 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center cursor-grab hover:cursor-grabbing opacity-0 group-hover:opacity-60 transition-opacity duration-200 z-10"
          >
            <GripVertical className="h-3 w-3 text-sidebar-foreground/50" />
          </div>
        )}
        
        {/* Section component */}
        <Component />
        
        {/* Divider after section (except for last section) */}
        {!hideDividers && index < sidebarSections.length - 1 && (
          <div className="h-px bg-sidebar-border mt-6" />
        )}
      </div>
    </motion.div>
  );
}

export function DashboardSidebar() {
  const { editMode, setEditMode, hideDividers = false } = useSettings();
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';
  const [sections, setSections] = useState(sidebarSections);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require 8px movement to start drag
      },
    })
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setSections((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }

    setActiveId(null);
  }, []);

  const activeSection = activeId ? sections.find(section => section.id === activeId) : null;

  return (
    <motion.div
      initial={false}
      animate={{
        width: isCollapsed ? 64 : 280,
      }}
      transition={{
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1],
      }}
      className="relative"
    >
      <Sidebar 
        className={`${hideDividers ? '' : 'border-r border-sidebar-border'} bg-sidebar-background backdrop-blur-xl h-screen gradient-target-sidebar`}
        collapsible="icon"
        data-sidebar="sidebar"
      >

        <SidebarHeader className={`p-4 ${hideDividers ? '' : 'border-b border-sidebar-border'}`}>
          <DashboardTitle editMode={editMode} />
        </SidebarHeader>

        <SidebarContent className="flex flex-col h-full overflow-hidden">
          {/* Main Content Area with Draggable Panels */}
          <div className="flex-1 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-sidebar-border scrollbar-track-transparent">

            {/* Draggable Sections */}
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <div className="space-y-6 relative">
                <SortableContext 
                  items={sections.map(section => section.id)} 
                  strategy={verticalListSortingStrategy}
                >
                  {sections.map((section, index) => (
                    <DraggableSidebarSection
                      key={section.id}
                      section={section}
                      index={index}
                      editMode={editMode}
                      hideDividers={hideDividers}
                      isCollapsed={isCollapsed}
                    />
                  ))}
                </SortableContext>

                {/* Drag overlay */}
                <DragOverlay>
                  {activeSection ? (
                    <motion.div
                      initial={{ scale: 1.02 }}
                      animate={{ scale: 1.05, rotate: 1 }}
                      className="relative bg-sidebar-background/95 backdrop-blur-sm rounded-lg border border-sidebar-border shadow-lg p-4"
                    >
                      <activeSection.component />
                    </motion.div>
                  ) : null}
                </DragOverlay>
              </div>
            </DndContext>
          </div>

          {/* Bottom Section - Profile, Settings, Sign In */}
          <UserNavigation />
        </SidebarContent>
      </Sidebar>
    </motion.div>
  );
}