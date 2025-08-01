import { useState } from 'react';
import { Plus, RotateCcw, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { KanbanBoard } from '@/components/kanban';
import { KanbanColumn, KanbanItem } from '@/types/kanban';

// Grid item interface removed - now using KanbanItem from types

interface DashboardGridProps {
  editMode: boolean;
}

export function DashboardGrid({ editMode }: DashboardGridProps) {
  const [columns, setColumns] = useState<KanbanColumn[]>([
    {
      id: 'dashboard',
      title: 'Dashboard Widgets',
      items: [
        {
          id: '1',
          title: 'Welcome Card',
          content: 'This is a sample dashboard component. Drag to reposition components.',
          type: 'widget',
          data: { size: 'large', priority: 'high' }
        },
        {
          id: '2', 
          title: 'Statistics',
          content: 'Your dashboard statistics will appear here.',
          type: 'widget',
          data: { size: 'medium', charts: ['line', 'bar'] }
        },
      ]
    },
    {
      id: 'sidebar',
      title: 'Sidebar Components',
      items: [
        {
          id: '3',
          title: 'Quick Actions',
          content: 'Quick action buttons and shortcuts.',
          type: 'component',
          data: { position: 'top', actions: 3 }
        },
      ]
    },
    {
      id: 'tools',
      title: 'Available Tools',
      items: [
        {
          id: '4',
          title: 'Data Export',
          content: 'Export your dashboard data in various formats.',
          type: 'tool',
          data: { formats: ['csv', 'json', 'pdf'] }
        },
        {
          id: '5',
          title: 'Theme Editor',
          content: 'Customize the appearance of your dashboard.',
          type: 'tool',
          data: { themes: 5, presets: 12 }
        },
      ]
    }
  ]);

  const addNewComponent = () => {
    const newItem: KanbanItem = {
      id: `item-${Date.now()}`,
      title: 'New Component',
      content: 'This is a new dashboard component.',
      type: 'widget',
      data: { created: new Date().toISOString() }
    };
    
    const newColumns = columns.map(col => 
      col.id === 'dashboard' 
        ? { ...col, items: [...col.items, newItem] }
        : col
    );
    setColumns(newColumns);
  };

  const clearAllItems = () => {
    const clearedColumns = columns.map(col => ({ ...col, items: [] }));
    setColumns(clearedColumns);
  };

  return (
    <div className="h-full w-full relative">
      {/* Header with Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-foreground">Dashboard Builder</h2>
          <p className="text-sm text-muted-foreground">
            {editMode 
              ? 'Drag and drop components between columns to organize your dashboard'
              : 'Enable edit mode to rearrange components'
            }
          </p>
        </div>
        
        {editMode && (
          <div className="flex space-x-2">
            <Button
              onClick={addNewComponent}
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Widget
            </Button>
            <Button
              onClick={clearAllItems}
              variant="outline"
              size="sm"
              className="hover:shadow-md"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Clear All
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="hover:shadow-md"
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        )}
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

      {/* Empty State */}
      {columns.every(col => col.items.length === 0) && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="text-4xl text-muted-foreground/50">🎯</div>
            <h3 className="text-lg font-medium text-muted-foreground">
              No components yet
            </h3>
            <p className="text-sm text-muted-foreground/70 max-w-md">
              {editMode 
                ? 'Click "Add Widget" to start building your dashboard. Drag components between columns to organize them.'
                : 'Enable edit mode to add and organize components'
              }
            </p>
          </div>
        </div>
      )}
    </div>
  );
}