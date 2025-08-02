import { useState, useEffect } from 'react';
import { MessageSquare, Copy, Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

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
      <div className="flex flex-col items-center space-y-1 px-1">
        <MessageSquare className="h-4 w-4 text-primary" />
        <span className="text-xs font-medium">{prompts.length}</span>
      </div>
    );
  }

  return (
    <div className="space-y-2 px-2">
      {prompts.map((prompt) => (
        <Card key={prompt.id} className="border-0 bg-muted/30">
          <CardContent className="p-2">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-foreground truncate mb-1">
                  {prompt.title}
                </p>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {prompt.content.length > 60 
                    ? `${prompt.content.substring(0, 60)}...` 
                    : prompt.content
                  }
                </p>
                <div className="flex gap-1 mt-1">
                  <Badge variant="secondary" className="text-xs py-0 px-1 h-3">
                    {prompt.category}
                  </Badge>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-5 w-5 p-0 opacity-60 hover:opacity-100"
                onClick={() => copyPrompt(prompt.content)}
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
      
      <Button
        variant="ghost"
        size="sm"
        className="w-full h-6 text-xs justify-start"
        onClick={() => window.open('/components', '_blank')}
      >
        <Plus className="h-3 w-3 mr-1" />
        Add more
      </Button>
    </div>
  );
}