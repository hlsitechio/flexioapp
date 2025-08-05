import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { useWorkspace } from './WorkspaceContext';
import { useToast } from '@/hooks/use-toast';

export interface WorkspaceProfile {
  id: string;
  user_id: string;
  workspace_id: string;
  name: string;
  category: 'work' | 'personal' | 'fun' | 'default';
  is_default: boolean;
  
  // Dashboard Layout Settings
  dashboard_layout: Record<string, any>;
  grid_size: string;
  banner_image: string;
  show_banner: boolean;
  banner_height: number;
  dashboard_background: string;
  
  // UI Settings
  custom_header_title: string;
  custom_sidebar_title: string;
  show_header_title: boolean;
  show_sidebar_crown: boolean;
  
  // Navigation Settings
  top_navigation_widgets: any[];
  user_navigation_order: string[];
  minimal_navigation_mode: boolean;
  sidebar_solid: boolean;
  sidebar_collapsed: boolean;
  
  // Appearance Settings
  gradient_mode: string;
  hide_dividers: boolean;
  
  // Clock Settings
  use_24_hour_format: boolean;
  show_year: boolean;
  show_date: boolean;
  show_seconds: boolean;
  clock_position: string;
  
  // Other Settings
  edit_mode: boolean;
  quick_note: string;
  
  created_at: string;
  updated_at: string;
}

interface WorkspaceProfileContextType {
  profiles: WorkspaceProfile[];
  currentProfile: WorkspaceProfile | null;
  loading: boolean;
  
  // Profile management
  createProfile: (name: string, category: WorkspaceProfile['category']) => Promise<WorkspaceProfile | null>;
  updateProfile: (profileId: string, updates: Partial<WorkspaceProfile>) => Promise<void>;
  deleteProfile: (profileId: string) => Promise<void>;
  switchToProfile: (profileId: string) => Promise<void>;
  duplicateProfile: (profileId: string, newName: string) => Promise<WorkspaceProfile | null>;
  
  // Profile operations
  saveCurrentConfiguration: (profileId: string) => Promise<void>;
  loadProfileConfiguration: (profile: WorkspaceProfile) => void;
  setAsDefault: (profileId: string) => Promise<void>;
  resetToDefaults: () => Promise<void>;
  saveDefaultConfiguration: () => Promise<WorkspaceProfile | null>;
}

const WorkspaceProfileContext = createContext<WorkspaceProfileContextType | undefined>(undefined);

export function WorkspaceProfileProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { workspace } = useWorkspace();
  const { toast } = useToast();
  
  const [profiles, setProfiles] = useState<WorkspaceProfile[]>([]);
  const [currentProfile, setCurrentProfile] = useState<WorkspaceProfile | null>(null);
  const [loading, setLoading] = useState(false);

  // Load profiles when workspace changes
  useEffect(() => {
    if (user && workspace) {
      loadProfiles();
    } else {
      setProfiles([]);
      setCurrentProfile(null);
    }
  }, [user, workspace]);

  const loadProfiles = async () => {
    if (!user || !workspace) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('workspace_profiles')
        .select('*')
        .eq('user_id', user.id)
        .eq('workspace_id', workspace.id)
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error loading workspace profiles:', error);
        return;
      }

      if (data && data.length > 0) {
        setProfiles(data as WorkspaceProfile[]);
        // Set current profile to default or first profile
        const defaultProfile = data.find(p => p.is_default) || data[0];
        setCurrentProfile(defaultProfile as WorkspaceProfile);
        loadProfileConfiguration(defaultProfile as WorkspaceProfile);
      } else {
        // Create default profile for new workspace
        await createDefaultProfile();
      }
    } catch (error) {
      console.error('Error loading profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  const createDefaultProfile = async () => {
    if (!user || !workspace) return;

    const defaultProfile = {
      user_id: user.id,
      workspace_id: workspace.id,
      name: 'Default Profile',
      category: 'default' as const,
      is_default: true,
    };

    const created = await createProfile(defaultProfile.name, defaultProfile.category);
    if (created) {
      await setAsDefault(created.id);
    }
  };

  const createProfile = async (name: string, category: WorkspaceProfile['category']): Promise<WorkspaceProfile | null> => {
    if (!user || !workspace) return null;

    try {
      const { data, error } = await supabase
        .from('workspace_profiles')
        .insert({
          user_id: user.id,
          workspace_id: workspace.id,
          name,
          category,
          is_default: profiles.length === 0, // First profile is default
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating profile:', error);
        toast({
          title: "Error",
          description: "Failed to create workspace profile.",
          variant: "destructive",
        });
        return null;
      }

      setProfiles(prev => [...prev, data as WorkspaceProfile]);
      toast({
        title: "Success",
        description: `Profile "${name}" created successfully.`,
      });
      
      return data as WorkspaceProfile;
    } catch (error) {
      console.error('Error creating profile:', error);
      return null;
    }
  };

  const updateProfile = async (profileId: string, updates: Partial<WorkspaceProfile>) => {
    try {
      const { error } = await supabase
        .from('workspace_profiles')
        .update(updates)
        .eq('id', profileId);

      if (error) {
        console.error('Error updating profile:', error);
        toast({
          title: "Error",
          description: "Failed to update profile.",
          variant: "destructive",
        });
        return;
      }

      setProfiles(prev => prev.map(p => p.id === profileId ? { ...p, ...updates } : p));
      
      if (currentProfile?.id === profileId) {
        setCurrentProfile(prev => prev ? { ...prev, ...updates } : null);
      }
      
      toast({
        title: "Success",
        description: "Profile updated successfully.",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const deleteProfile = async (profileId: string) => {
    if (profiles.length <= 1) {
      toast({
        title: "Error",
        description: "Cannot delete the last profile.",
        variant: "destructive",
      });
      return;
    }

    const profileToDelete = profiles.find(p => p.id === profileId);
    if (!profileToDelete) return;

    try {
      const { error } = await supabase
        .from('workspace_profiles')
        .delete()
        .eq('id', profileId);

      if (error) {
        console.error('Error deleting profile:', error);
        toast({
          title: "Error",
          description: "Failed to delete profile.",
          variant: "destructive",
        });
        return;
      }

      setProfiles(prev => prev.filter(p => p.id !== profileId));
      
      // If deleted profile was current, switch to another
      if (currentProfile?.id === profileId) {
        const remainingProfiles = profiles.filter(p => p.id !== profileId);
        const newCurrent = remainingProfiles.find(p => p.is_default) || remainingProfiles[0];
        if (newCurrent) {
          setCurrentProfile(newCurrent);
          loadProfileConfiguration(newCurrent);
        }
      }
      
      toast({
        title: "Success",
        description: `Profile "${profileToDelete.name}" deleted successfully.`,
      });
    } catch (error) {
      console.error('Error deleting profile:', error);
    }
  };

  const switchToProfile = async (profileId: string) => {
    const profile = profiles.find(p => p.id === profileId);
    if (!profile) return;

    setCurrentProfile(profile);
    loadProfileConfiguration(profile);
    
    toast({
      title: "Switched Profile",
      description: `Now using "${profile.name}" profile.`,
    });
  };

  const duplicateProfile = async (profileId: string, newName: string): Promise<WorkspaceProfile | null> => {
    const sourceProfile = profiles.find(p => p.id === profileId);
    if (!sourceProfile || !user || !workspace) return null;

    try {
      const { id, created_at, updated_at, ...profileData } = sourceProfile;
      
      const { data, error } = await supabase
        .from('workspace_profiles')
        .insert({
          ...profileData,
          name: newName,
          is_default: false, // Duplicated profiles are never default
        })
        .select()
        .single();

      if (error) {
        console.error('Error duplicating profile:', error);
        toast({
          title: "Error",
          description: "Failed to duplicate profile.",
          variant: "destructive",
        });
        return null;
      }

      setProfiles(prev => [...prev, data as WorkspaceProfile]);
      toast({
        title: "Success",
        description: `Profile duplicated as "${newName}".`,
      });
      
      return data as WorkspaceProfile;
    } catch (error) {
      console.error('Error duplicating profile:', error);
      return null;
    }
  };

  const setAsDefault = async (profileId: string) => {
    try {
      // First, remove default from all profiles
      await supabase
        .from('workspace_profiles')
        .update({ is_default: false })
        .eq('user_id', user?.id)
        .eq('workspace_id', workspace?.id);

      // Then set the new default
      await supabase
        .from('workspace_profiles')
        .update({ is_default: true })
        .eq('id', profileId);

      setProfiles(prev => prev.map(p => ({
        ...p,
        is_default: p.id === profileId
      })));
      
      toast({
        title: "Success",
        description: "Default profile updated.",
      });
    } catch (error) {
      console.error('Error setting default profile:', error);
    }
  };

  const saveCurrentConfiguration = async (profileId: string) => {
    if (!user || !workspace) return;

    try {
      // Get current settings from localStorage (where contexts save their state)
      const currentConfig = {
        // Dashboard Layout Settings
        dashboard_layout: JSON.parse(localStorage.getItem('dashboard-settings') || '{}'),
        
        // UI Settings  
        custom_header_title: localStorage.getItem('custom-header-title') || 'Premium Dashboard',
        custom_sidebar_title: localStorage.getItem('custom-sidebar-title') || 'Premium Dashboard',
        show_header_title: localStorage.getItem('show-header-title') === 'true',
        show_sidebar_crown: localStorage.getItem('show-sidebar-crown') !== 'false',
        
        // Navigation Settings
        top_navigation_widgets: JSON.parse(localStorage.getItem('top-navigation-widgets') || '[]'),
        user_navigation_order: JSON.parse(localStorage.getItem('user-navigation-order') || '["Profile", "UserSettings", "NotificationButton"]'),
        minimal_navigation_mode: localStorage.getItem('minimal-navigation-mode') === 'true',
        sidebar_solid: localStorage.getItem('sidebar-solid') === 'true',
        sidebar_collapsed: localStorage.getItem('sidebar-collapsed') === 'true',
        
        // Appearance Settings
        gradient_mode: localStorage.getItem('gradient-mode') || 'full',
        hide_dividers: localStorage.getItem('hide-dividers') === 'true',
        
        // Clock Settings
        use_24_hour_format: localStorage.getItem('use-24-hour-format') === 'true',
        show_year: localStorage.getItem('show-year') !== 'false',
        show_date: localStorage.getItem('show-date') !== 'false', 
        show_seconds: localStorage.getItem('show-seconds') !== 'false',
        clock_position: localStorage.getItem('clock-position') || 'left',
        
        // Other Settings
        edit_mode: localStorage.getItem('edit-mode') === 'true',
        quick_note: localStorage.getItem('quick-note') || '',
        
        // Banner and Background
        banner_image: localStorage.getItem('banner-image') || '',
        show_banner: localStorage.getItem('show-banner') === 'true',
        banner_height: parseInt(localStorage.getItem('banner-height') || '192'),
        dashboard_background: localStorage.getItem('dashboard-background') || 'bg-gradient-to-br from-background to-muted/20',
        grid_size: localStorage.getItem('grid-size') || '4x4',
      };

      await updateProfile(profileId, currentConfig);
      
      toast({
        title: "Configuration Saved",
        description: "Current dashboard configuration has been saved to this profile.",
      });
    } catch (error) {
      console.error('Error saving current configuration:', error);
      toast({
        title: "Error",
        description: "Failed to save current configuration.",
        variant: "destructive",
      });
    }
  };

  const loadProfileConfiguration = (profile: WorkspaceProfile) => {
    try {
      console.log('Loading profile configuration:', profile.name);
      
      // Apply settings to localStorage (where contexts read from)
      localStorage.setItem('dashboard-settings', JSON.stringify(profile.dashboard_layout || {}));
      localStorage.setItem('grid-size', profile.grid_size || '4x4');
      localStorage.setItem('banner-image', profile.banner_image || '');
      localStorage.setItem('show-banner', profile.show_banner ? 'true' : 'false');
      localStorage.setItem('banner-height', profile.banner_height?.toString() || '192');
      localStorage.setItem('dashboard-background', profile.dashboard_background || 'bg-gradient-to-br from-background to-muted/20');
      
      // UI Settings
      localStorage.setItem('custom-header-title', profile.custom_header_title || 'Premium Dashboard');
      localStorage.setItem('custom-sidebar-title', profile.custom_sidebar_title || 'Premium Dashboard');
      localStorage.setItem('show-header-title', profile.show_header_title ? 'true' : 'false');
      localStorage.setItem('show-sidebar-crown', profile.show_sidebar_crown ? 'true' : 'false');
      
      // Navigation Settings
      localStorage.setItem('top-navigation-widgets', JSON.stringify(profile.top_navigation_widgets || []));
      localStorage.setItem('user-navigation-order', JSON.stringify(profile.user_navigation_order || ['Profile', 'UserSettings', 'NotificationButton']));
      localStorage.setItem('minimal-navigation-mode', profile.minimal_navigation_mode ? 'true' : 'false');
      localStorage.setItem('sidebar-solid', profile.sidebar_solid ? 'true' : 'false');
      localStorage.setItem('sidebar-collapsed', profile.sidebar_collapsed ? 'true' : 'false');
      
      // Appearance Settings
      localStorage.setItem('gradient-mode', profile.gradient_mode || 'full');
      localStorage.setItem('hide-dividers', profile.hide_dividers ? 'true' : 'false');
      
      // Clock Settings
      localStorage.setItem('use-24-hour-format', profile.use_24_hour_format ? 'true' : 'false');
      localStorage.setItem('show-year', profile.show_year ? 'true' : 'false');
      localStorage.setItem('show-date', profile.show_date ? 'true' : 'false');
      localStorage.setItem('show-seconds', profile.show_seconds ? 'true' : 'false');
      localStorage.setItem('clock-position', profile.clock_position || 'left');
      
      // Other Settings
      localStorage.setItem('edit-mode', profile.edit_mode ? 'true' : 'false');
      localStorage.setItem('quick-note', profile.quick_note || '');
      
      // Trigger a page reload to ensure all contexts pick up the new settings
      window.location.reload();
      
    } catch (error) {
      console.error('Error loading profile configuration:', error);
      toast({
        title: "Error",
        description: "Failed to load profile configuration.",
        variant: "destructive",
      });
    }
  };

  const getDefaultConfiguration = () => {
    return {
      // Dashboard Layout Settings
      dashboard_layout: {},
      grid_size: '4x4',
      banner_image: '',
      show_banner: false,
      banner_height: 192,
      dashboard_background: 'bg-gradient-to-br from-background to-muted/20',
      
      // UI Settings
      custom_header_title: 'Premium Dashboard',
      custom_sidebar_title: 'Premium Dashboard',
      show_header_title: true,
      show_sidebar_crown: true,
      
      // Navigation Settings
      top_navigation_widgets: [],
      user_navigation_order: ['Profile', 'UserSettings', 'NotificationButton'],
      minimal_navigation_mode: false,
      sidebar_solid: false,
      sidebar_collapsed: false,
      
      // Appearance Settings
      gradient_mode: 'full',
      hide_dividers: false,
      
      // Clock Settings
      use_24_hour_format: false,
      show_year: true,
      show_date: true,
      show_seconds: true,
      clock_position: 'left',
      
      // Other Settings
      edit_mode: false,
      quick_note: '',
    };
  };

  const resetToDefaults = async () => {
    if (!currentProfile) return;

    const defaultConfig = getDefaultConfiguration();
    
    try {
      await updateProfile(currentProfile.id, defaultConfig);
      
      // Apply the defaults immediately
      loadProfileConfiguration({ ...currentProfile, ...defaultConfig });
      
      toast({
        title: "Reset Complete",
        description: "Dashboard has been reset to default configuration.",
      });
    } catch (error) {
      console.error('Error resetting to defaults:', error);
      toast({
        title: "Error",
        description: "Failed to reset to defaults.",
        variant: "destructive",
      });
    }
  };

  const saveDefaultConfiguration = async (): Promise<WorkspaceProfile | null> => {
    if (!user || !workspace) return null;

    const defaultConfig = getDefaultConfiguration();
    
    try {
      const { data, error } = await supabase
        .from('workspace_profiles')
        .insert({
          user_id: user.id,
          workspace_id: workspace.id,
          name: 'Clean Slate',
          category: 'default',
          is_default: false,
          ...defaultConfig,
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving default configuration:', error);
        toast({
          title: "Error",
          description: "Failed to save default configuration.",
          variant: "destructive",
        });
        return null;
      }

      setProfiles(prev => [...prev, data as WorkspaceProfile]);
      toast({
        title: "Success",
        description: "Default configuration saved as 'Clean Slate' profile.",
      });
      
      return data as WorkspaceProfile;
    } catch (error) {
      console.error('Error saving default configuration:', error);
      return null;
    }
  };

  const value: WorkspaceProfileContextType = {
    profiles,
    currentProfile,
    loading,
    createProfile,
    updateProfile,
    deleteProfile,
    switchToProfile,
    duplicateProfile,
    saveCurrentConfiguration,
    loadProfileConfiguration,
    setAsDefault,
    resetToDefaults,
    saveDefaultConfiguration,
  };

  return (
    <WorkspaceProfileContext.Provider value={value}>
      {children}
    </WorkspaceProfileContext.Provider>
  );
}

export function useWorkspaceProfile() {
  const context = useContext(WorkspaceProfileContext);
  if (context === undefined) {
    throw new Error('useWorkspaceProfile must be used within a WorkspaceProfileProvider');
  }
  return context;
}
