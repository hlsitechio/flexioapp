-- Add user_navigation_order column to user_settings table
ALTER TABLE public.user_settings 
ADD COLUMN user_navigation_order jsonb DEFAULT '["Profile", "UserSettings", "NotificationButton"]'::jsonb;