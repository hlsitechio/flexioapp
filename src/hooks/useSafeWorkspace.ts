import { useWorkspace } from '@/contexts/WorkspaceContext';

/**
 * Safe wrapper for useWorkspace that returns defaults when provider is not available
 * This prevents the "must be used within provider" error on public pages
 */
export function useSafeWorkspace() {
  try {
    return useWorkspace();
  } catch (error) {
    // Provider not available, return safe defaults
    return {
      workspace: null,
      workspaces: [],
      userRole: 'free' as const,
      loading: false,
      createWorkspace: async () => null,
      selectWorkspace: async () => {},
      getWorkspaceNumber: () => 0,
      getUserRole: async () => 'free' as const,
      reloadWorkspaces: async () => {}
    };
  }
}