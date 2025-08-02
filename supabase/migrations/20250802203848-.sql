-- Add missing columns to user_settings table to support all persistent settings
ALTER TABLE public.user_settings ADD COLUMN IF NOT EXISTS clock_position text DEFAULT 'left'::text;
ALTER TABLE public.user_settings ADD COLUMN IF NOT EXISTS show_header_title boolean DEFAULT true;
ALTER TABLE public.user_settings ADD COLUMN IF NOT EXISTS custom_header_title text DEFAULT 'Premium Dashboard'::text;
ALTER TABLE public.user_settings ADD COLUMN IF NOT EXISTS show_sidebar_crown boolean DEFAULT true;
ALTER TABLE public.user_settings ADD COLUMN IF NOT EXISTS custom_sidebar_title text DEFAULT 'Premium Dashboard'::text;
ALTER TABLE public.user_settings ADD COLUMN IF NOT EXISTS show_seconds boolean DEFAULT true;
ALTER TABLE public.user_settings ADD COLUMN IF NOT EXISTS show_date boolean DEFAULT true;
ALTER TABLE public.user_settings ADD COLUMN IF NOT EXISTS show_year boolean DEFAULT true;
ALTER TABLE public.user_settings ADD COLUMN IF NOT EXISTS use_24_hour_format boolean DEFAULT false;
ALTER TABLE public.user_settings ADD COLUMN IF NOT EXISTS grid_size text DEFAULT '4x4'::text;
ALTER TABLE public.user_settings ADD COLUMN IF NOT EXISTS top_navigation_widgets jsonb DEFAULT '[]'::jsonb;
ALTER TABLE public.user_settings ADD COLUMN IF NOT EXISTS banner_image text DEFAULT ''::text;
ALTER TABLE public.user_settings ADD COLUMN IF NOT EXISTS show_banner boolean DEFAULT false;
ALTER TABLE public.user_settings ADD COLUMN IF NOT EXISTS banner_height integer DEFAULT 192;
ALTER TABLE public.user_settings ADD COLUMN IF NOT EXISTS dashboard_background text DEFAULT 'bg-gradient-to-br from-background to-muted/20'::text;
ALTER TABLE public.user_settings ADD COLUMN IF NOT EXISTS edit_mode boolean DEFAULT false;