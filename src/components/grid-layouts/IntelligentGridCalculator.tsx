import { GridSize } from './index';
import { ComponentSize, getComponentSize } from './ComponentSizeConfig';

export interface GridSlot {
  index: number;
  component?: string;
  gridSize?: string;
  calculatedSize?: {
    width: string;
    height: string;
    gridColumn?: string;
    gridRow?: string;
    minHeight?: string;
    maxHeight?: string;
  };
}

export interface IntelligentGridLayout {
  gridTemplate: {
    columns: string;
    rows: string;
  };
  slots: GridSlot[];
  breakpoint: 'mobile' | 'tablet' | 'desktop' | 'wide';
}

export interface ResponsiveConfig {
  mobile: { maxCols: number; minCellWidth: number; maxHeight: string };
  tablet: { maxCols: number; minCellWidth: number; maxHeight: string };
  desktop: { maxCols: number; minCellWidth: number; maxHeight: string };
  wide: { maxCols: number; minCellWidth: number; maxHeight: string };
}

export class IntelligentGridCalculator {
  private baseGridSize: GridSize;
  private slots: Record<string, { component: string; gridSize: string } | null>;
  private containerWidth: number;
  private containerHeight: number;
  
  private responsiveConfig: ResponsiveConfig = {
    mobile: { maxCols: 1, minCellWidth: 280, maxHeight: '300px' },
    tablet: { maxCols: 2, minCellWidth: 300, maxHeight: '350px' },
    desktop: { maxCols: 3, minCellWidth: 320, maxHeight: '400px' },
    wide: { maxCols: 4, minCellWidth: 350, maxHeight: '450px' }
  };

  constructor(
    baseGridSize: GridSize, 
    slots: Record<string, { component: string; gridSize: string } | null>,
    containerWidth: number = 1200,
    containerHeight: number = 800
  ) {
    this.baseGridSize = baseGridSize;
    this.slots = slots;
    this.containerWidth = containerWidth;
    this.containerHeight = containerHeight;
  }

  calculateIntelligentLayout(): IntelligentGridLayout {
    const activeSlots = this.getActiveSlots();
    const breakpoint = this.getBreakpoint();
    
    if (activeSlots.length === 0) {
      return this.getDefaultLayout(breakpoint);
    }

    // Enhanced layout calculation based on component types and screen size
    if (this.baseGridSize.startsWith('1x')) {
      return this.calculateEnhancedVerticalLayout(activeSlots, breakpoint);
    }

    return this.calculateEnhancedSquareLayout(activeSlots, breakpoint);
  }

  private getBreakpoint(): 'mobile' | 'tablet' | 'desktop' | 'wide' {
    if (this.containerWidth < 768) return 'mobile';
    if (this.containerWidth < 1024) return 'tablet';
    if (this.containerWidth < 1440) return 'desktop';
    return 'wide';
  }

  private getActiveSlots(): Array<{ index: number; component: string; gridSize: string }> {
    const active: Array<{ index: number; component: string; gridSize: string }> = [];
    
    Object.entries(this.slots).forEach(([key, value]) => {
      if (value && value.component) {
        const slotIndex = parseInt(key.split('-')[1]);
        active.push({
          index: slotIndex,
          component: value.component,
          gridSize: value.gridSize
        });
      }
    });

    return active.sort((a, b) => a.index - b.index);
  }

  private calculateEnhancedVerticalLayout(
    activeSlots: Array<{ index: number; component: string; gridSize: string }>,
    breakpoint: 'mobile' | 'tablet' | 'desktop' | 'wide'
  ): IntelligentGridLayout {
    const slots: GridSlot[] = [];
    const config = this.responsiveConfig[breakpoint];
    
    // First slot - full width with adaptive height
    const firstSlot = activeSlots.find(slot => slot.index === 0);
    if (firstSlot) {
      const componentSize = getComponentSize(firstSlot.component);
      const adaptiveHeight = this.calculateAdaptiveHeight(componentSize, breakpoint);
      
      slots.push({
        index: 0,
        component: firstSlot.component,
        gridSize: firstSlot.gridSize,
        calculatedSize: {
          width: '100%',
          height: adaptiveHeight.height,
          minHeight: adaptiveHeight.minHeight,
          maxHeight: adaptiveHeight.maxHeight,
          gridColumn: '1 / -1',
          gridRow: '1'
        }
      });
    }

    // Remaining slots with intelligent packing
    const remainingSlots = activeSlots.filter(slot => slot.index > 0);
    const gridConfig = this.calculateEnhancedGrid(remainingSlots, breakpoint);

    // Smart positioning algorithm
    const positionMap = this.calculateSmartPositions(remainingSlots, gridConfig);

    remainingSlots.forEach((slot, index) => {
      const componentSize = getComponentSize(slot.component);
      const position = positionMap[index];
      const adaptiveHeight = this.calculateAdaptiveHeight(componentSize, breakpoint);
      
      slots.push({
        index: slot.index,
        component: slot.component,
        gridSize: slot.gridSize,
        calculatedSize: {
          width: '100%',
          height: adaptiveHeight.height,
          minHeight: adaptiveHeight.minHeight,
          maxHeight: adaptiveHeight.maxHeight,
          gridColumn: `${position.col} / span ${Math.min(componentSize.gridSpan?.cols || 1, gridConfig.cols)}`,
          gridRow: `${position.row + 2} / span ${componentSize.gridSpan?.rows || 1}`
        }
      });
    });

    return {
      gridTemplate: {
        columns: `repeat(${gridConfig.cols}, minmax(${config.minCellWidth}px, 1fr))`,
        rows: `auto repeat(${Math.max(gridConfig.rows, 2)}, minmax(150px, max-content))`
      },
      slots,
      breakpoint
    };
  }

  private calculateEnhancedSquareLayout(
    activeSlots: Array<{ index: number; component: string; gridSize: string }>,
    breakpoint: 'mobile' | 'tablet' | 'desktop' | 'wide'
  ): IntelligentGridLayout {
    const gridConfig = this.calculateEnhancedGrid(activeSlots, breakpoint);
    const config = this.responsiveConfig[breakpoint];
    const slots: GridSlot[] = [];

    // Smart positioning for square layout
    const positionMap = this.calculateSmartPositions(activeSlots, gridConfig);

    activeSlots.forEach((slot, index) => {
      const componentSize = getComponentSize(slot.component);
      const position = positionMap[index];
      const adaptiveHeight = this.calculateAdaptiveHeight(componentSize, breakpoint);
      
      slots.push({
        index: slot.index,
        component: slot.component,
        gridSize: slot.gridSize,
        calculatedSize: {
          width: '100%',
          height: adaptiveHeight.height,
          minHeight: adaptiveHeight.minHeight,
          maxHeight: adaptiveHeight.maxHeight,
          gridColumn: `${position.col} / span ${Math.min(componentSize.gridSpan?.cols || 1, gridConfig.cols)}`,
          gridRow: `${position.row} / span ${componentSize.gridSpan?.rows || 1}`
        }
      });
    });

    return {
      gridTemplate: {
        columns: `repeat(${gridConfig.cols}, minmax(${config.minCellWidth}px, 1fr))`,
        rows: `repeat(${gridConfig.rows}, minmax(150px, max-content))`
      },
      slots,
      breakpoint
    };
  }

  private calculateEnhancedGrid(
    slots: Array<{ component: string }>,
    breakpoint: 'mobile' | 'tablet' | 'desktop' | 'wide'
  ): { cols: number; rows: number } {
    const totalSlots = slots.length;
    if (totalSlots === 0) return { cols: 1, rows: 1 };

    const config = this.responsiveConfig[breakpoint];
    
    // Component complexity analysis
    const componentWeights = slots.map(slot => {
      const size = getComponentSize(slot.component);
      return {
        cols: size.gridSpan?.cols || 1,
        rows: size.gridSpan?.rows || 1,
        complexity: this.getComponentComplexity(slot.component)
      };
    });

    // Calculate weighted column requirements
    const totalColWeight = componentWeights.reduce((sum, weight) => sum + weight.cols * weight.complexity, 0);
    const avgColWeight = totalColWeight / totalSlots;
    
    // Determine optimal columns with complexity consideration
    let optimalCols = Math.min(
      Math.ceil(Math.sqrt(totalSlots * avgColWeight)),
      config.maxCols
    );

    // Ensure minimum viable grid
    optimalCols = Math.max(optimalCols, 1);
    
    // Calculate rows needed
    const totalCellsNeeded = componentWeights.reduce((sum, weight) => sum + (weight.cols * weight.rows), 0);
    const optimalRows = Math.max(1, Math.ceil(totalCellsNeeded / optimalCols));

    return { cols: optimalCols, rows: optimalRows };
  }

  private calculateSmartPositions(
    slots: Array<{ component: string }>,
    gridConfig: { cols: number; rows: number }
  ): Array<{ col: number; row: number }> {
    const positions: Array<{ col: number; row: number }> = [];
    const occupiedCells = new Set<string>();

    slots.forEach((slot, index) => {
      const componentSize = getComponentSize(slot.component);
      const spanCols = Math.min(componentSize.gridSpan?.cols || 1, gridConfig.cols);
      const spanRows = componentSize.gridSpan?.rows || 1;
      
      // Find best position using bin packing algorithm
      let bestPosition = { col: 1, row: 1 };
      let found = false;

      for (let row = 1; row <= gridConfig.rows && !found; row++) {
        for (let col = 1; col <= gridConfig.cols - spanCols + 1 && !found; col++) {
          if (this.canPlaceComponent(col, row, spanCols, spanRows, occupiedCells, gridConfig)) {
            bestPosition = { col, row };
            found = true;
            
            // Mark cells as occupied
            for (let r = row; r < row + spanRows; r++) {
              for (let c = col; c < col + spanCols; c++) {
                occupiedCells.add(`${c}-${r}`);
              }
            }
          }
        }
      }

      positions.push(bestPosition);
    });

    return positions;
  }

  private canPlaceComponent(
    col: number,
    row: number,
    spanCols: number,
    spanRows: number,
    occupiedCells: Set<string>,
    gridConfig: { cols: number; rows: number }
  ): boolean {
    // Check if component fits within grid bounds
    if (col + spanCols - 1 > gridConfig.cols || row + spanRows - 1 > gridConfig.rows) {
      return false;
    }

    // Check if all required cells are available
    for (let r = row; r < row + spanRows; r++) {
      for (let c = col; c < col + spanCols; c++) {
        if (occupiedCells.has(`${c}-${r}`)) {
          return false;
        }
      }
    }

    return true;
  }

  private getComponentComplexity(componentName: string): number {
    const complexityMap: Record<string, number> = {
      'Calendar': 1.5,
      'Task Counter': 0.8,
      'Quick Note': 1.2,
      'Random Quote': 0.9,
      'Countdown Timer': 1.0,
      'Image Gallery': 1.4
    };
    
    return complexityMap[componentName] || 1.0;
  }

  private calculateAdaptiveHeight(
    componentSize: ComponentSize,
    breakpoint: 'mobile' | 'tablet' | 'desktop' | 'wide'
  ): { height: string; minHeight: string; maxHeight: string } {
    const config = this.responsiveConfig[breakpoint];
    
    const baseHeights = {
      compact: { mobile: '120px', tablet: '140px', desktop: '160px', wide: '180px' },
      medium: { mobile: '200px', tablet: '220px', desktop: '250px', wide: '280px' },
      tall: { mobile: '280px', tablet: '320px', desktop: '380px', wide: '420px' },
      auto: { mobile: '180px', tablet: '200px', desktop: '220px', wide: '250px' }
    };

    const heightKey = componentSize.preferredHeight as keyof typeof baseHeights || 'auto';
    const height = baseHeights[heightKey][breakpoint];
    
    return {
      height,
      minHeight: breakpoint === 'mobile' ? '120px' : '150px',
      maxHeight: config.maxHeight
    };
  }

  private getDefaultLayout(breakpoint: 'mobile' | 'tablet' | 'desktop' | 'wide'): IntelligentGridLayout {
    const config = this.responsiveConfig[breakpoint];
    
    return {
      gridTemplate: {
        columns: `repeat(auto-fit, minmax(${config.minCellWidth}px, 1fr))`,
        rows: 'repeat(auto-fit, minmax(150px, max-content))'
      },
      slots: [],
      breakpoint
    };
  }
}