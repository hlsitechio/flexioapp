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

let sidebarIsOpaque = false; // Track current state

export function applySolidSidebarForFullMode() {
  console.log('Toggle sidebar transparency called, current state:', sidebarIsOpaque);
  
  // Target the sidebar and ALL its internal components, including scrollbars
  const sidebarSelectors = [
    '.gradient-target-sidebar',
    '[data-sidebar="sidebar"]',
    'aside',
    'aside *',
    'aside .card',
    'aside [class*="bg-"]'
  ];
  
  // Target main content areas to match sidebar transparency
  const mainContentSelectors = [
    '.main-content-area',
    '.dashboard-container',
    'main',
    'main .card',
    'main [class*="bg-"]'
  ];
  
  // Separate selectors for scrollbar elements - comprehensive targeting
  const scrollbarSelectors = [
    'aside [data-radix-scroll-area-scrollbar]',
    'aside [data-radix-scroll-area-thumb]',
    'aside [data-radix-scroll-area-corner]',
    'aside .scrollbar-thumb',
    'aside .scrollbar-track',
    'aside ::-webkit-scrollbar',
    'aside ::-webkit-scrollbar-thumb',
    'aside ::-webkit-scrollbar-track'
  ];
  
  // Also add CSS rules for webkit scrollbars
  const addScrollbarCSS = (opacity: string, background: string) => {
    const style = document.createElement('style');
    style.id = 'sidebar-scrollbar-styles';
    
    // Remove existing style if present
    const existing = document.getElementById('sidebar-scrollbar-styles');
    if (existing) existing.remove();
    
    style.textContent = `
      aside ::-webkit-scrollbar {
        width: 8px;
        opacity: ${opacity};
        transition: all 0.3s ease-in-out;
      }
      aside ::-webkit-scrollbar-thumb {
        background: ${background};
        border-radius: 4px;
        opacity: ${opacity};
        transition: all 0.3s ease-in-out;
      }
      aside ::-webkit-scrollbar-track {
        background: transparent;
        opacity: ${opacity};
        transition: all 0.3s ease-in-out;
      }
    `;
    document.head.appendChild(style);
  };
  
  if (!sidebarIsOpaque) {
    // Make sidebar OPAQUE (0% transparency)
    console.log('Making sidebar opaque (0% transparency)');
    
    sidebarSelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        if (element instanceof HTMLElement) {
          // Remove any transparent backgrounds and blur effects
          element.style.background = '';
          element.style.backgroundColor = '';
          element.style.backdropFilter = '';
          element.classList.remove('bg-background/95', 'bg-card/50', 'bg-muted/50');
          
          // Apply solid backgrounds
          if (element.tagName === 'ASIDE' || element.closest('aside')) {
            element.style.backgroundColor = 'hsl(var(--background))';
            element.style.border = '1px solid hsl(var(--border))';
          }
          
          element.style.transition = 'all 0.3s ease-in-out';
          element.className = element.className.replace(/glassmorphic-\w+/g, '').trim();
          element.className = element.className.replace(/bg-\w+\/\d+/g, '').trim();
        }
      });
    });
    
    // Handle scrollbars separately - make them OPAQUE (0% transparency)
    scrollbarSelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        if (element instanceof HTMLElement) {
          element.style.backgroundColor = 'hsl(var(--border))';
          element.style.opacity = '1';
          element.style.transition = 'all 0.3s ease-in-out';
        }
      });
    });
    
    // Add CSS for webkit scrollbars - OPAQUE
    addScrollbarCSS('1', 'hsl(var(--border))');
    
    // Apply same OPAQUE treatment to main content areas
    mainContentSelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        if (element instanceof HTMLElement) {
          // Remove any transparent backgrounds and blur effects
          element.style.background = '';
          element.style.backgroundColor = '';
          element.style.backdropFilter = '';
          element.classList.remove('bg-background/95', 'bg-card/50', 'bg-muted/50');
          
          // Apply solid backgrounds
          if (element.classList.contains('card') || element.closest('.card')) {
            element.style.backgroundColor = 'hsl(var(--card))';
            element.style.border = '1px solid hsl(var(--border))';
          } else {
            element.style.backgroundColor = 'hsl(var(--background))';
          }
          
          element.style.transition = 'all 0.3s ease-in-out';
          element.className = element.className.replace(/glassmorphic-\w+/g, '').trim();
          element.className = element.className.replace(/bg-\w+\/\d+/g, '').trim();
        }
      });
    });
    
    sidebarIsOpaque = true;
  } else {
    // Make sidebar TRANSPARENT (100% transparency)
    console.log('Making sidebar transparent (100% transparency)');
    
    sidebarSelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        if (element instanceof HTMLElement) {
          // Apply transparent backgrounds
          element.style.backgroundColor = 'transparent';
          element.style.background = 'transparent';
          element.style.backdropFilter = 'blur(20px)';
          element.style.border = '1px solid rgba(255, 255, 255, 0.1)';
          element.style.transition = 'all 0.3s ease-in-out';
        }
      });
    });
    
    // Handle scrollbars separately - make them TRANSPARENT (100% transparency)
    scrollbarSelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        if (element instanceof HTMLElement) {
          element.style.backgroundColor = 'transparent';
          element.style.opacity = '0';
          element.style.transition = 'all 0.3s ease-in-out';
        }
      });
    });
    
    // Add CSS for webkit scrollbars - TRANSPARENT
    addScrollbarCSS('0', 'transparent');
    
    // Apply same TRANSPARENT treatment to main content areas
    mainContentSelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        if (element instanceof HTMLElement) {
          // Apply transparent backgrounds
          element.style.backgroundColor = 'transparent';
          element.style.background = 'transparent';
          element.style.backdropFilter = 'blur(20px)';
          element.style.border = '1px solid rgba(255, 255, 255, 0.1)';
          element.style.transition = 'all 0.3s ease-in-out';
          
          // Remove any glassmorphic classes
          element.className = element.className.replace(/glassmorphic-\w+/g, '').trim();
          element.className = element.className.replace(/bg-\w+\/\d+/g, '').trim();
        }
      });
    });
    
    sidebarIsOpaque = false;
  }
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