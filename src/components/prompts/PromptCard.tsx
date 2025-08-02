import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy } from 'lucide-react';

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

interface PromptCardProps {
  prompt: Prompt;
  CategoryIcon: React.ComponentType<{ className?: string }>;
  onCopy: (content: string) => void;
}

export function PromptCard({ prompt, CategoryIcon, onCopy }: PromptCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow h-full flex flex-col">
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
            onClick={() => onCopy(prompt.content)}
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
}