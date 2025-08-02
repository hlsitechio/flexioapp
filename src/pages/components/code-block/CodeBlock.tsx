import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { 
  Search, 
  Plus, 
  Copy, 
  Star, 
  Tag, 
  Code2, 
  FileText, 
  Play,
  CheckCircle,
  ExternalLink
} from 'lucide-react';
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
  user_id: string;
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

const sampleSnippets: Omit<CodeSnippet, 'id' | 'user_id' | 'created_at'>[] = [
  {
    title: "React useState Hook",
    description: "Basic useState hook implementation with TypeScript",
    code: `import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState<number>(0);

  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
    </div>
  );
}

export default Counter;`,
    language: "typescript",
    tags: ["react", "hooks", "typescript", "state"],
    is_favorite: false,
    usage_count: 0
  },
  {
    title: "Python List Comprehension",
    description: "Common list comprehension patterns in Python",
    code: `# Basic list comprehension
squares = [x**2 for x in range(10)]

# Conditional list comprehension
even_squares = [x**2 for x in range(10) if x % 2 == 0]

# Nested list comprehension
matrix = [[j for j in range(3)] for i in range(3)]

# Dictionary comprehension
word_lengths = {word: len(word) for word in ['hello', 'world', 'python']}

# Set comprehension
unique_chars = {char.lower() for word in ['Hello', 'World'] for char in word}`,
    language: "python",
    tags: ["python", "comprehension", "functional"],
    is_favorite: false,
    usage_count: 0
  },
  {
    title: "CSS Flexbox Layout",
    description: "Responsive flexbox layout with common patterns",
    code: `.container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
}

.item {
  flex: 1 1 300px; /* grow, shrink, basis */
  min-width: 0; /* prevent overflow */
}

/* Responsive breakpoint */
@media (max-width: 768px) {
  .container {
    flex-direction: column;
    align-items: stretch;
  }
  
  .item {
    flex: 1 1 auto;
  }
}`,
    language: "css",
    tags: ["css", "flexbox", "responsive", "layout"],
    is_favorite: false,
    usage_count: 0
  },
  {
    title: "JavaScript Array Methods",
    description: "Common array manipulation methods",
    code: `const users = [
  { id: 1, name: 'John', age: 30, active: true },
  { id: 2, name: 'Jane', age: 25, active: false },
  { id: 3, name: 'Bob', age: 35, active: true }
];

// Filter active users
const activeUsers = users.filter(user => user.active);

// Map to get names
const userNames = users.map(user => user.name);

// Find specific user
const user = users.find(user => user.id === 2);

// Reduce to get total age
const totalAge = users.reduce((sum, user) => sum + user.age, 0);

// Sort by age
const sortedByAge = users.sort((a, b) => a.age - b.age);

// Check if any user is over 30
const hasAdult = users.some(user => user.age > 30);`,
    language: "javascript",
    tags: ["javascript", "arrays", "functional", "es6"],
    is_favorite: false,
    usage_count: 0
  }
];

export function CodeBlock() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [snippets, setSnippets] = useState<CodeSnippet[]>([]);
  const [filteredSnippets, setFilteredSnippets] = useState<CodeSnippet[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [showDialog, setShowDialog] = useState(false);
  const [newSnippet, setNewSnippet] = useState({
    title: '',
    description: '',
    code: '',
    language: 'javascript',
    tags: ''
  });

  useEffect(() => {
    if (user) {
      loadSnippets();
    } else {
      // Show sample snippets for non-authenticated users
      setSnippets(sampleSnippets.map((snippet, index) => ({
        ...snippet,
        id: `sample-${index}`,
        user_id: 'sample',
        created_at: new Date().toISOString()
      })));
    }
  }, [user]);

  useEffect(() => {
    filterSnippets();
  }, [snippets, searchTerm, selectedLanguage]);

  const loadSnippets = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('code_snippets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSnippets(data || []);
    } catch (error) {
      console.error('Error loading snippets:', error);
    }
  };

  const filterSnippets = () => {
    let filtered = snippets;

    if (searchTerm) {
      filtered = filtered.filter(snippet =>
        snippet.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        snippet.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        snippet.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        snippet.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedLanguage !== 'all') {
      filtered = filtered.filter(snippet => snippet.language === selectedLanguage);
    }

    setFilteredSnippets(filtered);
  };

  const saveSnippet = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save code snippets",
        variant: "destructive"
      });
      return;
    }

    if (!newSnippet.title || !newSnippet.code) {
      toast({
        title: "Missing fields",
        description: "Please fill in title and code",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('code_snippets')
        .insert({
          user_id: user.id,
          title: newSnippet.title,
          description: newSnippet.description,
          code: newSnippet.code,
          language: newSnippet.language,
          tags: newSnippet.tags.split(',').map(tag => tag.trim()).filter(Boolean),
          is_favorite: false,
          usage_count: 0
        })
        .select()
        .single();

      if (error) throw error;

      setSnippets(prev => [data, ...prev]);
      setShowDialog(false);
      setNewSnippet({
        title: '',
        description: '',
        code: '',
        language: 'javascript',
        tags: ''
      });

      toast({
        title: "Snippet saved",
        description: "Your code snippet has been saved successfully"
      });
    } catch (error) {
      console.error('Error saving snippet:', error);
      toast({
        title: "Error",
        description: "Failed to save code snippet",
        variant: "destructive"
      });
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Code Snippets</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Store and organize your code snippets for quick access
          </p>
        </div>
        
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Snippet
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Code Snippet</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={newSnippet.title}
                    onChange={(e) => setNewSnippet(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter snippet title"
                  />
                </div>
                
                <div>
                  <Label htmlFor="language">Language</Label>
                  <Select value={newSnippet.language} onValueChange={(value) => setNewSnippet(prev => ({ ...prev, language: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map(lang => (
                        <SelectItem key={lang.value} value={lang.value}>
                          {lang.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={newSnippet.description}
                  onChange={(e) => setNewSnippet(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of the code snippet"
                />
              </div>
              
              <div>
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input
                  id="tags"
                  value={newSnippet.tags}
                  onChange={(e) => setNewSnippet(prev => ({ ...prev, tags: e.target.value }))}
                  placeholder="react, hooks, typescript"
                />
              </div>
              
              <div>
                <Label htmlFor="code">Code</Label>
                <Textarea
                  id="code"
                  value={newSnippet.code}
                  onChange={(e) => setNewSnippet(prev => ({ ...prev, code: e.target.value }))}
                  placeholder="Paste your code here..."
                  className="min-h-64 font-mono text-sm"
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={saveSnippet}>
                  Save Snippet
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex gap-4 flex-wrap">
        <div className="flex-1 min-w-64">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search code snippets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Languages</SelectItem>
            {languages.map(lang => (
              <SelectItem key={lang.value} value={lang.value}>
                {lang.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Snippets Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredSnippets.map((snippet) => (
          <Card key={snippet.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2 flex-1">
                  <Code2 className="h-4 w-4 text-primary" />
                  <CardTitle className="text-sm font-medium">{snippet.title}</CardTitle>
                  <div className={`w-2 h-2 rounded-full ${getLanguageColor(snippet.language)}`} />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => copyCode(snippet.code)}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
              {snippet.description && (
                <p className="text-xs text-muted-foreground">{snippet.description}</p>
              )}
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="bg-muted/50 rounded p-3 overflow-x-auto">
                  <pre className="text-xs font-mono whitespace-pre-wrap">
                    {snippet.code.length > 300 
                      ? `${snippet.code.substring(0, 300)}...` 
                      : snippet.code
                    }
                  </pre>
                </div>
                
                <div className="flex flex-wrap gap-1">
                  <Badge variant="secondary" className="text-xs">
                    {languages.find(lang => lang.value === snippet.language)?.label || snippet.language}
                  </Badge>
                  {snippet.tags.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      <Tag className="h-2 w-2 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                  {snippet.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{snippet.tags.length - 3}
                    </Badge>
                  )}
                </div>
                
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span>{snippet.code.split('\n').length} lines</span>
                  {snippet.usage_count > 0 && (
                    <span>{snippet.usage_count} uses</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredSnippets.length === 0 && (
        <div className="text-center py-12">
          <Code2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No code snippets found</h3>
          <p className="text-muted-foreground">
            {searchTerm || selectedLanguage !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Create your first code snippet to get started'
            }
          </p>
        </div>
      )}
    </div>
  );
}