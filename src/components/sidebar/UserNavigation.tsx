import React from 'react';
import { GripHorizontal } from 'lucide-react';
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SidebarMenu, useSidebar } from '@/components/ui/sidebar';
import { Profile } from './settings/Profile';
import { UserSettings } from './settings/UserSettings';
import { UserCustomization } from './settings/UserCustomization';
import { NotificationButton } from './notifications';
import { SignInOut } from './settings/SignInOut';
import { SidebarDarkModeToggle } from './SidebarDarkModeToggle';
import { useSettings } from '@/contexts/SettingsContext';
import { motion, AnimatePresence } from 'framer-motion';

// Navigation component mapping
const navigationComponents = {
  'DarkModeToggle': SidebarDarkModeToggle,
  'Profile': Profile,
  'NotificationButton': NotificationButton,
  'UserSettings': UserSettings,
  'UserCustomization': UserCustomization,
  'SignInOut': SignInOut,
};

// Draggable navigation item wrapper
function DraggableNavigationItem({ 
  id, 
  children, 
  editMode 
}: { 
  id: string;
  children: React.ReactNode;
  editMode: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled: !editMode });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1000 : 1,
  };

  // Apply drag props only when edit mode is enabled
  const dragProps = editMode ? { ...attributes, ...listeners } : {};

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      transition={{ duration: 0.2 }}
      className={`relative group ${isDragging ? 'z-50' : ''} ${editMode ? 'touch-none' : ''}`}
      {...dragProps}
    >
      <div className={`relative ${isDragging ? 'opacity-50' : ''} ${editMode ? 'cursor-grab active:cursor-grabbing' : ''}`}>
        {/* Drag handle - visible when edit mode is on */}
        {editMode && (
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-4 h-4 flex items-center justify-center opacity-0 group-hover:opacity-60 transition-opacity duration-200 z-10 pointer-events-none">
            <GripHorizontal className="h-3 w-3 text-sidebar-foreground/50" />
          </div>
        )}
        
        {/* Navigation component - disable pointer events in edit mode to allow dragging */}
        <div className={editMode ? 'pointer-events-none' : ''}>
          {children}
        </div>
      </div>
    </motion.div>
  );
}

export function UserNavigation() {
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';
  const { 
    hideDividers = false, 
    editMode, 
    userNavigationOrder, 
    setUserNavigationOrder 
  } = useSettings();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = userNavigationOrder.indexOf(active.id as string);
      const newIndex = userNavigationOrder.indexOf(over?.id as string);

      setUserNavigationOrder(arrayMove(userNavigationOrder, oldIndex, newIndex));
    }
  };

  return (
    <div className={`${hideDividers ? '' : 'border-t border-sidebar-border'} ${isCollapsed ? 'p-2' : 'px-4 py-4'}`}>
      {editMode && !isCollapsed && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="mb-3 text-xs text-sidebar-foreground/50 text-center"
        >
          Drag to reorder horizontally
        </motion.div>
      )}
      
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext 
          items={userNavigationOrder} 
          strategy={horizontalListSortingStrategy}
        >
          <SidebarMenu className={isCollapsed ? 'flex-row flex-wrap gap-2 justify-center' : 'flex-row flex-wrap gap-1'}>
            <AnimatePresence>
              {userNavigationOrder.map((componentId, index) => {
                const Component = navigationComponents[componentId as keyof typeof navigationComponents];
                console.log(`🔍 Component ${componentId}:`, Component ? 'Found' : 'Missing');
                if (!Component) return null;

                // Add visual separator after dark mode toggle
                const addSeparator = componentId === 'DarkModeToggle';

                return (
                  <div key={componentId} className="flex items-center">
                    <DraggableNavigationItem 
                      id={componentId}
                      editMode={editMode}
                    >
                      <Component />
                    </DraggableNavigationItem>
                    {addSeparator && !isCollapsed && (
                      <div className="mx-2 h-4 w-px bg-sidebar-border" />
                    )}
                  </div>
                );
              })}
            </AnimatePresence>
          </SidebarMenu>
        </SortableContext>
      </DndContext>
    </div>
  );
}