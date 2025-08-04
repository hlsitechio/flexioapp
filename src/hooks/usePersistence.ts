import { useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

/**
 * Custom hook for handling settings persistence to both localStorage and Supabase
 * Note: This is a simplified version that works with localStorage until we can
 * properly refactor the user_settings table structure
 */
export function usePersistence(settingsKey: string, currentSettings: Record<string, any>) {
  const { user } = useAuth();

  const loadSettings = useCallback(async () => {
    try {
      // For now, just use localStorage until we properly migrate the database
      const localSettings = localStorage.getItem(settingsKey);
      
      if (localSettings) {
        return JSON.parse(localSettings);
      }
    } catch (error) {
      console.error(`Error loading ${settingsKey}:`, error);
    }
    
    return null;
  }, [settingsKey]);

  const saveSettings = useCallback(async (settings: Record<string, any>) => {
    try {
      // Always save to localStorage
      localStorage.setItem(settingsKey, JSON.stringify(settings));

      // TODO: Implement proper Supabase sync when we refactor the user_settings table
      // to use a more flexible structure with JSONB columns for different setting types
    } catch (error) {
      console.error(`Error saving ${settingsKey}:`, error);
    }
  }, [settingsKey]);

  const resetSettings = useCallback(async () => {
    try {
      // Remove from localStorage
      localStorage.removeItem(settingsKey);
    } catch (error) {
      console.error(`Error resetting ${settingsKey}:`, error);
    }
  }, [settingsKey]);

  return {
    loadSettings,
    saveSettings,
    resetSettings,
  };
}