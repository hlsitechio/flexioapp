import { useState } from 'react';
import { Grip, X, RotateCcw, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface GridItem {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  title: string;
  content: string;
}

interface DashboardGridProps {
  editMode: boolean;
}

export function DashboardGrid({ editMode }: DashboardGridProps) {
  const [gridItems, setGridItems] = useState<GridItem[]>([
    {
      id: '1',
      x: 0,
      y: 0,
      width: 4,
      height: 3,
      title: 'Welcome Card',
      content: 'This is a sample dashboard component. Click "Edit Mode" to reposition and resize components.',
    },
    {
      id: '2',
      x: 4,
      y: 0,
      width: 4,
      height: 2,
      title: 'Statistics',
      content: 'Your dashboard statistics will appear here.',
    },
    {
      id: '3',
      x: 8,
      y: 0,
      width: 4,
      height: 2,
      title: 'Quick Actions',
      content: 'Quick action buttons and shortcuts.',
    },
  ]);

  const gridCols = 12;
  const gridRows = 8;

  const removeItem = (id: string) => {
    setGridItems(items => items.filter(item => item.id !== id));
  };

  const addNewComponent = () => {
    const newItem: GridItem = {
      id: `item-${Date.now()}`,
      x: 0,
      y: 0,
      width: 3,
      height: 2,
      title: 'New Component',
      content: 'This is a new dashboard component.',
    };
    setGridItems(items => [...items, newItem]);
  };

  return (
    <div className="h-full w-full relative">
      {/* Grid Background */}
      <div 
        className={`
          dashboard-grid w-full h-full rounded-xl transition-all duration-300
          ${editMode ? 'opacity-100' : 'opacity-50'}
        `}
        style={{
          minHeight: '600px',
          backgroundPosition: editMode ? '0 0' : '-1000px -1000px',
        }}
      >
        {/* Edit Mode Controls */}
        {editMode && (
          <div className="absolute top-4 right-4 z-10 flex space-x-2">
            <Button
              onClick={addNewComponent}
              className="button-premium text-primary-foreground shadow-lg"
              size="sm"
            >
              Add Component
            </Button>
            <Button
              onClick={() => setGridItems([])}
              variant="outline"
              size="sm"
              className="hover:shadow-md"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          </div>
        )}

        {/* Grid Items */}
        <div className="relative w-full h-full">
          {gridItems.map((item) => (
            <Card
              key={item.id}
              className={`
                absolute card-premium transition-all duration-300 p-4
                ${editMode ? 'cursor-move hover:shadow-xl border-2 border-primary/20' : 'cursor-default'}
              `}
              style={{
                left: `${(item.x / gridCols) * 100}%`,
                top: `${(item.y / gridRows) * 100}%`,
                width: `${(item.width / gridCols) * 100}%`,
                height: `${(item.height / gridRows) * 100}%`,
                minHeight: '120px',
              }}
            >
              {/* Edit Mode Controls */}
              {editMode && (
                <div className="absolute top-2 right-2 flex space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => removeItem(item.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 cursor-grab active:cursor-grabbing"
                  >
                    <Grip className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                  >
                    <Maximize2 className="h-3 w-3" />
                  </Button>
                </div>
              )}

              {/* Component Content */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-card-foreground">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.content}
                </p>
              </div>

              {/* Component Preview */}
              <div className="mt-4 space-y-2">
                <div className="w-full h-2 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full" />
                <div className="flex space-x-2">
                  <div className="flex-1 h-8 bg-muted/50 rounded border border-border/50" />
                  <div className="w-20 h-8 bg-primary/10 rounded border border-primary/20" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {gridItems.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="text-4xl text-muted-foreground/50">📊</div>
              <h3 className="text-lg font-medium text-muted-foreground">
                No components yet
              </h3>
              <p className="text-sm text-muted-foreground/70">
                {editMode 
                  ? 'Click "Add Component" to start building your dashboard'
                  : 'Enable edit mode to add components'
                }
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}