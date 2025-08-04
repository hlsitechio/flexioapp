import { useCallback, useEffect } from 'react';
import { useNavigationSettings } from '@/contexts/NavigationSettingsContext';
import { applySolidSidebarForFullMode, getSidebarState } from '@/components/gradient-coverage/utils/gradientModeUtils';

/**
 * Updated hook that integrates with the new navigation settings context
 * while maintaining backward compatibility
 */
export function useSidebarState() {
  const { sidebarSolid, setSidebarSolid } = useNavigationSettings();

  const syncWithActualState = () => {
    const actualState = getSidebarState();
    setSidebarSolid(actualState);
  };

  const toggleSidebarTransparency = () => {
    applySolidSidebarForFullMode();
    syncWithActualState();
  };

  const setSidebarTransparency = (solid: boolean) => {
    const currentState = getSidebarState();
    if (currentState !== solid) {
      applySolidSidebarForFullMode();
    }
    syncWithActualState();
  };

  return {
    isSidebarSolid: sidebarSolid,
    toggleSidebarTransparency,
    setSidebarTransparency,
    syncWithActualState,
  };
}