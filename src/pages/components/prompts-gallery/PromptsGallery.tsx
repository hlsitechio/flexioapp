import { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Code, 
  Paintbrush,
  BookOpen,
  Lightbulb,
  Zap
} from 'lucide-react';
import { PromptCard, AddPromptDialog, PromptsFilters } from '@/components/prompts';
import { usePrompts } from '@/hooks/usePrompts';

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

export function PromptsGallery() {
  const { prompts, savePrompt, copyPrompt } = usePrompts();
  const [filteredPrompts, setFilteredPrompts] = useState<Prompt[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    filterPrompts();
  }, [prompts, searchTerm, selectedCategory]);

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
        <AddPromptDialog onSave={savePrompt} />
      </div>

      <PromptsFilters
        searchTerm={searchTerm}
        selectedCategory={selectedCategory}
        onSearchChange={setSearchTerm}
        onCategoryChange={setSelectedCategory}
      />

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
                <PromptCard
                  key={prompt.id}
                  prompt={prompt}
                  CategoryIcon={CategoryIcon}
                  onCopy={copyPrompt}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}