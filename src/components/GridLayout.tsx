import { useState } from 'react';
import { Grid3X3, Grid2X2, LayoutGrid } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';

interface GridLayoutProps {
  editMode: boolean;
}

type GridSize = '2x2' | '3x3' | '4x4' | '6x6' | '9x9' | '12x12';

export function GridLayout({ editMode }: GridLayoutProps) {
  const [gridSize, setGridSize] = useState<GridSize>('4x4');

  const getGridDimensions = (size: GridSize) => {
    const dimensions = {
      '2x2': { rows: 2, cols: 2 },
      '3x3': { rows: 3, cols: 3 },
      '4x4': { rows: 4, cols: 4 },
      '6x6': { rows: 6, cols: 6 },
      '9x9': { rows: 9, cols: 9 },
      '12x12': { rows: 12, cols: 12 }
    };
    return dimensions[size];
  };

  const getGridIcon = (size: GridSize) => {
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

  const { rows, cols } = getGridDimensions(gridSize);
  const totalCells = rows * cols;

  return (
    <div className="h-full w-full space-y-6">
      {/* Header with Grid Size Selector */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <LayoutGrid className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Dashboard Grid Layout</h2>
          </div>
          
          <div className="flex items-center space-x-2">
            {getGridIcon(gridSize)}
            <Select value={gridSize} onValueChange={(value) => setGridSize(value as GridSize)}>
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
      </div>

      {/* Grid Layout Instructions */}
      <div className="p-4 bg-muted/50 rounded-lg border border-border/50">
        <p className="text-sm text-muted-foreground">
          <strong>Grid Layout:</strong> Selected {gridSize} layout with {totalCells} available slots. 
          {!editMode && ' Enable edit mode to start adding components to the grid.'}
        </p>
      </div>

      {/* Grid Container */}
      <div className="flex-1 min-h-[500px]">
        <div 
          className="grid gap-4 h-full"
          style={{
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gridTemplateRows: `repeat(${rows}, 1fr)`
          }}
        >
          {Array.from({ length: totalCells }, (_, index) => (
            <Card 
              key={index}
              className={`
                border-2 border-dashed border-border/50 
                flex items-center justify-center
                transition-all duration-200
                ${editMode 
                  ? 'hover:border-primary/50 hover:bg-accent/20 cursor-pointer' 
                  : 'opacity-60'
                }
              `}
            >
              <CardContent className="p-4 flex items-center justify-center h-full">
                <div className="text-center space-y-2">
                  <div className="text-2xl text-muted-foreground/30">📦</div>
                  <p className="text-xs text-muted-foreground">
                    Slot {index + 1}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Empty State Message */}
      <div className="text-center space-y-2 mt-6">
        <h3 className="text-lg font-medium text-muted-foreground">
          Empty {gridSize} Dashboard Grid
        </h3>
        <p className="text-sm text-muted-foreground/70 max-w-md mx-auto">
          {editMode 
            ? 'Click on any grid slot to add components to your dashboard layout.'
            : 'Enable edit mode to start building your dashboard with the grid layout system.'
          }
        </p>
      </div>
    </div>
  );
}