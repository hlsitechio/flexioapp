-- Tighten RLS and add helper function for login lockout

-- 1) Create helper to fetch user id by email (SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.get_user_id_by_email(_email text)
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO ''
AS $$
  SELECT id
  FROM auth.users
  WHERE lower(email) = lower(_email)
  LIMIT 1;
$$;

-- 2) Restrict inserts to service role only for sensitive tables
-- security_events
DROP POLICY IF EXISTS "System can insert security events" ON public.security_events;
CREATE POLICY "Service role can insert security events"
ON public.security_events
FOR INSERT
TO public
WITH CHECK (auth.role() = 'service_role')
USING (auth.role() = 'service_role');

-- security_alerts
DROP POLICY IF EXISTS "Anyone can insert security alerts" ON public.security_alerts;
CREATE POLICY "Service role can insert security alerts"
ON public.security_alerts
FOR INSERT
TO public
WITH CHECK (auth.role() = 'service_role')
USING (auth.role() = 'service_role');

-- csp_violations
DROP POLICY IF EXISTS "Anyone can insert CSP violations" ON public.csp_violations;
CREATE POLICY "Service role can insert CSP violations"
ON public.csp_violations
FOR INSERT
TO public
WITH CHECK (auth.role() = 'service_role')
USING (auth.role() = 'service_role');

-- admin_audit_log
DROP POLICY IF EXISTS "System can insert audit logs" ON public.admin_audit_log;
CREATE POLICY "Service role can insert admin audit logs"
ON public.admin_audit_log
FOR INSERT
TO public
WITH CHECK (auth.role() = 'service_role')
USING (auth.role() = 'service_role');

-- 3) Storage policies for 'banners' bucket to scope writes to owners
-- Public read
CREATE POLICY IF NOT EXISTS "Public can read banners"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'banners');

-- Authenticated users manage only their folder or admins
CREATE POLICY IF NOT EXISTS "Users manage own banners"
ON storage.objects
FOR ALL
TO authenticated
USING (
  bucket_id = 'banners'
  AND (
    auth.uid()::text = (storage.foldername(name))[1]
    OR public.has_role(auth.uid(), 'admin')
  )
)
WITH CHECK (
  bucket_id = 'banners'
  AND (
    auth.uid()::text = (storage.foldername(name))[1]
    OR public.has_role(auth.uid(), 'admin')
  )
);
