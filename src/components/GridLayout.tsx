import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid3X3, Grid2X2, LayoutGrid, Plus, X, MoreVertical } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSettings } from '@/contexts/SettingsContext';
import { Calendar } from '@/components/calendar';
import { 
  DashboardTaskCounter, 
  DashboardQuickNote, 
  DashboardRandomQuote, 
  DashboardCountdownTimer,
  DashboardPromptsGallery,
  DashboardCodeBlock,
  ImageGallery
} from '@/components/dashboard';
import { 
  GridSize,
  VerticalGridSize,
  SquareGridSize,
  getVerticalGridDimensions,
  getSquareGridDimensions
} from '@/components/grid-layouts';

interface GridLayoutProps {
  editMode: boolean;
}

export function GridLayout({ editMode }: GridLayoutProps) {
  const navigate = useNavigate();
  const { dashboardLayout, removeComponentFromSlot, gridSize, setGridSize } = useSettings();
  const getGridDimensions = (size: GridSize) => {
    // Check if it's a vertical grid
    if (size.startsWith('1x')) {
      return getVerticalGridDimensions(size as VerticalGridSize);
    }
    // Otherwise it's a square grid
    return getSquareGridDimensions(size as SquareGridSize);
  };

  const getGridIcon = (size: GridSize) => {
    if (size.startsWith('1x')) {
      return <MoreVertical className="h-4 w-4" />;
    }
    
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
  const {
    rows,
    cols
  } = getGridDimensions(gridSize);
  const totalCells = rows * cols;
  const handleAddComponent = (slotIndex: number) => {
    if (editMode) {
      navigate(`/components?slot=${slotIndex}&gridSize=${gridSize}`);
    }
  };
  const placeholderImages = ['photo-1461749280684-dccba630e2f6',
  // monitor showing Java programming
  'photo-1485827404703-89b55fcc595e',
  // white robot near brown wall
  'photo-1487058792275-0ad4aaf24ca7',
  // Colorful software or web code on a computer monitor
  'photo-1498050108023-c5249f4df085',
  // A MacBook with lines of code on its screen on a busy desk
  'photo-1483058712412-4245e9b90334' // silver iMac with keyboard and trackpad inside room
  ];
  const getPlaceholderImage = (index: number) => {
    const imageIndex = index % placeholderImages.length;
    return `https://images.unsplash.com/${placeholderImages[imageIndex]}?w=400&h=300&fit=crop`;
  };

  const renderComponent = (componentName: string, componentGridSize?: string) => {
    const size = componentGridSize || gridSize;
    switch (componentName) {
      case 'Calendar':
        return <Calendar gridSize={size as GridSize} />;
      case 'Task Counter':
        return <DashboardTaskCounter />;
      case 'Quick Note':
        return <DashboardQuickNote />;
      case 'Random Quote':
        return <DashboardRandomQuote />;
      case 'Countdown Timer':
        return <DashboardCountdownTimer />;
      case 'Image Gallery':
        return <ImageGallery />;
      case 'Prompts Gallery':
        return <DashboardPromptsGallery />;
      case 'Code Snippets':
        return <DashboardCodeBlock />;
      default:
        return null;
    }
  };

  const getSlotComponent = (slotIndex: number) => {
    const slotKey = `${gridSize}-${slotIndex}`;
    return dashboardLayout[slotKey];
  };

  const handleRemoveComponent = (slotIndex: number, e: React.MouseEvent) => {
    e.stopPropagation();
    removeComponentFromSlot(slotIndex);
  };
  return (
    <div className="w-full">
      {/* Grid Size Selector */}
      {editMode && (
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              {getGridIcon(gridSize)}
              <span className="text-sm font-medium text-foreground">Grid Size</span>
            </div>
            
            {/* Vertical Grids Dropdown */}
            <div className="flex items-center space-x-2">
              <MoreVertical className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground">Vertical</span>
              <Select 
                value={gridSize.startsWith('1x') ? gridSize : ''} 
                onValueChange={setGridSize}
              >
                <SelectTrigger className="w-24 bg-background border-border z-50">
                  <SelectValue placeholder="1x" />
                </SelectTrigger>
                <SelectContent className="bg-background border-border shadow-lg z-50">
                  <SelectItem value="1x2">1×2</SelectItem>
                  <SelectItem value="1x3">1×3</SelectItem>
                  <SelectItem value="1x4">1×4</SelectItem>
                  <SelectItem value="1x6">1×6</SelectItem>
                  <SelectItem value="1x8">1×8</SelectItem>
                  <SelectItem value="1x12">1×12</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Square Grids Dropdown */}
            <div className="flex items-center space-x-2">
              <Grid3X3 className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground">Square</span>
              <Select 
                value={!gridSize.startsWith('1x') ? gridSize : ''} 
                onValueChange={setGridSize}
              >
                <SelectTrigger className="w-24 bg-background border-border z-50">
                  <SelectValue placeholder="NxN" />
                </SelectTrigger>
                <SelectContent className="bg-background border-border shadow-lg z-50">
                  <SelectItem value="2x2">2×2</SelectItem>
                  <SelectItem value="3x3">3×3</SelectItem>
                  <SelectItem value="4x4">4×4</SelectItem>
                  <SelectItem value="6x6">6×6</SelectItem>
                  <SelectItem value="9x9">9×9</SelectItem>
                  <SelectItem value="12x12">12×12</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      {/* Dashboard Grid */}
      <div 
        className={`grid gap-4 w-full ${editMode ? '' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'}`}
        style={editMode ? {
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${rows}, minmax(200px, 1fr))`
        } : undefined}
      >
        {editMode ? (
          // Show all slots in edit mode
          Array.from({ length: totalCells }, (_, index) => {
            const slotComponent = getSlotComponent(index);
            const hasComponent = slotComponent && slotComponent.component;
            
            return (
              <Card 
                key={index}
                className={`
                  relative group transition-all duration-200 
                  ${!hasComponent ? 'hover:border-primary/50 cursor-pointer' : ''}
                  bg-card/50 backdrop-blur-sm
                `}
                onClick={() => !hasComponent && handleAddComponent(index)}
              >
                <CardContent className="p-6 h-full flex flex-col items-center justify-center relative">
                  {hasComponent ? (
                    <>
                      {/* Remove button for edit mode */}
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2 z-10 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => handleRemoveComponent(index, e)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                      {/* Render the actual component */}
                      <div className="w-full h-full">
                        {renderComponent(slotComponent.component, slotComponent.gridSize || gridSize)}
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center space-y-3 text-muted-foreground group-hover:text-primary transition-colors">
                      <Plus className="h-8 w-8" />
                      <span className="text-sm font-medium">Add Component</span>
                      <span className="text-xs opacity-70">Slot {index + 1}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        ) : (
          // Show only components with content in view mode
          Array.from({ length: totalCells }, (_, index) => {
            const slotComponent = getSlotComponent(index);
            const hasComponent = slotComponent && slotComponent.component;
            
            if (!hasComponent) return null;
            
            return (
              <Card 
                key={index}
                className="relative group transition-all duration-200 bg-card/50 backdrop-blur-sm"
              >
                <CardContent className="p-6 h-full flex flex-col items-center justify-center relative">
                  <div className="w-full h-full">
                    {renderComponent(slotComponent.component, slotComponent.gridSize || gridSize)}
                  </div>
                </CardContent>
              </Card>
            );
          }).filter(Boolean)
        )}
      </div>
    </div>
  );
}