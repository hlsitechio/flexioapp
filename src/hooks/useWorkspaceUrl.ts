import { useWorkspace } from '@/contexts/WorkspaceContext';
import { useWorkspaceProfile } from '@/contexts/WorkspaceProfileContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

export function useWorkspaceUrl() {
  const { workspace } = useWorkspace();
  const { currentProfile, profiles } = useWorkspaceProfile();
  const navigate = useNavigate();
  const location = useLocation();

  const getWorkspaceInfo = () => {
    if (!workspace || !currentProfile) return null;

    // Generate workspace number based on workspace creation order
    const workspaceNumber = 1; // This would be calculated from all user workspaces
    const profileName = currentProfile.name || 'Default';
    
    return {
      workspaceId: workspace.id,
      workspaceNumber: workspaceNumber.toString().padStart(5, '0'),
      profileName: profileName.replace(/\s+/g, '-'),
      urlSegment: `WRK_${workspaceNumber.toString().padStart(5, '0')}-${profileName.replace(/\s+/g, '-')}`
    };
  };

  const buildWorkspaceUrl = (path: string = '') => {
    const workspaceInfo = getWorkspaceInfo();
    if (!workspaceInfo) return path;
    
    return `/workspace/${workspaceInfo.urlSegment}${path}`;
  };

  // Auto-redirect to correct URL format when workspace/profile changes
  useEffect(() => {
    if (workspace && currentProfile && location.pathname === '/') {
      const workspaceInfo = getWorkspaceInfo();
      if (workspaceInfo) {
        navigate(buildWorkspaceUrl(), { replace: true });
      }
    }
  }, [workspace, currentProfile, location.pathname]);

  return {
    getWorkspaceInfo,
    buildWorkspaceUrl,
    currentWorkspace: workspace,
    currentProfile
  };
}