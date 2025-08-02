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
  };
}

export interface IntelligentGridLayout {
  gridTemplate: {
    columns: string;
    rows: string;
  };
  slots: GridSlot[];
}

export class IntelligentGridCalculator {
  private baseGridSize: GridSize;
  private slots: Record<string, { component: string; gridSize: string } | null>;
  private containerWidth: number;

  constructor(
    baseGridSize: GridSize, 
    slots: Record<string, { component: string; gridSize: string } | null>,
    containerWidth: number = 1200
  ) {
    this.baseGridSize = baseGridSize;
    this.slots = slots;
    this.containerWidth = containerWidth;
  }

  calculateIntelligentLayout(): IntelligentGridLayout {
    const activeSlots = this.getActiveSlots();
    
    if (activeSlots.length === 0) {
      return this.getDefaultLayout();
    }

    // For vertical grids (1x*), use the mixed layout with intelligent sizing
    if (this.baseGridSize.startsWith('1x')) {
      return this.calculateVerticalLayout(activeSlots);
    }

    // For square grids, use intelligent auto-sizing
    return this.calculateSquareLayout(activeSlots);
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

  private calculateVerticalLayout(activeSlots: Array<{ index: number; component: string; gridSize: string }>): IntelligentGridLayout {
    const slots: GridSlot[] = [];
    
    // First slot (index 0) - always full width but height depends on component
    const firstSlot = activeSlots.find(slot => slot.index === 0);
    if (firstSlot) {
      const componentSize = getComponentSize(firstSlot.component);
      slots.push({
        index: 0,
        component: firstSlot.component,
        gridSize: firstSlot.gridSize,
        calculatedSize: {
          width: '100%',
          height: this.getHeightFromConfig(componentSize),
          gridColumn: '1 / -1',
          gridRow: '1'
        }
      });
    }

    // Remaining slots - arrange in intelligent grid
    const remainingSlots = activeSlots.filter(slot => slot.index > 0);
    const gridConfig = this.calculateOptimalGrid(remainingSlots);

    remainingSlots.forEach((slot, index) => {
      const componentSize = getComponentSize(slot.component);
      const { col, row } = this.calculateGridPosition(index, gridConfig.cols);
      
      slots.push({
        index: slot.index,
        component: slot.component,
        gridSize: slot.gridSize,
        calculatedSize: {
          width: '100%',
          height: this.getHeightFromConfig(componentSize),
          gridColumn: `${col} / span ${componentSize.gridSpan?.cols || 1}`,
          gridRow: `${row + 2} / span ${componentSize.gridSpan?.rows || 1}` // +2 to account for first row
        }
      });
    });

    return {
      gridTemplate: {
        columns: `repeat(${gridConfig.cols}, minmax(200px, 1fr))`,
        rows: `auto repeat(${gridConfig.rows}, minmax(150px, auto))`
      },
      slots
    };
  }

  private calculateSquareLayout(activeSlots: Array<{ index: number; component: string; gridSize: string }>): IntelligentGridLayout {
    const gridConfig = this.calculateOptimalGrid(activeSlots);
    const slots: GridSlot[] = [];

    activeSlots.forEach((slot, index) => {
      const componentSize = getComponentSize(slot.component);
      const { col, row } = this.calculateGridPosition(index, gridConfig.cols);
      
      slots.push({
        index: slot.index,
        component: slot.component,
        gridSize: slot.gridSize,
        calculatedSize: {
          width: '100%',
          height: this.getHeightFromConfig(componentSize),
          gridColumn: `${col} / span ${Math.min(componentSize.gridSpan?.cols || 1, gridConfig.cols)}`,
          gridRow: `${row} / span ${componentSize.gridSpan?.rows || 1}`
        }
      });
    });

    return {
      gridTemplate: {
        columns: `repeat(${gridConfig.cols}, minmax(200px, 1fr))`,
        rows: `repeat(${gridConfig.rows}, minmax(150px, auto))`
      },
      slots
    };
  }

  private calculateOptimalGrid(slots: Array<{ component: string }>): { cols: number; rows: number } {
    const totalSlots = slots.length;
    if (totalSlots === 0) return { cols: 1, rows: 1 };

    // Calculate optimal columns based on component requirements and screen size
    const avgSpanCols = slots.reduce((sum, slot) => {
      const size = getComponentSize(slot.component);
      return sum + (size.gridSpan?.cols || 1);
    }, 0) / totalSlots;

    let optimalCols = Math.ceil(Math.sqrt(totalSlots * avgSpanCols));
    
    // Adjust based on container width
    if (this.containerWidth < 768) optimalCols = Math.min(optimalCols, 2);
    else if (this.containerWidth < 1024) optimalCols = Math.min(optimalCols, 3);
    else optimalCols = Math.min(optimalCols, 4);

    const optimalRows = Math.ceil(totalSlots / optimalCols);

    return { cols: optimalCols, rows: optimalRows };
  }

  private calculateGridPosition(index: number, cols: number): { col: number; row: number } {
    const col = (index % cols) + 1;
    const row = Math.floor(index / cols) + 1;
    return { col, row };
  }

  private getHeightFromConfig(componentSize: ComponentSize): string {
    switch (componentSize.preferredHeight) {
      case 'compact': return '150px';
      case 'medium': return '250px';
      case 'tall': return '400px';
      default: return '200px';
    }
  }

  private getDefaultLayout(): IntelligentGridLayout {
    return {
      gridTemplate: {
        columns: 'repeat(auto-fit, minmax(200px, 1fr))',
        rows: 'repeat(auto-fit, minmax(200px, 1fr))'
      },
      slots: []
    };
  }
}