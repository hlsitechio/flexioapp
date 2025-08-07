
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { useWorkspaceProfile } from '@/contexts/WorkspaceProfileContext';

export function WorkspaceUrlManager() {
  const { workspace, getWorkspaceNumber, userRole } = useWorkspace();
  const { currentProfile, profiles } = useWorkspaceProfile();
  const navigate = useNavigate();
  const location = useLocation();

  const getWorkspaceUrlSegment = () => {
    if (!workspace || !currentProfile) return null;

    // Get actual workspace number based on creation order
    const workspaceNumber = getWorkspaceNumber(workspace.id);
    const profileName = currentProfile.name.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '');
    
    // Include user role in the URL format
    return `WRK_${workspaceNumber.toString().padStart(5, '0')}-${profileName}-${userRole}`;
  };

  // Handle URL redirects when workspace/profile changes
  useEffect(() => {
    if (!workspace || !currentProfile) return;

    const urlSegment = getWorkspaceUrlSegment();
    if (!urlSegment) return;

    const currentPath = location.pathname;
    
    // If on root path, redirect to workspace URL
    if (currentPath === '/') {
      navigate(`/workspace/${urlSegment}`, { replace: true });
      return;
    }

    // If on workspace-selection, auto-forward to workspace dashboard
    if (currentPath === '/workspace-selection') {
      navigate(`/workspace/${urlSegment}`, { replace: true });
      return;
    }

    // If on old format URLs, redirect to new format
    const oldRoutes = ['/profile', '/components', '/settings', '/customization', '/prompts-gallery', '/code-snippets', '/workspace-profiles', '/admin'];
    const matchedOldRoute = oldRoutes.find(route => currentPath.startsWith(route));
    
    if (matchedOldRoute) {
      const newPath = `/workspace/${urlSegment}${matchedOldRoute}`;
      navigate(newPath, { replace: true });
    }
  }, [workspace, currentProfile, userRole, location.pathname, navigate]);

  // Update URL when profile or role changes
  useEffect(() => {
    if (!workspace || !currentProfile) return;

    const urlSegment = getWorkspaceUrlSegment();
    if (!urlSegment) return;

    const currentPath = location.pathname;
    
    // If already in a workspace URL, update it with new profile/role
    const workspaceMatch = currentPath.match(/^\/workspace\/WRK_\d{5}-[^\/]+(\/.*)?$/);
    if (workspaceMatch) {
      const subPath = workspaceMatch[1] || '';
      const newPath = `/workspace/${urlSegment}${subPath}`;
      if (currentPath !== newPath) {
        navigate(newPath, { replace: true });
      }
    }
  }, [currentProfile?.id, userRole, navigate, location.pathname]);

  return null;
}
