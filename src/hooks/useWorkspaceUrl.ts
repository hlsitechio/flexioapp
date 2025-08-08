
import { useSafeWorkspace } from '@/hooks/useSafeWorkspace';
import { useWorkspaceProfile } from '@/contexts/WorkspaceProfileContext';

export function useWorkspaceUrl() {
  const { workspace, getWorkspaceNumber, userRole } = useSafeWorkspace();
  
  // Safely access workspace profile context if available
  let currentProfile: any = null;
  try {
    const profileCtx = useWorkspaceProfile();
    currentProfile = profileCtx.currentProfile;
  } catch {
    currentProfile = null;
  }

  const getWorkspaceInfo = () => {
    if (!workspace || !currentProfile) return null;

    // Get workspace number based on workspace creation order
    const workspaceNumber = getWorkspaceNumber(workspace.id);
    const profileName = currentProfile.name || 'Default';
    const cleanProfileName = profileName.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '');
    
    return {
      workspaceId: workspace.id,
      workspaceNumber: workspaceNumber.toString().padStart(5, '0'),
      profileName: cleanProfileName,
      userRole,
      urlSegment: `WRK_${workspaceNumber.toString().padStart(5, '0')}-${cleanProfileName}-${userRole}`
    };
  };

  const buildWorkspaceUrl = (path: string = '') => {
    const workspaceInfo = getWorkspaceInfo();
    if (!workspaceInfo) return path || '/';
    const safePath = path ? (path.startsWith('/') ? path : `/${path}`) : '';
    return `/workspace/${workspaceInfo.urlSegment}${safePath}`;
  };

  return {
    getWorkspaceInfo,
    buildWorkspaceUrl,
    currentWorkspace: workspace,
    currentProfile,
    userRole
  };
}
