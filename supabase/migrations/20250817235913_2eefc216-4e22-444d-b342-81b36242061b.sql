-- Add RLS policies for demo_requests to restrict access to authorized personnel only

-- Allow admins to view and manage all demo requests
CREATE POLICY "Admins can view all demo requests" 
ON public.demo_requests 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update demo requests" 
ON public.demo_requests 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Allow users with 'premium' or 'pro' roles to view demo requests (sales team access)
CREATE POLICY "Sales team can view demo requests" 
ON public.demo_requests 
FOR SELECT 
USING (has_role(auth.uid(), 'premium'::app_role) OR has_role(auth.uid(), 'pro'::app_role));

-- The existing service role policy remains for edge functions to insert demo requests
-- No changes needed to the existing "Service role can manage demo requests" policy