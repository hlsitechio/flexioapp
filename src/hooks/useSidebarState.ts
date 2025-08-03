import { useCallback, useEffect } from 'react';
import { applySolidSidebarForFullMode, getSidebarState } from '@/components/gradient-coverage/utils/gradientModeUtils';
import { useSettings } from '@/contexts/SettingsContext';

/**
 * Custom hook for managing sidebar transparency state
 * Centralizes sidebar state management and provides a clean API
 * Now integrates with SettingsContext for persistence
 */
export function useSidebarState() {
  const { sidebarSolid, setSidebarSolid } = useSettings();

  /**
   * Sync local state with the actual sidebar state and persistence
   */
  const syncWithActualState = useCallback(() => {
    const actualState = getSidebarState();
    setSidebarSolid(actualState);
  }, [setSidebarSolid]);

  /**
   * Toggle sidebar transparency and update both local and persisted state
   */
  const toggleSidebarTransparency = useCallback(() => {
    applySolidSidebarForFullMode();
    // Sync state after toggle to ensure persistence
    syncWithActualState();
  }, [syncWithActualState]);

  /**
   * Set sidebar to a specific transparency state
   */
  const setSidebarTransparency = useCallback((solid: boolean) => {
    const currentState = getSidebarState();
    if (currentState !== solid) {
      applySolidSidebarForFullMode();
    }
    syncWithActualState();
  }, [syncWithActualState]);

  // Sync on mount and when settings change
  useEffect(() => {
    syncWithActualState();
  }, [syncWithActualState]);

  return {
    isSidebarSolid: sidebarSolid,
    toggleSidebarTransparency,
    setSidebarTransparency,
    syncWithActualState,
  };
}