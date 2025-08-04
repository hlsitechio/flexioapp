import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Code2, Copy, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface CodeSnippet {
  id: string;
  title: string;
  description: string;
  code: string;
  language: string;
  tags: string[];
  is_favorite: boolean;
  usage_count: number;
  created_at: string;
}

const languages = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
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
  { value: 'markdown', label: 'Markdown' },
  { value: 'other', label: 'Other' }
];

export function DashboardCodeBlock() {
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
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(6);

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
        description: "Failed to copy code to clipboard",
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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code2 className="h-5 w-5" />
            Code Snippets
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-muted/50 rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Code2 className="h-5 w-5" />
            Code Snippets
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.open('/components', '_blank')}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {snippets.length === 0 ? (
          <div className="text-center py-8">
            <Code2 className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No code snippets yet</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2"
              onClick={() => window.open('/components', '_blank')}
            >
              Create First Snippet
            </Button>
          </div>
        ) : (
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {snippets.map((snippet) => (
              <div key={snippet.id} className="group border rounded-lg p-3 hover:bg-muted transition-colors">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div className={`w-2 h-2 rounded-full ${getLanguageColor(snippet.language)} flex-shrink-0`} />
                    <h4 className="text-sm font-medium truncate">{snippet.title}</h4>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => copyCode(snippet.code)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
                
                <div className="bg-muted/50 rounded p-2 mb-2">
                  <pre className="text-xs font-mono whitespace-pre-wrap line-clamp-3">
                    {snippet.code.length > 120 
                      ? `${snippet.code.substring(0, 120)}...` 
                      : snippet.code
                    }
                  </pre>
                </div>
                
                <div className="flex gap-1 flex-wrap">
                  <Badge variant="secondary" className="text-xs py-0 px-1 h-4">
                    {languages.find(lang => lang.value === snippet.language)?.label || snippet.language}
                  </Badge>
                  {snippet.tags.slice(0, 2).map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs py-0 px-1 h-4">
                      {tag}
                    </Badge>
                  ))}
                  {snippet.tags.length > 2 && (
                    <Badge variant="outline" className="text-xs py-0 px-1 h-4">
                      +{snippet.tags.length - 2}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}