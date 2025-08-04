import { motion, AnimatePresence } from 'framer-motion';
import { useSidebar } from '@/components/ui/sidebar';
import { Wrench, X, GripVertical } from 'lucide-react';
import { SidebarCompactCalendar } from '@/components/calendar';
import { CountdownTimer, TaskCounter, QuickNote, RandomQuote } from './tools';
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

// Tool configuration
const toolsConfig = [
  { id: 'calendar', name: 'Calendar', component: SidebarCompactCalendar },
  { id: 'countdown', name: 'Countdown Timer', component: CountdownTimer },
  { id: 'tasks', name: 'Task Counter', component: TaskCounter },
  { id: 'notes', name: 'Quick Note', component: QuickNote },
  { id: 'quotes', name: 'Random Quote', component: RandomQuote },
];

// Draggable tool item component
function DraggableToolItem({ tool, index, editMode }: { 
  tool: typeof toolsConfig[0]; 
  index: number; 
  editMode: boolean; 
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: tool.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    willChange: isDragging ? 'transform' : undefined,
  };

  const Component = tool.component;

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.2, delay: index * 0.05 }}
      className={`relative group ${isDragging ? 'z-50' : ''}`}
      {...attributes}
      {...listeners}
    >
      <div className={`relative ${isDragging ? 'opacity-50' : ''} cursor-grab active:cursor-grabbing`}>
        {/* Drag handle - visible on hover */}
        <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center opacity-0 group-hover:opacity-60 transition-opacity duration-200 z-10 pointer-events-none">
          <GripVertical className="h-3 w-3 text-sidebar-foreground/50" />
        </div>
        
        {/* Tool component */}
        <Component />
        
        {/* Remove button */}
        {editMode && (
          <button
            className="absolute -top-1 -right-1 w-5 h-5 bg-destructive hover:bg-destructive/80 text-destructive-foreground rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
            onClick={() => {/* TODO: Remove tool */}}
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>
    </motion.div>
  );
}

export function Tools() {
  const { state } = useSidebar();
  const { editMode } = useSettings();
  const isCollapsed = state === 'collapsed';
  const [tools, setTools] = useState(toolsConfig);
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
      setTools((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }

    setActiveId(null);
  }, []);

  const activeTool = activeId ? tools.find(tool => tool.id === activeId) : null;

  return (
    <div className="space-y-3">
      {isCollapsed ? (
        <div className="space-y-2">
          {/* Tools heading icon when collapsed */}
          <div className="flex justify-center">
            <button className="w-10 h-10 p-0 rounded-lg text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-all cursor-pointer flex items-center justify-center mx-auto">
              <Wrench className="h-4 w-4" />
            </button>
          </div>
          
          {/* Tool components in collapsed mode - no DnD when collapsed */}
          {tools.map((tool) => {
            const Component = tool.component;
            return <Component key={tool.id} />;
          })}
        </div>
      ) : (
        <>
          <AnimatePresence>
            <motion.h3
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, delay: 0.15 }}
              className="text-xs font-semibold text-sidebar-foreground/70 uppercase tracking-wider px-2 flex items-center space-x-1"
            >
              <Wrench className="h-3 w-3" />
              <span>Tools</span>
              <span className="text-xs text-sidebar-foreground/50 normal-case">
                (Drag to reorder)
              </span>
            </motion.h3>
          </AnimatePresence>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className="space-y-3 relative">
              <SortableContext items={tools.map(tool => tool.id)} strategy={verticalListSortingStrategy}>
                <AnimatePresence>
                  {tools.map((tool, index) => (
                    <DraggableToolItem
                      key={tool.id}
                      tool={tool}
                      index={index}
                      editMode={editMode}
                    />
                  ))}
                </AnimatePresence>
              </SortableContext>

              {/* Drag overlay */}
              <DragOverlay>
                {activeTool ? (
                  <motion.div
                    initial={{ scale: 1.02 }}
                    animate={{ scale: 1.05, rotate: 2 }}
                    className="relative bg-sidebar-background/95 backdrop-blur-sm rounded-lg border border-sidebar-border shadow-lg"
                  >
                    <activeTool.component />
                  </motion.div>
                ) : null}
              </DragOverlay>
            </div>
          </DndContext>
        </>
      )}
    </div>
  );
}