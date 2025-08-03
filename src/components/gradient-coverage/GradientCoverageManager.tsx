import { useEffect } from 'react';
import { useGradientCoverage } from '@/hooks/useGradientCoverage';

export function GradientCoverageManager() {
  const { applyCurrentGradient } = useGradientCoverage();

  useEffect(() => {
    applyCurrentGradient();
  }, [applyCurrentGradient]);

  // This component doesn't render anything, it just manages gradient application
  return null;
}