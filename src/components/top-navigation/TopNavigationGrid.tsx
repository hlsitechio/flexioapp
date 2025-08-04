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

interface SortableWidgetProps {
  widgetId: string;
  editMode: boolean;
  onRemove: (widgetId: string) => void;
}

function SortableWidget({ widgetId, editMode, onRemove }: SortableWidgetProps) {
  const widget = AVAILABLE_WIDGETS.find(w => w.id === widgetId);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: widgetId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (!widget) return null;

  const WidgetComponent = widget.component;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group ${isDragging ? 'opacity-50 z-10' : ''}`}
      {...attributes}
    >
      <div className="scale-90 origin-center flex items-center gap-1">
        {editMode && (
          <div
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 opacity-60 hover:opacity-100 transition-opacity"
          >
            <GripVertical className="h-3 w-3" />
          </div>
        )}
        <WidgetComponent />
      </div>
      {editMode && (
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onRemove(widgetId)}
          className="absolute -top-2 -right-2 h-5 w-5 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
}

interface TopNavigationGridProps {
  editMode?: boolean;
}

export function TopNavigationGrid({ editMode = false }: TopNavigationGridProps) {
  const { topNavigationWidgets, setTopNavigationWidgets } = useSettings();
  const [isAddingWidget, setIsAddingWidget] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const addWidget = (widgetId: string) => {
    if (!topNavigationWidgets.includes(widgetId)) {
      setTopNavigationWidgets([...topNavigationWidgets, widgetId]);
    }
    setIsAddingWidget(false);
  };

  const removeWidget = (widgetId: string) => {
    setTopNavigationWidgets(topNavigationWidgets.filter(id => id !== widgetId));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = topNavigationWidgets.findIndex(id => id === active.id);
      const newIndex = topNavigationWidgets.findIndex(id => id === over.id);

      setTopNavigationWidgets(arrayMove(topNavigationWidgets, oldIndex, newIndex));
    }
  };

  const availableWidgets = AVAILABLE_WIDGETS.filter(
    widget => !topNavigationWidgets.includes(widget.id)
  );

  if (topNavigationWidgets.length === 0 && !editMode) {
    return null;
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="flex items-center space-x-2">
        <SortableContext
          items={topNavigationWidgets}
          strategy={horizontalListSortingStrategy}
        >
          {/* Render active widgets */}
          {topNavigationWidgets.map(widgetId => (
            <SortableWidget
              key={widgetId}
              widgetId={widgetId}
              editMode={editMode}
              onRemove={removeWidget}
            />
          ))}
        </SortableContext>

        {/* Add widget button in edit mode */}
        {editMode && (
          <Popover open={isAddingWidget} onOpenChange={setIsAddingWidget}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="text-xs">
                <Plus className="h-3 w-3 mr-1" />
                Add Widget
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64" align="end">
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
                        onClick={() => addWidget(widget.id)}
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
    </DndContext>
  );
}