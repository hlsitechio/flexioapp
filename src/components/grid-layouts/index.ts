// Export all grid layout functionality from the unified system
export * from './UnifiedGridSystem';

// Re-export for backward compatibility
export type { GridSize, GridDimensions } from './UnifiedGridSystem';
export { 
  GridLayout, 
  GridItem,
  getGridDimensions,
  getGridClasses,
  getResponsiveGridClasses,
  isVerticalGrid,
  isSquareGrid,
  availableGridSizes,
  isValidGridSize 
} from './UnifiedGridSystem';

// Legacy type exports
export type VerticalGridSize = '1x2' | '1x3' | '1x4' | '1x6' | '1x8' | '1x12';
export type SquareGridSize = '2x2' | '3x3' | '4x4' | '6x6' | '9x9' | '12x12';

// Legacy function aliases
export { getGridDimensions as getVerticalGridDimensions } from './UnifiedGridSystem';
export { getGridDimensions as getSquareGridDimensions } from './UnifiedGridSystem';