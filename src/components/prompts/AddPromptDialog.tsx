import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';

const categories = [
  { value: 'writing', label: 'Writing' },
  { value: 'coding', label: 'Coding' },
  { value: 'creative', label: 'Creative' },
  { value: 'research', label: 'Research' },
  { value: 'brainstorming', label: 'Brainstorming' },
  { value: 'other', label: 'Other' }
];

interface AddPromptDialogProps {
  onSave: (prompt: {
    title: string;
    description: string;
    content: string;
    category: string;
    tags: string;
  }) => Promise<void>;
}

export function AddPromptDialog({ onSave }: AddPromptDialogProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [newPrompt, setNewPrompt] = useState({
    title: '',
    description: '',
    content: '',
    category: 'writing',
    tags: ''
  });

  const handleSave = async () => {
    await onSave(newPrompt);
    setShowDialog(false);
    setNewPrompt({
      title: '',
      description: '',
      content: '',
      category: 'writing',
      tags: ''
    });
  };

  return (
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
            <Button onClick={handleSave}>
              Save Prompt
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}