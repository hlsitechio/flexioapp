import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useSecurityLogger() {
  const logAdminAction = useCallback(async (
    action: string,
    targetResource?: string,
    targetId?: string,
    metadata?: Record<string, any>
  ) => {
    try {
      await supabase.rpc('log_admin_action', {
        _action: action,
        _target_resource: targetResource || null,
        _target_id: targetId || null,
        _metadata: metadata || {}
      });
    } catch (error) {
      console.error('Failed to log admin action:', error);
    }
  }, []);

  const logSecurityEvent = useCallback(async (
    eventType: string,
    severity: 'low' | 'medium' | 'high' | 'critical' = 'medium',
    metadata?: Record<string, any>
  ) => {
    try {
      await supabase.functions.invoke('security-report', {
        body: {
          type: eventType,
          severity,
          metadata: metadata || {},
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  }, []);

  const trackFailedLogin = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase.rpc('track_failed_login', {
        _user_id: userId,
        _ip_address: null // Could be enhanced to get real IP
      });
      
      if (error) throw error;
      return data; // Returns boolean indicating if account is now locked
    } catch (error) {
      console.error('Failed to track failed login:', error);
      return false;
    }
  }, []);

  const resetFailedAttempts = useCallback(async (userId: string) => {
    try {
      await supabase.rpc('reset_failed_login_attempts', {
        _user_id: userId
      });
    } catch (error) {
      console.error('Failed to reset failed login attempts:', error);
    }
  }, []);

  const checkAccountLockout = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase.rpc('is_account_locked', {
        _user_id: userId
      });
      
      if (error) throw error;
      return data; // Returns boolean indicating if account is locked
    } catch (error) {
      console.error('Failed to check account lockout:', error);
      return false;
    }
  }, []);

  return {
    logAdminAction,
    logSecurityEvent,
    trackFailedLogin,
    resetFailedAttempts,
    checkAccountLockout
  };
}