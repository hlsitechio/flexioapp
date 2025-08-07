import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSafeAuth } from '@/hooks/useSafeAuth';

interface SessionData {
  user_agent?: string;
  screen_resolution?: string;
  current_route?: string;
  dashboard_state?: any;
  is_active?: boolean;
}

export function useSessionTracking(enabled: boolean = true, workspace?: any) {
  const { user } = useSafeAuth();
  const sessionIdRef = useRef<string>(crypto.randomUUID());
  const lastUpdateRef = useRef<number>(0);

  useEffect(() => {
    if (!user || !enabled) return;

    const updateSession = async (data: Partial<SessionData> = {}) => {
      const now = Date.now();
      // Rate limit updates to every 30 seconds
      if (now - lastUpdateRef.current < 30000 && Object.keys(data).length === 0) {
        return;
      }
      lastUpdateRef.current = now;

      try {
        const sessionData = {
          user_id: user.id,
          session_id: sessionIdRef.current,
          workspace_id: workspace?.id,
          last_activity: new Date().toISOString(),
          user_agent: navigator.userAgent,
          screen_resolution: `${screen.width}x${screen.height}`,
          device_info: {
            platform: navigator.platform,
            language: navigator.language,
            cookieEnabled: navigator.cookieEnabled,
            onLine: navigator.onLine
          },
          browser_info: {
            userAgent: navigator.userAgent,
            vendor: (navigator as any).vendor || '',
            appVersion: navigator.appVersion
          },
          current_route: window.location.pathname,
          is_active: true,
          ...data
        };

        // Upsert session data using the correct syntax
        const { error } = await supabase
          .from('active_sessions')
          .upsert(sessionData, { 
            onConflict: 'session_id'
          });

        if (error) {
          console.error('Error updating session:', error);
        }
      } catch (error) {
        console.error('Error in session tracking:', error);
      }
    };

    // Initial session creation
    updateSession();

    // Update session on route changes
    const handleRouteChange = () => {
      updateSession({
        current_route: window.location.pathname
      });
    };

    // Update session on visibility change
    const handleVisibilityChange = () => {
      updateSession({
        is_active: !document.hidden
      });
    };

    // Update session on focus/blur
    const handleFocus = () => updateSession({ is_active: true });
    const handleBlur = () => updateSession({ is_active: false });

    // Periodic heartbeat
    const heartbeatInterval = setInterval(() => {
      if (!document.hidden) {
        updateSession();
      }
    }, 60000); // Every minute

    // Event listeners
    window.addEventListener('popstate', handleRouteChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);

    // Cleanup on unmount
    const cleanup = () => {
      clearInterval(heartbeatInterval);
      window.removeEventListener('popstate', handleRouteChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
      
      // Mark session as inactive
      updateSession({ is_active: false });
    };

    window.addEventListener('beforeunload', cleanup);

    return cleanup;
  }, [user, workspace]);

  // Function to update dashboard state
  const updateDashboardState = async (dashboardState: any) => {
    if (!user) return;

    try {
      await supabase
        .from('active_sessions')
        .update({ 
          dashboard_state: dashboardState,
          last_activity: new Date().toISOString()
        })
        .eq('session_id', sessionIdRef.current);
    } catch (error) {
      console.error('Error updating dashboard state:', error);
    }
  };

  return {
    sessionId: sessionIdRef.current,
    updateDashboardState
  };
}