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
        // Clear any existing inline background styles first
        element.style.background = '';
        element.style.backgroundColor = '';
        element.style.backdropFilter = '';
        
        // Remove any conflicting background classes
        element.classList.remove('bg-background/95', 'bg-sidebar-background');
        
        // Apply gradient background
        if (gradientStyle.background) {
          element.style.background = gradientStyle.background;
        }
        
        // Apply backdrop filter for glassmorphism
        if (gradientStyle.backdropFilter) {
          element.style.backdropFilter = gradientStyle.backdropFilter;
        }
        
        // Apply border and shadow
        if (gradientStyle.border) {
          element.style.border = gradientStyle.border;
        }
        
        if (gradientStyle.boxShadow) {
          element.style.boxShadow = gradientStyle.boxShadow;
        }
        
        // Add glassmorphic class for additional effects
        if (glassmorphicClass && !element.classList.contains(glassmorphicClass)) {
          // Remove any existing glassmorphic classes first
          element.className = element.className.replace(/glassmorphic-\w+/g, '').trim();
          element.classList.add(glassmorphicClass);
        }
        
        // Add smooth transition
        element.style.transition = 'all 0.5s ease-in-out';
        
        // Ensure z-index doesn't interfere with content
        element.style.position = 'relative';
      }
    });
  });
}

export function applySolidSidebarForFullMode() {
  // Target the sidebar and ALL its internal components
  const sidebarSelectors = [
    '.gradient-target-sidebar',
    '[data-sidebar="sidebar"]',
    '[data-sidebar="sidebar"] *', // All children inside sidebar
    '[data-sidebar="sidebar"] .card',
    '[data-sidebar="sidebar"] .bg-card',
    '[data-sidebar="sidebar"] .bg-background',
    '[data-sidebar="sidebar"] .bg-muted',
    '[data-sidebar="sidebar"] .bg-accent',
    'aside *', // All sidebar content
    'aside .card',
    'aside [class*="bg-"]' // Any background classes
  ];
  
  sidebarSelectors.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
      if (element instanceof HTMLElement) {
        // Remove any transparent backgrounds and blur effects
        element.style.background = '';
        element.style.backgroundColor = '';
        element.style.backdropFilter = '';
        element.classList.remove('bg-background/95', 'bg-card/50', 'bg-muted/50');
        
        // Apply solid backgrounds based on element type
        if (element.classList.contains('card') || element.closest('.card')) {
          element.style.backgroundColor = 'hsl(var(--card))';
          element.style.border = '1px solid hsl(var(--border))';
        } else if (element.tagName === 'ASIDE' || element.closest('aside')) {
          element.style.backgroundColor = 'hsl(var(--background))';
        } else {
          // Default solid background for other elements
          element.style.backgroundColor = 'hsl(var(--background))';
        }
        
        element.style.transition = 'all 0.3s ease-in-out';
        
        // Remove any glassmorphic classes
        element.className = element.className.replace(/glassmorphic-\w+/g, '').trim();
        element.className = element.className.replace(/bg-\w+\/\d+/g, '').trim();
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