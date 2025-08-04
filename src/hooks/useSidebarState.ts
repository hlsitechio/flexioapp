import { useCallback } from 'react';
import { useNavigationSettings } from '@/contexts/NavigationSettingsContext';
import { applySolidSidebarForFullMode, getSidebarState } from '@/components/gradient-coverage/utils/gradientModeUtils';

/**
 * Hook that integrates with the navigation settings context
 * while maintaining backward compatibility with gradient utilities
 */
export function useSidebarState() {
  const { sidebarSolid, setSidebarSolid } = useNavigationSettings();

  const syncWithActualState = useCallback(() => {
    const actualState = getSidebarState();
    setSidebarSolid(actualState);
  }, [setSidebarSolid]);

  const toggleSidebarTransparency = useCallback(() => {
    applySolidSidebarForFullMode();
    syncWithActualState();
  }, [syncWithActualState]);

  const setSidebarTransparency = useCallback((solid: boolean) => {
    const currentState = getSidebarState();
    if (currentState !== solid) {
      applySolidSidebarForFullMode();
    }
    syncWithActualState();
  }, [syncWithActualState]);

  return {
    isSidebarSolid: sidebarSolid,
    toggleSidebarTransparency,
    setSidebarTransparency,
    syncWithActualState,
  };
}