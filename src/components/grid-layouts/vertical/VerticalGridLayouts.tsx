// Export specific layout utilities
export * from '../UnifiedGridSystem';

// Legacy support for vertical-specific exports
export type VerticalGridSize = '1x2' | '1x3' | '1x4' | '1x6' | '1x8' | '1x12';
export { getGridDimensions as getVerticalGridDimensions } from '../UnifiedGridSystem';