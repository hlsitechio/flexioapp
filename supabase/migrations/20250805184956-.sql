-- Create workspace profiles table to store complete dashboard configurations
CREATE TABLE public.workspace_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'My Profile',
  category TEXT DEFAULT 'personal',
  is_default BOOLEAN DEFAULT false,
  
  -- Dashboard Layout Settings
  dashboard_layout JSONB DEFAULT '{}'::jsonb,
  grid_size TEXT DEFAULT '4x4',
  banner_image TEXT DEFAULT '',
  show_banner BOOLEAN DEFAULT false,
  banner_height INTEGER DEFAULT 192,
  dashboard_background TEXT DEFAULT 'bg-gradient-to-br from-background to-muted/20',
  
  -- UI Settings
  custom_header_title TEXT DEFAULT 'Premium Dashboard',
  custom_sidebar_title TEXT DEFAULT 'Premium Dashboard',
  show_header_title BOOLEAN DEFAULT true,
  show_sidebar_crown BOOLEAN DEFAULT true,
  
  -- Navigation Settings
  top_navigation_widgets JSONB DEFAULT '[]'::jsonb,
  user_navigation_order JSONB DEFAULT '["Profile", "UserSettings", "NotificationButton"]'::jsonb,
  minimal_navigation_mode BOOLEAN DEFAULT false,
  sidebar_solid BOOLEAN DEFAULT false,
  sidebar_collapsed BOOLEAN DEFAULT false,
  
  -- Appearance Settings
  gradient_mode TEXT DEFAULT 'full',
  hide_dividers BOOLEAN DEFAULT false,
  
  -- Clock Settings
  use_24_hour_format BOOLEAN DEFAULT false,
  show_year BOOLEAN DEFAULT true,
  show_date BOOLEAN DEFAULT true,
  show_seconds BOOLEAN DEFAULT true,
  clock_position TEXT DEFAULT 'left',
  
  -- Other Settings
  edit_mode BOOLEAN DEFAULT false,
  quick_note TEXT DEFAULT '',
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.workspace_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for workspace profiles
CREATE POLICY "Users can view their own workspace profiles" 
ON public.workspace_profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own workspace profiles" 
ON public.workspace_profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own workspace profiles" 
ON public.workspace_profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own workspace profiles" 
ON public.workspace_profiles 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_workspace_profiles_updated_at
BEFORE UPDATE ON public.workspace_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create categories enum for better data consistency
CREATE TYPE public.workspace_category AS ENUM ('work', 'personal', 'fun', 'default');

-- Add category constraint
ALTER TABLE public.workspace_profiles 
ADD CONSTRAINT valid_category 
CHECK (category IN ('work', 'personal', 'fun', 'default'));

-- Create index for better performance
CREATE INDEX idx_workspace_profiles_user_workspace ON public.workspace_profiles(user_id, workspace_id);
CREATE INDEX idx_workspace_profiles_default ON public.workspace_profiles(user_id, is_default) WHERE is_default = true;