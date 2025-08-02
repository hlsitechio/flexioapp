-- Create starred_items table for favorited kanban items
CREATE TABLE public.starred_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  item_id TEXT NOT NULL,
  item_title TEXT NOT NULL,
  item_type TEXT NOT NULL,
  starred_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, item_id)
);

-- Create pinned_notes table for important notes
CREATE TABLE public.pinned_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  pinned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create recent_activity table for tracking user actions
CREATE TABLE public.recent_activity (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  action_type TEXT NOT NULL,
  description TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.starred_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pinned_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recent_activity ENABLE ROW LEVEL SECURITY;

-- RLS Policies for starred_items
CREATE POLICY "Users can view their own starred items" 
ON public.starred_items 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own starred items" 
ON public.starred_items 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own starred items" 
ON public.starred_items 
FOR DELETE 
USING (auth.uid() = user_id);

-- RLS Policies for pinned_notes
CREATE POLICY "Users can view their own pinned notes" 
ON public.pinned_notes 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own pinned notes" 
ON public.pinned_notes 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pinned notes" 
ON public.pinned_notes 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own pinned notes" 
ON public.pinned_notes 
FOR DELETE 
USING (auth.uid() = user_id);

-- RLS Policies for recent_activity
CREATE POLICY "Users can view their own recent activity" 
ON public.recent_activity 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own recent activity" 
ON public.recent_activity 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Add trigger for pinned_notes updated_at
CREATE TRIGGER update_pinned_notes_updated_at
BEFORE UPDATE ON public.pinned_notes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_starred_items_user_id ON public.starred_items(user_id);
CREATE INDEX idx_starred_items_starred_at ON public.starred_items(starred_at DESC);
CREATE INDEX idx_pinned_notes_user_id ON public.pinned_notes(user_id);
CREATE INDEX idx_pinned_notes_pinned_at ON public.pinned_notes(pinned_at DESC);
CREATE INDEX idx_recent_activity_user_id ON public.recent_activity(user_id);
CREATE INDEX idx_recent_activity_created_at ON public.recent_activity(created_at DESC);