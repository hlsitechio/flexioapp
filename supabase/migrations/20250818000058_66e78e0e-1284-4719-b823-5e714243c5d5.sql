-- Add RLS policies for contact_submissions to restrict access to authorized support staff only

-- Allow admins to view and manage all contact submissions
CREATE POLICY "Admins can view all contact submissions" 
ON public.contact_submissions 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update contact submissions" 
ON public.contact_submissions 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Allow users with 'premium' or 'pro' roles to view contact submissions (support team access)
CREATE POLICY "Support team can view contact submissions" 
ON public.contact_submissions 
FOR SELECT 
USING (has_role(auth.uid(), 'premium'::app_role) OR has_role(auth.uid(), 'pro'::app_role));

CREATE POLICY "Support team can update contact submissions" 
ON public.contact_submissions 
FOR UPDATE 
USING (has_role(auth.uid(), 'premium'::app_role) OR has_role(auth.uid(), 'pro'::app_role));

-- The existing service role policy remains for edge functions to insert contact submissions
-- No changes needed to the existing "Service role can manage contact submissions" policy