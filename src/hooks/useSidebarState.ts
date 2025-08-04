import { useCallback, useEffect } from 'react';
import { useNavigationSettings } from '@/contexts/NavigationSettingsContext';

/**
 * Updated hook that integrates with the new navigation settings context
 * while maintaining backward compatibility
 */
export function useSidebarState() {
  const { sidebarSolid, setSidebarSolid } = useNavigationSettings();

  // For now, we'll use the legacy gradient coverage utils
  // TODO: Migrate these to the navigation settings context
  const { applySolidSidebarForFullMode, getSidebarState } = require('@/components/gradient-coverage/utils/gradientModeUtils');

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