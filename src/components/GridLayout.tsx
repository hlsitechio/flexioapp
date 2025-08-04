import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid3X3, Grid2X2, LayoutGrid, Plus, X, MoreVertical } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSettings } from '@/contexts/SettingsContext';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
  useDraggable,
  useDroppable
} from '@dnd-kit/core';
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
  const { dashboardLayout, removeComponentFromSlot, gridSize, setGridSize, addComponentToSlot } = useSettings();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draggedComponent, setDraggedComponent] = useState<{ component: string; gridSize: string } | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require 8px movement to start drag
      },
    })
  );
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

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
    
    // Extract slot index from active.id (format: "slot-X")
    const slotIndex = parseInt(active.id.toString().replace('slot-', ''));
    const slotComponent = getSlotComponent(slotIndex);
    
    if (slotComponent) {
      setDraggedComponent(slotComponent);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    // Handle visual feedback during drag if needed
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    setActiveId(null);
    setDraggedComponent(null);
    
    if (!over || !editMode) return;
    
    const activeSlotIndex = parseInt(active.id.toString().replace('slot-', ''));
    const overSlotIndex = parseInt(over.id.toString().replace('slot-', ''));
    
    if (activeSlotIndex === overSlotIndex) return;
    
    const activeComponent = getSlotComponent(activeSlotIndex);
    const overComponent = getSlotComponent(overSlotIndex);
    
    if (activeComponent) {
      // Remove from source slot
      removeComponentFromSlot(activeSlotIndex);
      
      // If target slot has a component, we swap them
      if (overComponent) {
        addComponentToSlot(activeSlotIndex, overComponent.component, overComponent.gridSize);
      }
      
      // Add to target slot
      addComponentToSlot(overSlotIndex, activeComponent.component, activeComponent.gridSize);
    }
  };
  // Enhanced components with framer-motion animations
  const DraggableGridSlot = React.memo(({ index, children, hasComponent }: { 
    index: number; 
    children: React.ReactNode; 
    hasComponent: boolean 
  }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      isDragging,
    } = useDraggable({
      id: `slot-${index}`,
      disabled: !editMode || !hasComponent,
    });

    // Motion values for smooth animations
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const scale = useTransform([x, y], ([x, y]) => isDragging ? 1.05 : 1);

    React.useEffect(() => {
      if (transform) {
        x.set(transform.x);
        y.set(transform.y);
      } else {
        x.set(0);
        y.set(0);
      }
    }, [transform, x, y]);

    return (
      <motion.div
        ref={setNodeRef}
        style={{ x, y, scale }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: isDragging ? 0.7 : 1, 
          scale: isDragging ? 1.05 : 1,
          rotate: isDragging ? 2 : 0
        }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 30,
          opacity: { duration: 0.2 }
        }}
        whileHover={hasComponent && editMode ? { 
          scale: 1.02, 
          y: -2,
          transition: { duration: 0.2 } 
        } : {}}
        {...attributes} 
        {...listeners}
      >
        {children}
      </motion.div>
    );
  });

  const DroppableGridSlot = React.memo(({ index, children }: { 
    index: number; 
    children: React.ReactNode 
  }) => {
    const { isOver, setNodeRef } = useDroppable({
      id: `slot-${index}`,
      disabled: !editMode,
    });

    return (
      <motion.div 
        ref={setNodeRef}
        animate={{ 
          scale: isOver && editMode ? 1.02 : 1,
          borderColor: isOver && editMode ? "hsl(var(--primary))" : "transparent"
        }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className={isOver && editMode ? 'ring-2 ring-primary ring-offset-2' : ''}
      >
        {children}
      </motion.div>
    );
  });

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
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

        {editMode && (
          <div className="mb-4 p-4 bg-muted/50 rounded-lg border border-border/50">
            <p className="text-sm text-muted-foreground">
              <strong>Drag & Drop:</strong> In edit mode, you can drag components between grid slots to rearrange them. 
              Click on empty slots to add new components.
            </p>
          </div>
        )}

        {/* Dashboard Grid with Layout Animations */}
        <motion.div 
          layout
          className="grid gap-4 w-full"
          style={{
            gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${rows}, minmax(200px, 1fr))`
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <AnimatePresence mode="popLayout">
            {editMode ? (
              // Show all slots in edit mode with drag and drop - stable keys prevent flashing
              Array.from({ length: totalCells }, (_, index) => {
                const slotComponent = getSlotComponent(index);
                const hasComponent = slotComponent && slotComponent.component;
                const stableKey = `slot-${gridSize}-${index}`; // Stable key to prevent remounting
                
                return (
                  <motion.div
                    key={stableKey}
                    layout
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: -20 }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 300, 
                      damping: 25,
                      delay: index * 0.02 // Staggered animation
                    }}
                  >
                    <DroppableGridSlot index={index}>
                      <DraggableGridSlot index={index} hasComponent={!!hasComponent}>
                        <motion.div
                          whileHover={!hasComponent ? {
                            scale: 1.02,
                            boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                            transition: { duration: 0.2 }
                          } : {}}
                          whileTap={!hasComponent ? { scale: 0.98 } : {}}
                        >
                          <Card 
                            className={`
                              relative group transition-all duration-200 
                              ${!hasComponent ? 'hover:border-primary/50 cursor-pointer' : 'cursor-grab active:cursor-grabbing'}
                              ${activeId === `slot-${index}` ? 'ring-2 ring-primary ring-offset-2' : ''}
                              bg-card/50 backdrop-blur-sm
                            `}
                            onClick={() => !hasComponent && handleAddComponent(index)}
                          >
                            <CardContent className="p-6 h-full flex flex-col items-center justify-center relative">
                              <AnimatePresence mode="wait">
                                {hasComponent ? (
                                  <motion.div
                                    key="component"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.2 }}
                                    className="w-full h-full"
                                  >
                                    {/* Remove button with motion */}
                                    <motion.div
                                      initial={{ opacity: 0 }}
                                      whileHover={{ opacity: 1 }}
                                      transition={{ duration: 0.2 }}
                                      className="absolute top-2 right-2 z-10"
                                    >
                                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                        <Button
                                          variant="destructive"
                                          size="sm"
                                          className="h-6 w-6 p-0"
                                          onClick={(e) => handleRemoveComponent(index, e)}
                                        >
                                          <X className="h-3 w-3" />
                                        </Button>
                                      </motion.div>
                                    </motion.div>
                                    {/* Render component with pointer-events disabled during drag */}
                                    <div className="w-full h-full pointer-events-none">
                                      {renderComponent(slotComponent.component, slotComponent.gridSize || gridSize)}
                                    </div>
                                  </motion.div>
                                ) : (
                                  <motion.div
                                    key="empty"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    whileHover={{ 
                                      scale: 1.05, 
                                      color: "hsl(var(--primary))",
                                      transition: { duration: 0.2 }
                                    }}
                                    className="flex flex-col items-center space-y-3 text-muted-foreground"
                                  >
                                    <motion.div
                                      animate={{ 
                                        rotate: [0, 5, -5, 0],
                                        scale: [1, 1.1, 1]
                                      }}
                                      transition={{ 
                                        duration: 2, 
                                        repeat: Infinity, 
                                        repeatDelay: 3,
                                        ease: "easeInOut"
                                      }}
                                    >
                                      <Plus className="h-8 w-8" />
                                    </motion.div>
                                    <span className="text-sm font-medium">Add Component</span>
                                    <span className="text-xs opacity-70">Slot {index + 1}</span>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </CardContent>
                          </Card>
                        </motion.div>
                      </DraggableGridSlot>
                    </DroppableGridSlot>
                  </motion.div>
                );
              })
            ) : (
              // Show all slots in view mode but hide empty ones to maintain grid layout
              Array.from({ length: totalCells }, (_, index) => {
                const slotComponent = getSlotComponent(index);
                const hasComponent = slotComponent && slotComponent.component;
                const stableKey = `view-${gridSize}-${index}`;
                
                if (!hasComponent) {
                  // Return invisible placeholder to maintain grid structure
                  return <div key={stableKey} />;
                }
                
                return (
                  <motion.div
                    key={stableKey}
                    layout
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -20 }}
                    whileHover={{ 
                      y: -4, 
                      boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                      transition: { duration: 0.3 }
                    }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 300, 
                      damping: 25,
                      delay: index * 0.05
                    }}
                  >
                    <Card className="relative group transition-all duration-200 bg-card/50 backdrop-blur-sm">
                      <CardContent className="p-6 h-full flex flex-col items-center justify-center relative">
                        <motion.div 
                          className="w-full h-full"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.1, duration: 0.3 }}
                        >
                          {renderComponent(slotComponent.component, slotComponent.gridSize || gridSize)}
                        </motion.div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Enhanced Drag Overlay with Framer Motion */}
      <DragOverlay>
        <AnimatePresence>
          {activeId && draggedComponent ? (
            <motion.div
              initial={{ scale: 1.05, rotate: 5 }}
              animate={{ 
                scale: 1.1, 
                rotate: 8,
                boxShadow: "0 25px 50px rgba(0,0,0,0.25)"
              }}
              exit={{ scale: 0.9, rotate: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <Card className="opacity-90 bg-card/90 backdrop-blur-sm border-primary ring-2 ring-primary ring-offset-4">
                <CardContent className="p-6 h-full flex flex-col items-center justify-center">
                  <motion.div 
                    className="w-full h-full pointer-events-none"
                    animate={{ scale: [1, 1.02, 1] }}
                    transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                  >
                    {renderComponent(draggedComponent.component, draggedComponent.gridSize)}
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </DragOverlay>
    </DndContext>
  );
}