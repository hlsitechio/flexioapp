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
    // This will be implemented to gather current settings from all contexts
    // and save them to the profile
    console.log('Saving current configuration to profile:', profileId);
    // TODO: Implement gathering current state from all contexts
  };

  const loadProfileConfiguration = (profile: WorkspaceProfile) => {
    // This will be implemented to apply profile settings to all contexts
    console.log('Loading profile configuration:', profile.name);
    // TODO: Implement applying profile settings to all contexts
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
