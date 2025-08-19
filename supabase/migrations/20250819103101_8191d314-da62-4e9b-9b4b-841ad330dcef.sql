-- Comprehensive security fixes for sensitive data tables

-- 1. Add proper RLS policies for demo_requests table
CREATE POLICY "Admins can delete demo requests" 
ON public.demo_requests 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Sales team can update demo requests" 
ON public.demo_requests 
FOR UPDATE 
USING (has_role(auth.uid(), 'premium'::app_role) OR has_role(auth.uid(), 'pro'::app_role));

-- 2. Add proper RLS policies for leads table
CREATE POLICY "Admins can view all leads" 
ON public.leads 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update leads" 
ON public.leads 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete leads" 
ON public.leads 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Sales team can view leads" 
ON public.leads 
FOR SELECT 
USING (has_role(auth.uid(), 'premium'::app_role) OR has_role(auth.uid(), 'pro'::app_role));

CREATE POLICY "Sales team can update leads" 
ON public.leads 
FOR UPDATE 
USING (has_role(auth.uid(), 'premium'::app_role) OR has_role(auth.uid(), 'pro'::app_role));

-- 3. Add proper RLS policies for contact_submissions table  
CREATE POLICY "Admins can delete contact submissions" 
ON public.contact_submissions 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- 4. Add proper RLS policies for website_analytics table
CREATE POLICY "Admins can view website analytics" 
ON public.website_analytics 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Analytics team can view website analytics" 
ON public.website_analytics 
FOR SELECT 
USING (has_role(auth.uid(), 'premium'::app_role) OR has_role(auth.uid(), 'pro'::app_role));

-- 5. Enhance security event logging with proper audit trails
CREATE OR REPLACE FUNCTION public.log_data_access(
  _table_name text,
  _action text,
  _record_id uuid DEFAULT NULL,
  _metadata jsonb DEFAULT '{}'::jsonb
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  -- Log data access for audit trails
  IF auth.uid() IS NOT NULL THEN
    INSERT INTO public.security_events (
      user_id,
      event_type,
      severity,
      metadata
    ) VALUES (
      auth.uid(),
      'data_access',
      'low',
      jsonb_build_object(
        'table_name', _table_name,
        'action', _action,
        'record_id', _record_id,
        'timestamp', now()
      ) || _metadata
    );
  END IF;
END;
$$;