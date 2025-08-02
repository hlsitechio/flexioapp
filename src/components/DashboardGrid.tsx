import { useState } from 'react';
import { Plus, RotateCcw, Settings, Grid3X3, Grid2X2, LayoutGrid } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { KanbanBoard } from '@/components/kanban';
import { KanbanColumn, KanbanItem } from '@/types/kanban';
import { useSettings } from '@/contexts/SettingsContext';

interface DashboardGridProps {
  editMode: boolean;
  setEditMode: (editMode: boolean) => void;
}

export function DashboardGrid({ editMode, setEditMode }: DashboardGridProps) {
  const { gridSize, setGridSize } = useSettings();
  const [columns, setColumns] = useState<KanbanColumn[]>([
    {
      id: 'widgets',
      title: 'Available Widgets',
      items: [
        {
          id: '1',
          title: 'Calendar Widget',
          content: 'Display calendar with events',
          type: 'widget',
          data: { component: 'Calendar', gridSize: '2x2' }
        },
        {
          id: '2', 
          title: 'Task Counter',
          content: 'Track completed tasks',
          type: 'widget',
          data: { component: 'TaskCounter', gridSize: '1x1' }
        },
        {
          id: '3',
          title: 'Quick Note',
          content: 'Write and save notes',
          type: 'widget', 
          data: { component: 'QuickNote', gridSize: '2x1' }
        },
        {
          id: '4',
          title: 'Random Quote',
          content: 'Inspirational quotes',
          type: 'widget',
          data: { component: 'RandomQuote', gridSize: '2x1' }
        },
        {
          id: '5',
          title: 'Countdown Timer',
          content: 'Timer for productivity',
          type: 'widget',
          data: { component: 'CountdownTimer', gridSize: '1x1' }
        },
      ]
    },
    {
      id: 'dashboard',
      title: `Dashboard Grid (${gridSize})`,
      items: [],
      maxItems: getMaxItems(gridSize)
    }
  ]);

  function getMaxItems(size: '2x2' | '3x3' | '4x4' | '6x6' | '9x9' | '12x12'): number {
    const gridSizes = {
      '2x2': 4,
      '3x3': 9, 
      '4x4': 16,
      '6x6': 36,
      '9x9': 81,
      '12x12': 144
    };
    return gridSizes[size];
  }

  const handleGridSizeChange = (newSize: '2x2' | '3x3' | '4x4' | '6x6' | '9x9' | '12x12') => {
    setGridSize(newSize);
    setColumns(prev => prev.map(col => 
      col.id === 'dashboard' 
        ? { ...col, title: `Dashboard Grid (${newSize})`, maxItems: getMaxItems(newSize) }
        : col
    ));
  };

  const addNewWidget = () => {
    const newItem: KanbanItem = {
      id: `widget-${Date.now()}`,
      title: 'Custom Widget',
      content: 'User created widget',
      type: 'widget',
      data: { component: 'Custom', gridSize: '1x1', created: new Date().toISOString() }
    };
    
    setColumns(prev => prev.map(col => 
      col.id === 'widgets' 
        ? { ...col, items: [...col.items, newItem] }
        : col
    ));
  };

  const clearDashboard = () => {
    setColumns(prev => prev.map(col => 
      col.id === 'dashboard' 
        ? { ...col, items: [] }
        : col
    ));
  };

  const getGridIcon = (size: '2x2' | '3x3' | '4x4' | '6x6' | '9x9' | '12x12') => {
    switch (size) {
      case '2x2':
      case '3x3':
        return <Grid2X2 className="h-4 w-4" />;
      case '4x4':
      case '6x6':
        return <Grid3X3 className="h-4 w-4" />;
      default:
        return <LayoutGrid className="h-4 w-4" />;
    }
  };

  return (
    <div className="h-full w-full relative">
      {/* Header with Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <LayoutGrid className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Dashboard Grid Layout</h2>
          </div>
          
          {/* Grid Size Selector */}
          <div className="flex items-center space-x-2">
            {getGridIcon(gridSize)}
            <Select value={gridSize} onValueChange={handleGridSizeChange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2x2">2×2 Grid</SelectItem>
                <SelectItem value="3x3">3×3 Grid</SelectItem>
                <SelectItem value="4x4">4×4 Grid</SelectItem>
                <SelectItem value="6x6">6×6 Grid</SelectItem>
                <SelectItem value="9x9">9×9 Grid</SelectItem>
                <SelectItem value="12x12">12×12 Grid</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {editMode && (
          <div className="flex space-x-2">
            <Button
              onClick={addNewWidget}
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Widget
            </Button>
            <Button
              onClick={clearDashboard}
              variant="outline"
              size="sm"
              className="hover:shadow-md"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Clear Grid
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="hover:shadow-md"
            >
              <Settings className="h-4 w-4 mr-2" />
              Grid Settings
            </Button>
          </div>
        )}
      </div>

      {/* Grid Layout Instructions */}
      <div className="mb-4 p-4 bg-muted/50 rounded-lg border border-border/50">
        <p className="text-sm text-muted-foreground">
          <strong>Grid Layout:</strong> Drag widgets from the left column to the dashboard grid on the right. 
          The grid supports {gridSize} layout with {getMaxItems(gridSize)} maximum slots. 
          {!editMode && ' Enable edit mode to start arranging widgets.'}
        </p>
      </div>

      {/* Kanban Board */}
      <div className={`
        transition-all duration-300 
        ${editMode ? 'opacity-100' : 'opacity-75 pointer-events-none'}
      `}>
        <KanbanBoard 
          columns={columns}
          onColumnsChange={setColumns}
          className="min-h-[600px]"
        />
      </div>

      {/* Empty Dashboard State */}
      {columns.find(col => col.id === 'dashboard')?.items.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center space-y-4 bg-background/80 backdrop-blur-sm p-8 rounded-lg border border-border/50">
            <div className="text-4xl text-muted-foreground/50">📊</div>
            <h3 className="text-lg font-medium text-muted-foreground">
              Empty {gridSize} Dashboard Grid
            </h3>
            <p className="text-sm text-muted-foreground/70 max-w-md">
              {editMode 
                ? 'Drag widgets from the left column to populate your dashboard grid. Each widget will snap to the grid layout.'
                : 'Enable edit mode to start building your dashboard with the grid layout system'
              }
            </p>
          </div>
        </div>
      )}
    </div>
  );
}