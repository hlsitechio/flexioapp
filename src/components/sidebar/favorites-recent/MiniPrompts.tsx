import { useState, useEffect } from 'react';
import { MessageSquare, Copy, Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface Prompt {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
}

interface MiniPromptsProps {
  isCollapsed: boolean;
}

export function MiniPrompts({ isCollapsed }: MiniPromptsProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadPrompts();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadPrompts = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('user_prompts')
        .select('id, title, content, category, tags')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) throw error;
      setPrompts(data || []);
    } catch (error) {
      console.error('Error loading prompts:', error);
    } finally {
      setLoading(false);
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
        description: "Failed to copy prompt",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className={`space-y-2 ${isCollapsed ? 'px-1' : 'px-2'}`}>
        {[...Array(2)].map((_, i) => (
          <div key={i} className="h-8 bg-muted/50 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  if (prompts.length === 0) {
    return (
      <div className={`text-xs text-muted-foreground ${isCollapsed ? 'px-1 text-center' : 'px-2'}`}>
        {isCollapsed ? '💬' : 'No prompts yet'}
      </div>
    );
  }

  if (isCollapsed) {
    return (
      <div 
        className="flex flex-col items-center space-y-1 px-1 cursor-pointer hover:bg-muted/50 rounded p-1 transition-colors"
        onClick={() => navigate('/prompts-gallery')}
      >
        <MessageSquare className="h-4 w-4 text-primary" />
        <span className="text-xs font-medium">{prompts.length}</span>
      </div>
    );
  }

  return (
    <div className="space-y-1 px-2">
      {prompts.map((prompt) => (
        <div key={prompt.id} className="group flex items-center justify-between gap-2 py-1 px-2 rounded hover:bg-muted/50 transition-colors">
          <div 
            className="flex items-center gap-2 flex-1 min-w-0 cursor-pointer"
            onClick={() => navigate('/prompts-gallery')}
          >
            <MessageSquare className="h-3 w-3 text-primary flex-shrink-0" />
            <span className="text-xs text-foreground truncate">{prompt.title}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-4 w-4 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              copyPrompt(prompt.content);
            }}
          >
            <Copy className="h-2.5 w-2.5" />
          </Button>
        </div>
      ))}
      
      <div className="flex items-center gap-2 py-1 px-2">
        <Plus className="h-3 w-3 text-muted-foreground" />
        <Button
          variant="ghost"
          size="sm"
          className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground justify-start"
          onClick={() => navigate('/prompts-gallery')}
        >
          View all prompts
        </Button>
      </div>
    </div>
  );
}