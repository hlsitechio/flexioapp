import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function WorkspaceHashNavigator() {
  const location = useLocation();

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      
      // Normalize workspace-related hashes without full reload
      if (hash === '#workspace' || hash.startsWith('#workspace-')) {
        history.replaceState(null, '', window.location.pathname + window.location.search);
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

  // Also handle direct navigation to hash URLs without reload
  useEffect(() => {
    const hash = window.location.hash;
    if (hash === '#workspace' || hash.startsWith('#workspace-')) {
      // Remove hash to avoid full reloads and keep SPA navigation
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  }, []);

  return null;
}