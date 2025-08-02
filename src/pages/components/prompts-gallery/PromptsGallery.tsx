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
  Zap, 
  MessageSquare, 
  Code, 
  Paintbrush,
  BookOpen,
  Lightbulb,
  CheckCircle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

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

const categories = [
  { value: 'writing', label: 'Writing', icon: MessageSquare },
  { value: 'coding', label: 'Coding', icon: Code },
  { value: 'creative', label: 'Creative', icon: Paintbrush },
  { value: 'research', label: 'Research', icon: BookOpen },
  { value: 'brainstorming', label: 'Brainstorming', icon: Lightbulb },
  { value: 'other', label: 'Other', icon: Zap }
];

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

export function PromptsGallery() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [filteredPrompts, setFilteredPrompts] = useState<Prompt[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showDialog, setShowDialog] = useState(false);
  const [newPrompt, setNewPrompt] = useState({
    title: '',
    description: '',
    content: '',
    category: 'writing',
    tags: ''
  });

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

  useEffect(() => {
    filterPrompts();
  }, [prompts, searchTerm, selectedCategory]);


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

  const filterPrompts = () => {
    let filtered = prompts;

    if (searchTerm) {
      filtered = filtered.filter(prompt =>
        prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prompt.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prompt.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(prompt => prompt.category === selectedCategory);
    }

    setFilteredPrompts(filtered);
  };

  const savePrompt = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save prompts",
        variant: "destructive"
      });
      return;
    }

    if (!newPrompt.title || !newPrompt.content) {
      toast({
        title: "Missing fields",
        description: "Please fill in title and content",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_prompts')
        .insert({
          user_id: user.id,
          title: newPrompt.title,
          description: newPrompt.description,
          content: newPrompt.content,
          category: newPrompt.category,
          tags: newPrompt.tags.split(',').map(tag => tag.trim()).filter(Boolean),
          is_favorite: false,
          usage_count: 0
        })
        .select()
        .single();

      if (error) throw error;

      setPrompts(prev => [data, ...prev]);
      setShowDialog(false);
      setNewPrompt({
        title: '',
        description: '',
        content: '',
        category: 'writing',
        tags: ''
      });

      toast({
        title: "Prompt saved",
        description: "Your prompt has been saved successfully"
      });
    } catch (error) {
      console.error('Error saving prompt:', error);
      toast({
        title: "Error",
        description: "Failed to save prompt",
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

  const getCategoryIcon = (category: string) => {
    const categoryData = categories.find(cat => cat.value === category);
    return categoryData ? categoryData.icon : Zap;
  };

  return (
    <div className="flex flex-col h-full p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Prompts Gallery</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Store and organize your AI prompts for quick access
          </p>
        </div>
        
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Prompt
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Prompt</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newPrompt.title}
                  onChange={(e) => setNewPrompt(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter prompt title"
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={newPrompt.description}
                  onChange={(e) => setNewPrompt(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of the prompt"
                />
              </div>
              
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={newPrompt.category} onValueChange={(value) => setNewPrompt(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input
                  id="tags"
                  value={newPrompt.tags}
                  onChange={(e) => setNewPrompt(prev => ({ ...prev, tags: e.target.value }))}
                  placeholder="tag1, tag2, tag3"
                />
              </div>
              
              <div>
                <Label htmlFor="content">Prompt Content</Label>
                <Textarea
                  id="content"
                  value={newPrompt.content}
                  onChange={(e) => setNewPrompt(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Enter your prompt here... Use {VARIABLE_NAME} for placeholders"
                  className="min-h-32"
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={savePrompt}>
                  Save Prompt
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
              placeholder="Search prompts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(category => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Prompts Grid */}
      <div className="flex-1 overflow-auto">
        {filteredPrompts.length === 0 ? (
          <div className="flex items-center justify-center h-full min-h-96">
            <div className="text-center">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No prompts found</h3>
              <p className="text-sm text-muted-foreground">
                {searchTerm || selectedCategory !== 'all'
                  ? 'Try adjusting your search filters'
                  : 'Create your first prompt to get started'
                }
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
            {filteredPrompts.map((prompt) => {
              const CategoryIcon = getCategoryIcon(prompt.category);
              return (
                <Card key={prompt.id} className="hover:shadow-md transition-shadow h-full flex flex-col">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <CategoryIcon className="h-4 w-4 text-primary flex-shrink-0" />
                        <CardTitle className="text-sm font-medium truncate">{prompt.title}</CardTitle>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 flex-shrink-0"
                        onClick={() => copyPrompt(prompt.content)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    {prompt.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2">{prompt.description}</p>
                    )}
                  </CardHeader>
                  
                  <CardContent className="pt-0 flex-1 flex flex-col">
                    <div className="space-y-3 flex-1">
                      <div className="bg-muted/50 rounded p-3 text-xs font-mono min-h-20 overflow-hidden">
                        <div className="line-clamp-4">
                          {prompt.content.length > 150 
                            ? `${prompt.content.substring(0, 150)}...` 
                            : prompt.content
                          }
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {prompt.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs py-0 px-2 h-5">
                            {tag}
                          </Badge>
                        ))}
                        {prompt.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs py-0 px-2 h-5">
                            +{prompt.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex justify-between items-center text-xs text-muted-foreground mt-auto">
                        <span className="capitalize">{prompt.category}</span>
                        {prompt.usage_count > 0 && (
                          <span>Used {prompt.usage_count} times</span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}