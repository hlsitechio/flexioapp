import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function WorkspaceHashNavigator() {
  const location = useLocation();

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      
      // Force full page reload when navigating to workspace-related hashes
      if (hash === '#workspace' || hash.startsWith('#workspace-')) {
        window.location.reload();
      }
    };

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    
    // Check initial hash on mount
    handleHashChange();

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [location]);

  // Also handle direct navigation to hash URLs
  useEffect(() => {
    const hash = window.location.hash;
    if (hash === '#workspace' || hash.startsWith('#workspace-')) {
      // Small delay to ensure the page is fully loaded before reload
      setTimeout(() => {
        window.location.reload();
      }, 100);
    }
  }, []);

  return null;
}