-- Add archived_at column to workspaces table for soft deletion
ALTER TABLE public.workspaces 
ADD COLUMN archived_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;

-- Create index for better performance on archived workspaces queries
CREATE INDEX idx_workspaces_archived_at ON public.workspaces(archived_at);

-- Create function to permanently delete workspaces archived for more than 30 days
CREATE OR REPLACE FUNCTION public.cleanup_archived_workspaces()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Delete workspaces that have been archived for more than 30 days
  DELETE FROM public.workspaces 
  WHERE archived_at IS NOT NULL 
    AND archived_at < NOW() - INTERVAL '30 days';
END;
$$;

-- Create function to archive workspace (soft delete)
CREATE OR REPLACE FUNCTION public.archive_workspace(_workspace_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  UPDATE public.workspaces 
  SET archived_at = NOW()
  WHERE id = _workspace_id;
END;
$$;

-- Create function to restore archived workspace
CREATE OR REPLACE FUNCTION public.restore_workspace(_workspace_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  UPDATE public.workspaces 
  SET archived_at = NULL
  WHERE id = _workspace_id;
END;
$$;

-- Update existing RLS policies to exclude archived workspaces from normal queries
-- Drop existing policies first
DROP POLICY IF EXISTS "Users can view their own workspaces" ON public.workspaces;
DROP POLICY IF EXISTS "Users can create their own workspaces" ON public.workspaces;
DROP POLICY IF EXISTS "Users can update their own workspaces" ON public.workspaces;
DROP POLICY IF EXISTS "Users can delete their own workspaces" ON public.workspaces;

-- Recreate policies to exclude archived workspaces
CREATE POLICY "Users can view their own workspaces" 
ON public.workspaces 
FOR SELECT 
USING (auth.uid() = user_id AND archived_at IS NULL);

CREATE POLICY "Users can create their own workspaces" 
ON public.workspaces 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own workspaces" 
ON public.workspaces 
FOR UPDATE 
USING (auth.uid() = user_id AND archived_at IS NULL);

CREATE POLICY "Users can archive their own workspaces" 
ON public.workspaces 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create admin policies for managing all workspaces including archived ones
CREATE POLICY "Admins can view all workspaces including archived" 
ON public.workspaces 
FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage all workspaces" 
ON public.workspaces 
FOR ALL 
USING (public.has_role(auth.uid(), 'admin'));

-- Create function to get user by ID for admin use
CREATE OR REPLACE FUNCTION public.get_user_by_id(_user_id uuid)
RETURNS TABLE(id uuid, email text, created_at timestamp with time zone)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT u.id, u.email, u.created_at
  FROM auth.users u
  WHERE u.id = _user_id;
$$;