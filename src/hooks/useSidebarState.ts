import { useState, useCallback, useEffect } from 'react';
import { applySolidSidebarForFullMode, getSidebarState } from '@/components/gradient-coverage/utils/gradientModeUtils';

/**
 * Custom hook for managing sidebar transparency state
 * Centralizes sidebar state management and provides a clean API
 */
export function useSidebarState() {
  const [isSidebarSolid, setIsSidebarSolid] = useState(false);

  /**
   * Sync local state with the actual sidebar state
   */
  const syncWithActualState = useCallback(() => {
    setIsSidebarSolid(getSidebarState());
  }, []);

  /**
   * Toggle sidebar transparency and update state
   */
  const toggleSidebarTransparency = useCallback(() => {
    applySolidSidebarForFullMode();
    // Sync state after toggle
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

  // Sync on mount
  useEffect(() => {
    syncWithActualState();
  }, [syncWithActualState]);

  return {
    isSidebarSolid,
    toggleSidebarTransparency,
    setSidebarTransparency,
    syncWithActualState,
  };
}