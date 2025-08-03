-- Add sidebar_solid column to user_settings table
ALTER TABLE public.user_settings 
ADD COLUMN sidebar_solid boolean DEFAULT false;