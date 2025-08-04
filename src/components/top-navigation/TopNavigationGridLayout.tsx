import { useState } from 'react';
import { CountdownTimer } from '@/components/sidebar/tools/countdown-timer';
import { TaskCounter } from '@/components/sidebar/tools/task-counter';
import { QuickNote } from '@/components/sidebar/tools/quick-note';
import { RandomQuote } from '@/components/sidebar/tools/random-quote';
import { SidebarCompactCalendar } from '@/components/calendar';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Plus, X, Grid3x3, GripVertical } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const AVAILABLE_WIDGETS = [
  { id: 'countdown-timer', name: 'Countdown Timer', component: CountdownTimer },
  { id: 'task-counter', name: 'Task Counter', component: TaskCounter },
  { id: 'quick-note', name: 'Quick Note', component: QuickNote },
  { id: 'random-quote', name: 'Random Quote', component: RandomQuote },
  { id: 'compact-calendar', name: 'Calendar', component: SidebarCompactCalendar },
];

// Maximum number of widgets that can fit in the top navigation
const MAX_WIDGETS = 6;

interface GridSlotProps {
  index: number;
  widgetId?: string;
  editMode: boolean;
  onRemoveWidget: (widgetId: string) => void;
  onAddWidget: (widgetId: string, slotIndex?: number) => void;
  availableWidgets: typeof AVAILABLE_WIDGETS;
}

function GridSlot({ index, widgetId, editMode, onRemoveWidget, onAddWidget, availableWidgets }: GridSlotProps) {
  const [isAddingWidget, setIsAddingWidget] = useState(false);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: widgetId || `empty-slot-${index}`,
    disabled: !widgetId 
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleAddWidget = (newWidgetId: string) => {
    onAddWidget(newWidgetId, index);
    setIsAddingWidget(false);
  };

  if (!widgetId) {
    // Empty slot
    return (
      <div 
        className="h-10 w-24 border-2 border-dashed border-muted-foreground/30 rounded-md flex items-center justify-center relative group"
        style={style}
      >
        {editMode && (
          <Popover open={isAddingWidget} onOpenChange={setIsAddingWidget}>
            <PopoverTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-full w-full opacity-60 hover:opacity-100 transition-opacity"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64" align="center">
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-3">
                  <Grid3x3 className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Available Widgets</span>
                </div>
                {availableWidgets.length > 0 ? (
                  <div className="space-y-1">
                    {availableWidgets.map(widget => (
                      <Button
                        key={widget.id}
                        variant="ghost"
                        size="sm"
                        onClick={() => handleAddWidget(widget.id)}
                        className="w-full justify-start text-xs"
                      >
                        {widget.name}
                      </Button>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    All widgets are already added to the navigation.
                  </p>
                )}
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>
    );
  }

  // Filled slot with widget
  const widget = AVAILABLE_WIDGETS.find(w => w.id === widgetId);
  if (!widget) return null;

  const WidgetComponent = widget.component;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group ${isDragging ? 'opacity-50 z-10' : ''}`}
      {...attributes}
      {...listeners}
    >
      <div className="flex items-center gap-1">
        {editMode && (
          <div className="cursor-grab active:cursor-grabbing p-1 opacity-60 hover:opacity-100 transition-opacity">
            <GripVertical className="h-3 w-3" />
          </div>
        )}
        <div className={`origin-center cursor-grab active:cursor-grabbing ${isDragging ? 'scale-100' : 'scale-90'}`}>
          <WidgetComponent />
        </div>
      </div>
      {editMode && (
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onRemoveWidget(widgetId)}
          className="absolute -top-2 -right-2 h-5 w-5 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
}

interface TopNavigationGridLayoutProps {
  editMode?: boolean;
}

export function TopNavigationGridLayout({ editMode = false }: TopNavigationGridLayoutProps) {
  const { topNavigationWidgets, setTopNavigationWidgets } = useSettings();
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (over && active.id !== over.id) {
      const activeIndex = topNavigationWidgets.findIndex(id => id === active.id);
      const overIndex = topNavigationWidgets.findIndex(id => id === over.id);

      if (activeIndex !== -1 && overIndex !== -1) {
        setTopNavigationWidgets(arrayMove(topNavigationWidgets, activeIndex, overIndex));
      }
    }
  };

  const handleAddWidget = (widgetId: string, slotIndex?: number) => {
    if (!topNavigationWidgets.includes(widgetId)) {
      const newWidgets = [...topNavigationWidgets];
      if (typeof slotIndex === 'number' && slotIndex < MAX_WIDGETS) {
        newWidgets.splice(slotIndex, 0, widgetId);
      } else {
        newWidgets.push(widgetId);
      }
      setTopNavigationWidgets(newWidgets.slice(0, MAX_WIDGETS));
    }
  };

  const handleRemoveWidget = (widgetId: string) => {
    setTopNavigationWidgets(topNavigationWidgets.filter(id => id !== widgetId));
  };

  const availableWidgets = AVAILABLE_WIDGETS.filter(
    widget => !topNavigationWidgets.includes(widget.id)
  );

  // Create grid slots array
  const gridSlots = Array.from({ length: MAX_WIDGETS }, (_, index) => ({
    index,
    widgetId: topNavigationWidgets[index] || null,
  }));

  // Only show if there are widgets or we're in edit mode
  if (topNavigationWidgets.length === 0 && !editMode) {
    return null;
  }

  const activeWidget = activeId ? AVAILABLE_WIDGETS.find(w => w.id === activeId) : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex items-center space-x-2">
        <SortableContext
          items={topNavigationWidgets}
          strategy={horizontalListSortingStrategy}
        >
          {gridSlots.map(slot => (
            <GridSlot
              key={slot.index}
              index={slot.index}
              widgetId={slot.widgetId}
              editMode={editMode}
              onRemoveWidget={handleRemoveWidget}
              onAddWidget={handleAddWidget}
              availableWidgets={availableWidgets}
            />
          ))}
        </SortableContext>
      </div>

      <DragOverlay>
        {activeWidget && activeId ? (
          <div className="origin-center opacity-90 pointer-events-none">
            <activeWidget.component />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}