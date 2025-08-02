-- Add quick_note column to user_settings table
ALTER TABLE public.user_settings 
ADD COLUMN quick_note TEXT DEFAULT '';