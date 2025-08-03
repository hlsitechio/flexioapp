import { useCallback } from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import { gradients } from '@/pages/customization/gallery-gradient/gradients';
import { applyGradientMode, GradientMode } from '@/components/gradient-coverage';

/**
 * Custom hook for managing gradient coverage functionality
 * Centralizes gradient application logic and state management
 */
export function useGradientCoverage() {
  const { dashboardBackground, gradientMode, setGradientMode } = useSettings();

  /**
   * Apply the current gradient with the specified mode
   */
  const applyCurrentGradient = useCallback(() => {
    const gradient = gradients.find(g => g.id === dashboardBackground);
    
    if (gradient && 'style' in gradient && gradient.style) {
      // Extract glassmorphic class
      const glassmorphicClass = gradient.class
        .split(' ')
        .find(cls => cls.startsWith('glassmorphic-')) || '';
      
      // Apply the gradient using the current mode
      applyGradientMode(gradientMode, gradient.style as any, glassmorphicClass);
    }
  }, [dashboardBackground, gradientMode]);

  /**
   * Change gradient mode and apply immediately
   */
  const changeGradientMode = useCallback((newMode: GradientMode) => {
    setGradientMode(newMode);
    
    // Apply gradient with new mode
    const gradient = gradients.find(g => g.id === dashboardBackground);
    if (gradient && 'style' in gradient && gradient.style) {
      const glassmorphicClass = gradient.class
        .split(' ')
        .find(cls => cls.startsWith('glassmorphic-')) || '';
      
      applyGradientMode(newMode, gradient.style as any, glassmorphicClass);
    }
  }, [dashboardBackground, setGradientMode]);

  /**
   * Test a specific gradient with a specific mode
   */
  const testGradientMode = useCallback((gradientId: string, mode: GradientMode) => {
    const gradient = gradients.find(g => g.id === gradientId);
    
    if (gradient && 'style' in gradient && gradient.style) {
      const glassmorphicClass = gradient.class
        .split(' ')
        .find(cls => cls.startsWith('glassmorphic-')) || '';
      
      applyGradientMode(mode, gradient.style as any, glassmorphicClass);
    }
  }, []);

  return {
    gradientMode,
    dashboardBackground,
    applyCurrentGradient,
    changeGradientMode,
    testGradientMode,
  };
}