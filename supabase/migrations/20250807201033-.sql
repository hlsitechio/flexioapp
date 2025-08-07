-- Create CSP violations and security alerts tables with RLS

-- csp_violations table
CREATE TABLE IF NOT EXISTS public.csp_violations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_uri text,
  referrer text,
  blocked_uri text,
  violated_directive text,
  effective_directive text,
  original_policy text,
  disposition text,
  status_code integer,
  timestamp timestamptz,
  user_agent text,
  ip_address inet,
  created_at timestamptz NOT NULL DEFAULT now(),
  reported_at timestamptz
);

ALTER TABLE public.csp_violations ENABLE ROW LEVEL SECURITY;

-- Allow inserts from any user (edge function may use anon token)
CREATE POLICY "Anyone can insert CSP violations"
ON public.csp_violations
FOR INSERT
WITH CHECK (true);

-- Admins can view CSP violations
CREATE POLICY "Admins can view CSP violations"
ON public.csp_violations
FOR SELECT
USING (has_role(auth.uid(), 'admin'));


-- security_alerts table
CREATE TABLE IF NOT EXISTS public.security_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL,
  severity text DEFAULT 'medium',
  message text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  acknowledged boolean DEFAULT false,
  user_id uuid,
  event_id uuid
);

ALTER TABLE public.security_alerts ENABLE ROW LEVEL SECURITY;

-- Allow inserts from any user (edge function may use anon token)
CREATE POLICY "Anyone can insert security alerts"
ON public.security_alerts
FOR INSERT
WITH CHECK (true);

-- Admins can view alerts
CREATE POLICY "Admins can view security alerts"
ON public.security_alerts
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

-- Admins can update alerts (e.g., acknowledge)
CREATE POLICY "Admins can update security alerts"
ON public.security_alerts
FOR UPDATE
USING (has_role(auth.uid(), 'admin'));
