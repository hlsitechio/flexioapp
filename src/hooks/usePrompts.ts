import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { sanitizeText, titleSchema, textContentSchema } from '@/lib/security';
import { z } from 'zod';

interface Prompt {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  tags: string[];
  is_favorite: boolean;
  usage_count: number;
  created_at: string;
  user_id: string;
}

const samplePrompts: Omit<Prompt, 'id' | 'user_id' | 'created_at'>[] = [
  {
    title: "Code Review Assistant",
    description: "Comprehensive code review with suggestions",
    content: "Please review the following code and provide:\n1. Code quality assessment\n2. Potential bugs or issues\n3. Performance improvements\n4. Best practices recommendations\n5. Security considerations\n\nCode to review:\n{CODE_HERE}",
    category: "coding",
    tags: ["code-review", "debugging", "optimization"],
    is_favorite: false,
    usage_count: 0
  },
  {
    title: "Creative Writing Starter",
    description: "Generate creative story beginnings",
    content: "Create an engaging opening paragraph for a story with the following elements:\n- Genre: {GENRE}\n- Setting: {SETTING}\n- Main character: {CHARACTER}\n- Mood: {MOOD}\n\nMake it compelling and hook the reader immediately.",
    category: "creative",
    tags: ["storytelling", "creative-writing", "fiction"],
    is_favorite: false,
    usage_count: 0
  },
  {
    title: "API Documentation Generator",
    description: "Generate comprehensive API documentation",
    content: "Create detailed API documentation for the following endpoint:\n\nEndpoint: {ENDPOINT}\nMethod: {METHOD}\nDescription: {DESCRIPTION}\n\nInclude:\n- Purpose and functionality\n- Parameters (required/optional)\n- Request/response examples\n- Error codes and handling\n- Rate limiting information",
    category: "coding",
    tags: ["api", "documentation", "development"],
    is_favorite: false,
    usage_count: 0
  },
  {
    title: "Meeting Summary Generator",
    description: "Transform meeting notes into structured summaries",
    content: "Transform the following meeting notes into a professional summary:\n\n{MEETING_NOTES}\n\nStructure the summary with:\n1. Meeting overview\n2. Key decisions made\n3. Action items with owners\n4. Next steps\n5. Important deadlines",
    category: "writing",
    tags: ["meetings", "summary", "productivity"],
    is_favorite: false,
    usage_count: 0
  }
];

export function usePrompts() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [prompts, setPrompts] = useState<Prompt[]>([]);

  useEffect(() => {
    if (user) {
      loadPrompts();
    } else {
      // Show sample prompts for non-authenticated users
      setPrompts(samplePrompts.map((prompt, index) => ({
        ...prompt,
        id: `sample-${index}`,
        user_id: 'sample',
        created_at: new Date().toISOString()
      })));
    }
  }, [user]);

  const loadPrompts = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_prompts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPrompts(data || []);
    } catch (error) {
      console.error('Error loading prompts:', error);
    }
  };

  const savePrompt = async (promptData: {
    title: string;
    description: string;
    content: string;
    category: string;
    tags: string;
  }) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save prompts",
        variant: "destructive"
      });
      return;
    }

    try {
      // Validate and sanitize input
      titleSchema.parse(promptData.title);
      textContentSchema.parse(promptData.content);
      
      const sanitizedData = {
        title: sanitizeText(promptData.title),
        description: promptData.description ? sanitizeText(promptData.description) : '',
        content: sanitizeText(promptData.content),
        category: promptData.category,
        tags: promptData.tags
      };
      
      if (!sanitizedData.title || !sanitizedData.content) {
        toast({
          title: "Missing fields",
          description: "Please fill in title and content",
          variant: "destructive"
        });
        return;
      }

      const { data, error } = await supabase
        .from('user_prompts')
        .insert({
          user_id: user.id,
          title: sanitizedData.title,
          description: sanitizedData.description,
          content: sanitizedData.content,
          category: sanitizedData.category,
          tags: sanitizedData.tags.split(',').map(tag => sanitizeText(tag.trim())).filter(Boolean),
          is_favorite: false,
          usage_count: 0
        })
        .select()
        .single();

      if (error) throw error;

      setPrompts(prev => [data, ...prev]);
      toast({
        title: "Prompt saved",
        description: "Your prompt has been saved successfully"
      });
    } catch (error) {
      console.error('Error saving prompt:', error);
      toast({
        title: "Error",
        description: error instanceof z.ZodError ? error.errors[0].message : "Failed to save prompt",
        variant: "destructive"
      });
    }
  };

  const copyPrompt = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast({
        title: "Copied!",
        description: "Prompt copied to clipboard"
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Failed to copy prompt to clipboard",
        variant: "destructive"
      });
    }
  };

  return {
    prompts,
    savePrompt,
    copyPrompt,
    loadPrompts
  };
}