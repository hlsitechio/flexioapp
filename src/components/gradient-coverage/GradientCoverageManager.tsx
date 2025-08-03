import { useEffect } from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import { gradients } from '@/pages/customization/gallery-gradient/gradients';
import { applyGradientMode } from './utils/gradientModeUtils';

export function GradientCoverageManager() {
  const { dashboardBackground, gradientMode } = useSettings();

  useEffect(() => {
    // Find the selected gradient
    const gradient = gradients.find(g => g.id === dashboardBackground);
    
    if (gradient && 'style' in gradient && gradient.style) {
      // Extract glassmorphic class
      const glassmorphicClass = gradient.class
        .split(' ')
        .find(cls => cls.startsWith('glassmorphic-')) || '';
      
      // Prepare gradient style
      const gradientStyle = gradient.style as any;
      
      // Apply the gradient using the new system
      applyGradientMode(gradientMode, gradientStyle, glassmorphicClass);
    }
  }, [dashboardBackground, gradientMode]);

  // This component doesn't render anything, it just manages gradient application
  return null;
}