import React from 'react';

// Vertical grid layout types
export type VerticalGridSize = '1x2' | '1x3' | '1x4' | '1x6' | '1x8' | '1x12';

export const verticalGridDimensions = {
  '1x2': { rows: 2, cols: 1 },
  '1x3': { rows: 3, cols: 1 },
  '1x4': { rows: 4, cols: 1 },
  '1x6': { rows: 6, cols: 1 },
  '1x8': { rows: 8, cols: 1 },
  '1x12': { rows: 12, cols: 1 }
};

export const getVerticalGridDimensions = (size: VerticalGridSize) => {
  return verticalGridDimensions[size];
};