-- Add gradient_mode column to user_settings table
ALTER TABLE public.user_settings ADD COLUMN gradient_mode text DEFAULT 'full';