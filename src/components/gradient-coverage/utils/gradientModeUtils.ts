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
    targets: ['.main-content-area', '.gradient-target-header', '[data-component="header"]']
  },
  'main-sidebar': {
    id: 'main-sidebar' as const,
    name: 'Main + Sidebar',
    description: 'Gradient on main content and sidebar',
    targets: ['.main-content-area', '.gradient-target-sidebar', '[data-sidebar="sidebar"]']
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
        // Clear all gradient-related styles
        element.style.background = '';
        element.style.backgroundColor = '';
        element.style.backdropFilter = '';
        element.style.border = '';
        element.style.boxShadow = '';
        element.style.transition = '';
        
        // Remove glassmorphic classes
        element.className = element.className.replace(/glassmorphic-\w+/g, '').trim();
        
        // Restore appropriate backdrop blur for transparent elements
        if (selector.includes('header') || selector.includes('sidebar')) {
          element.style.backdropFilter = 'blur(20px)';
          element.classList.add('bg-background/95');
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
        // Apply consistent glassmorphic styles to all targets
        if (gradientStyle.background) {
          element.style.background = gradientStyle.background;
        }
        
        if (gradientStyle.backdropFilter) {
          element.style.backdropFilter = gradientStyle.backdropFilter;
        }
        
        if (gradientStyle.border) {
          element.style.border = gradientStyle.border;
        }
        
        if (gradientStyle.boxShadow) {
          element.style.boxShadow = gradientStyle.boxShadow;
        }
        
        // Add glassmorphic class for consistent styling
        if (glassmorphicClass && !element.classList.contains(glassmorphicClass)) {
          element.classList.add(glassmorphicClass);
        }
        
        // Remove any conflicting background classes that might interfere
        element.classList.remove('bg-background/95', 'bg-sidebar-background');
        
        // Add smooth transition for gradient changes
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