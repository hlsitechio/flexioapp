import React from 'react';

// Unified grid size type
export type GridSize = '1x2' | '1x3' | '1x4' | '1x6' | '1x8' | '1x12' | '2x2' | '3x3' | '4x4' | '6x6' | '9x9' | '12x12';

// Grid dimension interface
export interface GridDimensions {
  rows: number;
  cols: number;
}

// Complete grid dimensions mapping
export const gridDimensions: Record<GridSize, GridDimensions> = {
  // Vertical layouts
  '1x2': { rows: 2, cols: 1 },
  '1x3': { rows: 3, cols: 1 },
  '1x4': { rows: 4, cols: 1 },
  '1x6': { rows: 6, cols: 1 },
  '1x8': { rows: 8, cols: 1 },
  '1x12': { rows: 12, cols: 1 },
  
  // Square layouts
  '2x2': { rows: 2, cols: 2 },
  '3x3': { rows: 3, cols: 3 },
  '4x4': { rows: 4, cols: 4 },
  '6x6': { rows: 6, cols: 6 },
  '9x9': { rows: 9, cols: 9 },
  '12x12': { rows: 12, cols: 12 }
};

// Grid type helpers
export const isVerticalGrid = (size: GridSize): boolean => {
  return size.startsWith('1x');
};

export const isSquareGrid = (size: GridSize): boolean => {
  return !isVerticalGrid(size);
};

// Get grid dimensions
export const getGridDimensions = (size: GridSize): GridDimensions => {
  return gridDimensions[size];
};

// Grid class generators
export const getGridClasses = (size: GridSize): string => {
  const { rows, cols } = getGridDimensions(size);
  
  const baseClasses = 'grid gap-4 w-full h-full';
  const gridTemplateClasses = `grid-cols-${cols} grid-rows-${rows}`;
  
  return `${baseClasses} ${gridTemplateClasses}`;
};

// Responsive grid classes
export const getResponsiveGridClasses = (size: GridSize): string => {
  const { rows, cols } = getGridDimensions(size);
  
  // For smaller screens, reduce grid complexity
  const mobileClasses = cols > 3 ? 'grid-cols-2' : `grid-cols-${cols}`;
  const tabletClasses = cols > 6 ? 'md:grid-cols-4' : `md:grid-cols-${cols}`;
  const desktopClasses = `lg:grid-cols-${cols}`;
  
  return `grid gap-4 w-full h-full ${mobileClasses} ${tabletClasses} ${desktopClasses}`;
};

// Grid layout component
interface GridLayoutProps {
  size: GridSize;
  children: React.ReactNode;
  className?: string;
  responsive?: boolean;
}

export function GridLayout({ 
  size, 
  children, 
  className = '', 
  responsive = false 
}: GridLayoutProps) {
  const gridClasses = responsive 
    ? getResponsiveGridClasses(size)
    : getGridClasses(size);

  return (
    <div className={`${gridClasses} ${className}`}>
      {children}
    </div>
  );
}

// Grid item component with automatic sizing
interface GridItemProps {
  children: React.ReactNode;
  className?: string;
  span?: { rows?: number; cols?: number };
}

export function GridItem({ 
  children, 
  className = '', 
  span 
}: GridItemProps) {
  const spanClasses = span 
    ? `${span.cols ? `col-span-${span.cols}` : ''} ${span.rows ? `row-span-${span.rows}` : ''}`
    : '';

  return (
    <div className={`${spanClasses} ${className}`}>
      {children}
    </div>
  );
}

// Available grid sizes by category
export const availableGridSizes = {
  vertical: ['1x2', '1x3', '1x4', '1x6', '1x8', '1x12'] as GridSize[],
  square: ['2x2', '3x3', '4x4', '6x6', '9x9', '12x12'] as GridSize[],
  all: Object.keys(gridDimensions) as GridSize[]
};

// Grid size validator
export const isValidGridSize = (size: string): size is GridSize => {
  return size in gridDimensions;
};