-- Add minimal_navigation_mode column to user_settings table
ALTER TABLE public.user_settings 
ADD COLUMN minimal_navigation_mode BOOLEAN DEFAULT false;