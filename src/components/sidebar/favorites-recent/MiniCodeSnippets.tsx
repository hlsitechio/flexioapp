import { useState, useEffect } from 'react';
import { Code2, Copy, Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface CodeSnippet {
  id: string;
  title: string;
  code: string;
  language: string;
  tags: string[];
}

interface MiniCodeSnippetsProps {
  isCollapsed: boolean;
}

const languages = [
  { value: 'javascript', label: 'JS' },
  { value: 'typescript', label: 'TS' },
  { value: 'python', label: 'PY' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'csharp', label: 'C#' },
  { value: 'php', label: 'PHP' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'sql', label: 'SQL' },
  { value: 'bash', label: 'Bash' },
  { value: 'json', label: 'JSON' },
  { value: 'yaml', label: 'YAML' },
  { value: 'markdown', label: 'MD' },
  { value: 'other', label: 'Other' }
];

export function MiniCodeSnippets({ isCollapsed }: MiniCodeSnippetsProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [snippets, setSnippets] = useState<CodeSnippet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadSnippets();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadSnippets = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('code_snippets')
        .select('id, title, code, language, tags')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) throw error;
      setSnippets(data || []);
    } catch (error) {
      console.error('Error loading snippets:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      toast({
        title: "Copied!",
        description: "Code copied to clipboard"
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Failed to copy code",
        variant: "destructive"
      });
    }
  };

  const getLanguageColor = (language: string) => {
    const colors: Record<string, string> = {
      javascript: 'bg-yellow-500',
      typescript: 'bg-blue-500',
      python: 'bg-green-500',
      java: 'bg-red-500',
      cpp: 'bg-blue-600',
      csharp: 'bg-purple-500',
      php: 'bg-indigo-500',
      ruby: 'bg-red-600',
      go: 'bg-cyan-500',
      rust: 'bg-orange-500',
      html: 'bg-orange-600',
      css: 'bg-blue-400',
      sql: 'bg-gray-500',
      bash: 'bg-gray-700',
      json: 'bg-yellow-600',
      yaml: 'bg-red-400',
      markdown: 'bg-gray-600'
    };
    return colors[language] || 'bg-gray-400';
  };

  if (loading) {
    return (
      <div className={`space-y-2 ${isCollapsed ? 'px-1' : 'px-2'}`}>
        {[...Array(2)].map((_, i) => (
          <div key={i} className="h-10 bg-muted/50 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  if (snippets.length === 0) {
    return (
      <div className={`text-xs text-muted-foreground ${isCollapsed ? 'px-1 text-center' : 'px-2'}`}>
        {isCollapsed ? '💻' : 'No code snippets yet'}
      </div>
    );
  }

  if (isCollapsed) {
    return (
      <div className="flex flex-col items-center space-y-1 px-1">
        <Code2 className="h-4 w-4 text-primary" />
        <span className="text-xs font-medium">{snippets.length}</span>
      </div>
    );
  }

  return (
    <div className="space-y-1 px-2">
      {snippets.map((snippet) => (
        <div key={snippet.id} className="group flex items-center justify-between gap-2 py-1 px-2 rounded hover:bg-muted/50 transition-colors">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className={`w-2 h-2 rounded-full ${getLanguageColor(snippet.language)} flex-shrink-0`} />
            <span className="text-xs text-foreground truncate">{snippet.title}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-4 w-4 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => copyCode(snippet.code)}
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
          onClick={() => window.open('/components', '_blank')}
        >
          Add more
        </Button>
      </div>
    </div>
  );
}