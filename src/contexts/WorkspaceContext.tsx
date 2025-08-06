import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Workspace {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

interface WorkspaceContextType {
  workspace: Workspace | null;
  workspaces: Workspace[];
  loading: boolean;
  createWorkspace: (name: string) => Promise<Workspace | null>;
  selectWorkspace: (workspaceId: string) => Promise<void>;
  getWorkspaceNumber: (workspaceId: string) => number;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(false);

  // Load or create workspace when user authenticates
  useEffect(() => {
    if (user) {
      initializeUserWorkspace();
    } else {
      setWorkspace(null);
    }
  }, [user]);

  const initializeUserWorkspace = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Check if user has any workspaces
      const { data: workspaces, error } = await supabase
        .from('workspaces')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error loading workspaces:', error);
        return;
      }

      if (workspaces && workspaces.length > 0) {
        setWorkspaces(workspaces);
        // User has workspaces, select the first one
        setWorkspace(workspaces[0]);
      } else {
        // New user - create default workspace
        const newWorkspace = await createWorkspace('My Workspace');
        if (newWorkspace) {
          setWorkspace(newWorkspace);
          toast({
            title: "Welcome!",
            description: "Your workspace has been created successfully.",
          });
        }
      }
    } catch (error) {
      console.error('Error initializing workspace:', error);
    } finally {
      setLoading(false);
    }
  };

  const createWorkspace = async (name: string): Promise<Workspace | null> => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('workspaces')
        .insert({
          user_id: user.id,
          name: name,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating workspace:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error creating workspace:', error);
      return null;
    }
  };

  const selectWorkspace = async (workspaceId: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('workspaces')
        .select('*')
        .eq('id', workspaceId)
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error selecting workspace:', error);
        return;
      }

      setWorkspace(data);
    } catch (error) {
      console.error('Error selecting workspace:', error);
    }
  };

  const getWorkspaceNumber = (workspaceId: string): number => {
    const sortedWorkspaces = [...workspaces].sort((a, b) => 
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
    const index = sortedWorkspaces.findIndex(w => w.id === workspaceId);
    return index + 1;
  };

  const value: WorkspaceContextType = {
    workspace,
    workspaces,
    loading,
    createWorkspace,
    selectWorkspace,
    getWorkspaceNumber,
  };

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
}