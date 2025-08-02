import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

const categories = [
  { value: 'writing', label: 'Writing' },
  { value: 'coding', label: 'Coding' },
  { value: 'creative', label: 'Creative' },
  { value: 'research', label: 'Research' },
  { value: 'brainstorming', label: 'Brainstorming' },
  { value: 'other', label: 'Other' }
];

interface PromptsFiltersProps {
  searchTerm: string;
  selectedCategory: string;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
}

export function PromptsFilters({
  searchTerm,
  selectedCategory,
  onSearchChange,
  onCategoryChange
}: PromptsFiltersProps) {
  return (
    <div className="flex gap-4 flex-wrap">
      <div className="flex-1 min-w-64">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search prompts..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      
      <Select value={selectedCategory} onValueChange={onCategoryChange}>
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
  );
}