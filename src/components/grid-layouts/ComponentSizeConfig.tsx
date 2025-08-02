// Component size configuration for intelligent grid sizing
export interface ComponentSize {
  minWidth?: number;
  minHeight?: number;
  preferredWidth?: 'auto' | 'full' | number;
  preferredHeight?: 'auto' | 'tall' | 'medium' | 'compact' | number;
  aspectRatio?: 'auto' | 'square' | 'wide' | 'tall';
  gridSpan?: {
    cols?: number;
    rows?: number;
  };
}

export const componentSizeConfig: Record<string, ComponentSize> = {
  'Calendar': {
    minWidth: 300,
    minHeight: 400,
    preferredWidth: 'auto',
    preferredHeight: 'tall',
    aspectRatio: 'auto',
    gridSpan: {
      cols: 2,
      rows: 3
    }
  },
  'Task Counter': {
    minWidth: 200,
    minHeight: 150,
    preferredWidth: 'auto',
    preferredHeight: 'compact',
    aspectRatio: 'wide',
    gridSpan: {
      cols: 1,
      rows: 1
    }
  },
  'Quick Note': {
    minWidth: 250,
    minHeight: 200,
    preferredWidth: 'auto',
    preferredHeight: 'medium',
    aspectRatio: 'auto',
    gridSpan: {
      cols: 2,
      rows: 2
    }
  },
  'Random Quote': {
    minWidth: 300,
    minHeight: 120,
    preferredWidth: 'full',
    preferredHeight: 'compact',
    aspectRatio: 'wide',
    gridSpan: {
      cols: 3,
      rows: 1
    }
  },
  'Countdown Timer': {
    minWidth: 200,
    minHeight: 180,
    preferredWidth: 'auto',
    preferredHeight: 'medium',
    aspectRatio: 'square',
    gridSpan: {
      cols: 1,
      rows: 2
    }
  },
  'Image Gallery': {
    minWidth: 300,
    minHeight: 300,
    preferredWidth: 'auto',
    preferredHeight: 'tall',
    aspectRatio: 'square',
    gridSpan: {
      cols: 2,
      rows: 2
    }
  }
};

export const getComponentSize = (componentName: string): ComponentSize => {
  return componentSizeConfig[componentName] || {
    minWidth: 200,
    minHeight: 150,
    preferredWidth: 'auto',
    preferredHeight: 'medium',
    aspectRatio: 'auto',
    gridSpan: { cols: 1, rows: 1 }
  };
};