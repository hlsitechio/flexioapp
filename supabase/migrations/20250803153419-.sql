-- Add unique constraint on user_id for user_settings table to enable proper upserts
ALTER TABLE public.user_settings ADD CONSTRAINT user_settings_user_id_unique UNIQUE (user_id);