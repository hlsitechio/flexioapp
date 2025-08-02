import React from 'react';

// Square grid layout types
export type SquareGridSize = '2x2' | '3x3' | '4x4' | '6x6' | '9x9' | '12x12';

export const squareGridDimensions = {
  '2x2': { rows: 2, cols: 2 },
  '3x3': { rows: 3, cols: 3 },
  '4x4': { rows: 4, cols: 4 },
  '6x6': { rows: 6, cols: 6 },
  '9x9': { rows: 9, cols: 9 },
  '12x12': { rows: 12, cols: 12 }
};

export const getSquareGridDimensions = (size: SquareGridSize) => {
  return squareGridDimensions[size];
};