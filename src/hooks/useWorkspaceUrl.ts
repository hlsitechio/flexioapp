
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { useWorkspaceProfile } from '@/contexts/WorkspaceProfileContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

export function useWorkspaceUrl() {
  const { workspace, getWorkspaceNumber, userRole } = useWorkspace();
  const { currentProfile, profiles } = useWorkspaceProfile();
  const navigate = useNavigate();
  const location = useLocation();

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
    if (!workspaceInfo) return path;
    
    return `/workspace/${workspaceInfo.urlSegment}${path}`;
  };


  return {
    getWorkspaceInfo,
    buildWorkspaceUrl,
    currentWorkspace: workspace,
    currentProfile,
    userRole
  };
}
