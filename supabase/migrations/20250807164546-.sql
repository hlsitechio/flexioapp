-- Security Enhancement Phase 1 & 2: Authentication Hardening and Admin Access Security

-- Create admin audit log table
CREATE TABLE public.admin_audit_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  target_resource TEXT,
  target_id UUID,
  ip_address INET,
  user_agent TEXT,
  metadata JSONB DEFAULT '{}',
  severity TEXT CHECK (severity IN ('low', 'medium', 'high', 'critical')) DEFAULT 'medium',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on admin audit log
ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Admins can view audit logs" 
ON public.admin_audit_log 
FOR SELECT 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- System can insert audit logs (security definer function will handle this)
CREATE POLICY "System can insert audit logs" 
ON public.admin_audit_log 
FOR INSERT 
WITH CHECK (true);

-- Create account lockout tracking table
CREATE TABLE public.account_lockouts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  failed_attempts INTEGER NOT NULL DEFAULT 0,
  locked_until TIMESTAMP WITH TIME ZONE,
  ip_address INET,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on account lockouts
ALTER TABLE public.account_lockouts ENABLE ROW LEVEL SECURITY;

-- Users can view their own lockout status
CREATE POLICY "Users can view own lockout status" 
ON public.account_lockouts 
FOR SELECT 
TO authenticated
USING (user_id = auth.uid());

-- System can manage lockouts
CREATE POLICY "System can manage lockouts" 
ON public.account_lockouts 
FOR ALL 
WITH CHECK (true);

-- Create security events table for monitoring
CREATE TABLE public.security_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ip_address INET,
  user_agent TEXT,
  severity TEXT CHECK (severity IN ('low', 'medium', 'high', 'critical')) DEFAULT 'medium',
  metadata JSONB DEFAULT '{}',
  resolved BOOLEAN DEFAULT false,
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on security events
ALTER TABLE public.security_events ENABLE ROW LEVEL SECURITY;

-- Admins can view all security events
CREATE POLICY "Admins can view security events" 
ON public.security_events 
FOR SELECT 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can update security events (mark as resolved)
CREATE POLICY "Admins can update security events" 
ON public.security_events 
FOR UPDATE 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- System can insert security events
CREATE POLICY "System can insert security events" 
ON public.security_events 
FOR INSERT 
WITH CHECK (true);

-- Create function to log admin actions
CREATE OR REPLACE FUNCTION public.log_admin_action(
  _action TEXT,
  _target_resource TEXT DEFAULT NULL,
  _target_id UUID DEFAULT NULL,
  _metadata JSONB DEFAULT '{}'
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Only log if user is authenticated and is admin
  IF auth.uid() IS NOT NULL AND public.has_role(auth.uid(), 'admin') THEN
    INSERT INTO public.admin_audit_log (
      admin_user_id,
      action,
      target_resource,
      target_id,
      metadata,
      severity
    ) VALUES (
      auth.uid(),
      _action,
      _target_resource,
      _target_id,
      _metadata,
      CASE 
        WHEN _action ILIKE '%delete%' OR _action ILIKE '%remove%' THEN 'high'
        WHEN _action ILIKE '%create%' OR _action ILIKE '%add%' THEN 'medium'
        ELSE 'low'
      END
    );
  END IF;
END;
$$;

-- Create function to track failed login attempts
CREATE OR REPLACE FUNCTION public.track_failed_login(
  _user_id UUID,
  _ip_address INET DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  lockout_record RECORD;
  max_attempts INTEGER := 5;
  lockout_duration INTERVAL := '15 minutes';
BEGIN
  -- Get or create lockout record
  SELECT * INTO lockout_record 
  FROM public.account_lockouts 
  WHERE user_id = _user_id;
  
  IF lockout_record IS NULL THEN
    -- Create new lockout record
    INSERT INTO public.account_lockouts (user_id, failed_attempts, ip_address)
    VALUES (_user_id, 1, _ip_address);
    RETURN false; -- Not locked yet
  ELSE
    -- Check if currently locked
    IF lockout_record.locked_until IS NOT NULL AND lockout_record.locked_until > now() THEN
      RETURN true; -- Still locked
    END IF;
    
    -- Increment failed attempts
    UPDATE public.account_lockouts 
    SET 
      failed_attempts = failed_attempts + 1,
      updated_at = now(),
      locked_until = CASE 
        WHEN failed_attempts + 1 >= max_attempts THEN now() + lockout_duration
        ELSE NULL
      END
    WHERE user_id = _user_id;
    
    -- Log security event if account gets locked
    IF lockout_record.failed_attempts + 1 >= max_attempts THEN
      INSERT INTO public.security_events (
        event_type,
        user_id,
        ip_address,
        severity,
        metadata
      ) VALUES (
        'account_locked',
        _user_id,
        _ip_address,
        'high',
        jsonb_build_object('failed_attempts', lockout_record.failed_attempts + 1)
      );
      RETURN true; -- Now locked
    END IF;
    
    RETURN false; -- Not locked yet
  END IF;
END;
$$;

-- Create function to reset failed login attempts on successful login
CREATE OR REPLACE FUNCTION public.reset_failed_login_attempts(_user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  UPDATE public.account_lockouts 
  SET 
    failed_attempts = 0,
    locked_until = NULL,
    updated_at = now()
  WHERE user_id = _user_id;
END;
$$;

-- Create function to check if account is locked
CREATE OR REPLACE FUNCTION public.is_account_locked(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  lockout_record RECORD;
BEGIN
  SELECT * INTO lockout_record 
  FROM public.account_lockouts 
  WHERE user_id = _user_id;
  
  IF lockout_record IS NULL THEN
    RETURN false;
  END IF;
  
  RETURN lockout_record.locked_until IS NOT NULL AND lockout_record.locked_until > now();
END;
$$;

-- Add indexes for performance
CREATE INDEX idx_admin_audit_log_admin_user_id ON public.admin_audit_log(admin_user_id);
CREATE INDEX idx_admin_audit_log_created_at ON public.admin_audit_log(created_at DESC);
CREATE INDEX idx_admin_audit_log_severity ON public.admin_audit_log(severity);
CREATE INDEX idx_account_lockouts_user_id ON public.account_lockouts(user_id);
CREATE INDEX idx_security_events_user_id ON public.security_events(user_id);
CREATE INDEX idx_security_events_created_at ON public.security_events(created_at DESC);
CREATE INDEX idx_security_events_severity ON public.security_events(severity);
CREATE INDEX idx_security_events_resolved ON public.security_events(resolved);

-- Add trigger for updated_at on account_lockouts
CREATE TRIGGER update_account_lockouts_updated_at
BEFORE UPDATE ON public.account_lockouts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();