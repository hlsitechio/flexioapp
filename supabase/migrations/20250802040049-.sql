-- Create user_prompts table for storing AI prompts
CREATE TABLE public.user_prompts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'other',
  tags TEXT[] DEFAULT '{}',
  is_favorite BOOLEAN DEFAULT false,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create code_snippets table for storing code blocks
CREATE TABLE public.code_snippets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  code TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'javascript',
  tags TEXT[] DEFAULT '{}',
  is_favorite BOOLEAN DEFAULT false,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.user_prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.code_snippets ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_prompts
CREATE POLICY "Users can view their own prompts" 
ON public.user_prompts 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own prompts" 
ON public.user_prompts 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own prompts" 
ON public.user_prompts 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own prompts" 
ON public.user_prompts 
FOR DELETE 
USING (auth.uid() = user_id);

-- RLS Policies for code_snippets
CREATE POLICY "Users can view their own code snippets" 
ON public.code_snippets 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own code snippets" 
ON public.code_snippets 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own code snippets" 
ON public.code_snippets 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own code snippets" 
ON public.code_snippets 
FOR DELETE 
USING (auth.uid() = user_id);

-- Add triggers for updated_at
CREATE TRIGGER update_user_prompts_updated_at
BEFORE UPDATE ON public.user_prompts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_code_snippets_updated_at
BEFORE UPDATE ON public.code_snippets
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_user_prompts_user_id ON public.user_prompts(user_id);
CREATE INDEX idx_user_prompts_category ON public.user_prompts(category);
CREATE INDEX idx_user_prompts_created_at ON public.user_prompts(created_at DESC);
CREATE INDEX idx_code_snippets_user_id ON public.code_snippets(user_id);
CREATE INDEX idx_code_snippets_language ON public.code_snippets(language);
CREATE INDEX idx_code_snippets_created_at ON public.code_snippets(created_at DESC);