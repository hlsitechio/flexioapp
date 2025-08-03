import { GradientMode, GradientStyle } from '../types';

export const GRADIENT_MODE_CONFIGS = {
  'full': {
    id: 'full' as const,
    name: 'Full Dashboard',
    description: 'Gradient behind everything',
    targets: ['.dashboard-container']
  },
  'main': {
    id: 'main' as const,
    name: 'Main Only',
    description: 'Gradient on main content only',
    targets: ['.main-content-area']
  },
  'main-nav': {
    id: 'main-nav' as const,
    name: 'Main + Navigation',
    description: 'Gradient on main content and navigation',
    targets: ['.main-content-area', '.gradient-target-header']
  },
  'main-sidebar': {
    id: 'main-sidebar' as const,
    name: 'Main + Sidebar',
    description: 'Gradient on main content and sidebar',
    targets: ['.main-content-area', '.gradient-target-sidebar']
  }
};

export function clearAllGradientStyles() {
  const allTargets = [
    '.dashboard-container',
    '.main-content-area',
    '.gradient-target-header',
    '.gradient-target-sidebar',
    '[data-component="header"]',
    '[data-sidebar="sidebar"]'
  ];

  allTargets.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
      if (element instanceof HTMLElement) {
        element.style.background = '';
        element.style.backgroundColor = '';
        element.style.backdropFilter = '';
        element.style.border = '';
        element.style.boxShadow = '';
        element.className = element.className.replace(/glassmorphic-\w+/g, '').trim();
        
        // Restore original background classes for header and sidebar
        if (selector.includes('header')) {
          element.classList.add('bg-background/95', 'backdrop-blur-xl');
        } else if (selector.includes('sidebar')) {
          element.classList.add('bg-sidebar-background', 'backdrop-blur-xl');
        }
      }
    });
  });
}

export function applyGradientToTargets(
  targets: string[], 
  gradientStyle: GradientStyle,
  glassmorphicClass: string
) {
  targets.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
      if (element instanceof HTMLElement) {
        // Apply styles with modifications for specific targets
        if (gradientStyle.background) {
          let background = gradientStyle.background;
          
          // For navigation and sidebar, ensure solid, opaque backgrounds
          if (selector.includes('header') || selector.includes('sidebar')) {
            // Remove existing transparent backgrounds
            element.style.backgroundColor = '';
            element.style.backdropFilter = 'none';
            
            // Apply gradient background with full opacity
            element.style.background = background;
            
            // Override any existing transparent classes
            element.classList.remove('bg-background/95', 'bg-sidebar-background');
            element.classList.remove('backdrop-blur-xl');
          } else {
            element.style.background = background;
            if (gradientStyle.backdropFilter) element.style.backdropFilter = gradientStyle.backdropFilter;
          }
        }
        
        if (gradientStyle.border) element.style.border = gradientStyle.border;
        if (gradientStyle.boxShadow) element.style.boxShadow = gradientStyle.boxShadow;
        
        // Add glassmorphic class
        if (glassmorphicClass && !element.classList.contains(glassmorphicClass)) {
          element.classList.add(glassmorphicClass);
        }
        
        // Add transition for smooth changes
        element.style.transition = 'all 0.5s ease-in-out';
      }
    });
  });
}

export function applyGradientMode(
  mode: GradientMode,
  gradientStyle: GradientStyle,
  glassmorphicClass: string
) {
  // Clear all existing styles first
  clearAllGradientStyles();
  
  // Get the configuration for this mode
  const config = GRADIENT_MODE_CONFIGS[mode];
  if (!config) {
    console.warn(`Unknown gradient mode: ${mode}`);
    return;
  }
  
  // Apply gradient to the targets for this mode
  applyGradientToTargets(config.targets, gradientStyle, glassmorphicClass);
}