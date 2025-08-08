import { useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { useWorkspaceProfile } from '@/contexts/WorkspaceProfileContext';

/**
 * Cloud-first persistence hook with workspace scoping.
 * - Saves to Supabase workspace_profiles when authenticated and a profile is active
 * - Falls back to localStorage for guests or if no profile is available
 */
export function usePersistence(settingsKey: string, currentSettings: Record<string, any>) {
  const { user } = useAuth();
  const { workspace } = useWorkspace();
  const { currentProfile } = useWorkspaceProfile();

  const loadSettings = useCallback(async () => {
    try {
      // Prefer cloud workspace profile when available
      if (user && workspace && currentProfile) {
        // Build settings object from workspace profile based on settingsKey
        const p: any = currentProfile;
        if (settingsKey === 'ui_settings') {
          return {
            showHeaderTitle: p.show_header_title,
            customHeaderTitle: p.custom_header_title,
            minimalNavigationMode: p.minimal_navigation_mode,
            hideDividers: p.hide_dividers,
            clockPosition: p.clock_position,
            show24Hour: p.use_24_hour_format,
            showSeconds: p.show_seconds,
            editMode: p.edit_mode,
            dashboardBackground: p.dashboard_background,
            gradientMode: p.gradient_mode,
          };
        }
        if (settingsKey === 'navigation_settings') {
          // quickNotesEnabled stored in dashboard_layout as an extension field
          const dl = (p.dashboard_layout || {}) as Record<string, any>;
          return {
            sidebarSolid: p.sidebar_solid,
            quickNotesEnabled: dl?.navigation_settings?.quickNotesEnabled,
            userNavigationOrder: p.user_navigation_order || [],
          };
        }
        if (settingsKey === 'dashboard_settings') {
          const dl = (p.dashboard_layout || {}) as Record<string, any>;
          const slots = dl?.dashboard_slots || {};
          return {
            slot1: slots.slot1 || [],
            slot2: slots.slot2 || [],
            slot3: slots.slot3 || [],
            slot4: slots.slot4 || [],
            slot5: slots.slot5 || [],
            slot6: slots.slot6 || [],
            gridSize: p.grid_size,
            bannerImage: p.banner_image,
            bannerEnabled: p.show_banner,
          };
        }
      }

      // Fallback to localStorage
      const localSettings = localStorage.getItem(settingsKey);
      if (localSettings) {
        return JSON.parse(localSettings);
      }
    } catch (error) {
      console.error(`Error loading ${settingsKey}:`, error);
    }
    return null;
  }, [user, workspace, currentProfile, settingsKey]);

  const saveSettings = useCallback(async (settings: Record<string, any>) => {
    try {
      // Always keep a local copy for fast loads/offline
      localStorage.setItem(settingsKey, JSON.stringify(settings));

      // Sync to Supabase when possible
      if (user && workspace && currentProfile) {
        const updates: Record<string, any> = {};
        if (settingsKey === 'ui_settings') {
          updates.custom_header_title = settings.customHeaderTitle ?? currentSettings.customHeaderTitle;
          updates.show_header_title = settings.showHeaderTitle ?? currentSettings.showHeaderTitle;
          updates.minimal_navigation_mode = settings.minimalNavigationMode ?? currentSettings.minimalNavigationMode;
          updates.hide_dividers = settings.hideDividers ?? currentSettings.hideDividers;
          updates.clock_position = settings.clockPosition ?? currentSettings.clockPosition;
          updates.use_24_hour_format = settings.show24Hour ?? currentSettings.show24Hour;
          updates.show_seconds = settings.showSeconds ?? currentSettings.showSeconds;
          updates.edit_mode = settings.editMode ?? currentSettings.editMode;
          updates.dashboard_background = settings.dashboardBackground ?? currentSettings.dashboardBackground;
          updates.gradient_mode = settings.gradientMode ?? currentSettings.gradientMode;
        } else if (settingsKey === 'navigation_settings') {
          updates.sidebar_solid = settings.sidebarSolid ?? currentSettings.sidebarSolid;
          updates.user_navigation_order = settings.userNavigationOrder ?? currentSettings.userNavigationOrder;
          // Merge quickNotesEnabled into dashboard_layout.navigation_settings
          const existingDL = (currentProfile.dashboard_layout || {}) as Record<string, any>;
          const newDL = {
            ...existingDL,
            navigation_settings: {
              ...(existingDL.navigation_settings || {}),
              ...(typeof settings.quickNotesEnabled === 'undefined' ? {} : { quickNotesEnabled: settings.quickNotesEnabled }),
            },
          };
          updates.dashboard_layout = newDL;
        } else if (settingsKey === 'dashboard_settings') {
          updates.grid_size = settings.gridSize ?? currentSettings.gridSize;
          updates.banner_image = settings.bannerImage ?? currentSettings.bannerImage;
          updates.show_banner = settings.bannerEnabled ?? currentSettings.bannerEnabled;
          // Persist slots within dashboard_layout.dashboard_slots
          const existingDL = (currentProfile.dashboard_layout || {}) as Record<string, any>;
          const slots = {
            slot1: settings.slot1 ?? currentSettings.slot1,
            slot2: settings.slot2 ?? currentSettings.slot2,
            slot3: settings.slot3 ?? currentSettings.slot3,
            slot4: settings.slot4 ?? currentSettings.slot4,
            slot5: settings.slot5 ?? currentSettings.slot5,
            slot6: settings.slot6 ?? currentSettings.slot6,
          };
          updates.dashboard_layout = {
            ...existingDL,
            dashboard_slots: slots,
          };
        }

        if (Object.keys(updates).length > 0) {
          const { error } = await supabase
            .from('workspace_profiles')
            .update(updates)
            .eq('id', currentProfile.id);
          if (error) {
            console.error(`Supabase update failed for ${settingsKey}:`, error);
          }
        }
      }
    } catch (error) {
      console.error(`Error saving ${settingsKey}:`, error);
    }
  }, [user, workspace, currentProfile, settingsKey, currentSettings]);

  const resetSettings = useCallback(async () => {
    try {
      localStorage.removeItem(settingsKey);
      // Do not wipe cloud values automatically to avoid destructive actions here
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
