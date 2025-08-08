-- Fix: Correct RLS policy syntax for INSERT policies

-- security_events INSERT restricted to service role
DROP POLICY IF EXISTS "Service role can insert security events" ON public.security_events;
DROP POLICY IF EXISTS "System can insert security events" ON public.security_events;
CREATE POLICY "Service role can insert security events"
ON public.security_events
FOR INSERT
TO public
WITH CHECK (auth.role() = 'service_role');

-- security_alerts INSERT restricted to service role
DROP POLICY IF EXISTS "Service role can insert security alerts" ON public.security_alerts;
DROP POLICY IF EXISTS "Anyone can insert security alerts" ON public.security_alerts;
CREATE POLICY "Service role can insert security alerts"
ON public.security_alerts
FOR INSERT
TO public
WITH CHECK (auth.role() = 'service_role');

-- csp_violations INSERT restricted to service role
DROP POLICY IF EXISTS "Service role can insert CSP violations" ON public.csp_violations;
DROP POLICY IF EXISTS "Anyone can insert CSP violations" ON public.csp_violations;
CREATE POLICY "Service role can insert CSP violations"
ON public.csp_violations
FOR INSERT
TO public
WITH CHECK (auth.role() = 'service_role');

-- admin_audit_log INSERT restricted to service role
DROP POLICY IF EXISTS "Service role can insert admin audit logs" ON public.admin_audit_log;
DROP POLICY IF EXISTS "System can insert audit logs" ON public.admin_audit_log;
CREATE POLICY "Service role can insert admin audit logs"
ON public.admin_audit_log
FOR INSERT
TO public
WITH CHECK (auth.role() = 'service_role');
