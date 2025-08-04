// Export specific layout utilities  
export * from '../UnifiedGridSystem';

// Legacy support for square-specific exports
export type SquareGridSize = '2x2' | '3x3' | '4x4' | '6x6' | '9x9' | '12x12';
export { getGridDimensions as getSquareGridDimensions } from '../UnifiedGridSystem';