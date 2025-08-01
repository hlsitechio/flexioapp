import { useState } from 'react';
import { Plus, RotateCcw, Settings, Edit3, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { KanbanBoard } from '@/components/kanban';
import { KanbanColumn, KanbanItem } from '@/types/kanban';

// Grid item interface removed - now using KanbanItem from types

interface DashboardGridProps {
  editMode: boolean;
  setEditMode: (editMode: boolean) => void;
}

export function DashboardGrid({ editMode, setEditMode }: DashboardGridProps) {
  const [columns, setColumns] = useState<KanbanColumn[]>([
    {
      id: 'dashboard',
      title: 'Dashboard Widgets',
      items: [
        {
          id: '1',
          title: 'Welcome Card',
          content: '',
          type: 'widget',
          data: { size: 'large', priority: 'high' }
        },
        {
          id: '2', 
          title: 'Statistics',
          content: '',
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
          content: '',
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
          content: '',
          type: 'tool',
          data: { formats: ['csv', 'json', 'pdf'] }
        },
        {
          id: '5',
          title: 'Theme Editor',
          content: '',
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
      content: '',
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
      {/* Floating Edit Toggle */}
      <Button
        onClick={() => setEditMode(!editMode)}
        variant={editMode ? "default" : "outline"}
        size="sm"
        className="absolute top-4 right-4 z-20 transition-all duration-200 shadow-lg"
      >
        {editMode ? (
          <Eye className="h-4 w-4" />
        ) : (
          <Edit3 className="h-4 w-4" />
        )}
      </Button>
      
      {/* Header with Controls */}
      <div className="flex items-center justify-end mb-6">
        
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