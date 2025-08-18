-- Add RLS policies for newsletter_subscriptions to restrict access to authorized marketing team and admins only

-- Allow admins to view and manage all newsletter subscriptions
CREATE POLICY "Admins can view all newsletter subscriptions" 
ON public.newsletter_subscriptions 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update newsletter subscriptions" 
ON public.newsletter_subscriptions 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete newsletter subscriptions" 
ON public.newsletter_subscriptions 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Allow users with 'premium' or 'pro' roles to view newsletter subscriptions (marketing team access)
CREATE POLICY "Marketing team can view newsletter subscriptions" 
ON public.newsletter_subscriptions 
FOR SELECT 
USING (has_role(auth.uid(), 'premium'::app_role) OR has_role(auth.uid(), 'pro'::app_role));

CREATE POLICY "Marketing team can update newsletter subscriptions" 
ON public.newsletter_subscriptions 
FOR UPDATE 
USING (has_role(auth.uid(), 'premium'::app_role) OR has_role(auth.uid(), 'pro'::app_role));

-- The existing service role policy remains for edge functions to manage newsletter subscriptions
-- No changes needed to the existing "Service role can manage newsletter subscriptions" policy