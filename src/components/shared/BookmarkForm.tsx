import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { BookmarkFormData } from '@/hooks/useBookmarks';

interface BookmarkFormProps {
  onSubmit: (data: BookmarkFormData) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
}

export function BookmarkForm({ onSubmit, onCancel, submitLabel = "Save Bookmark" }: BookmarkFormProps) {
  const [formData, setFormData] = useState<BookmarkFormData>({
    title: '',
    url: '',
    description: '',
    tags: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.url.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      setFormData({ title: '', url: '', description: '', tags: '' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          placeholder="Enter bookmark title"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="url">URL</Label>
        <Input
          id="url"
          type="url"
          value={formData.url}
          onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
          placeholder="https://example.com"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Optional description"
          rows={3}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="tags">Tags</Label>
        <Input
          id="tags"
          value={formData.tags}
          onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
          placeholder="tag1, tag2, tag3"
        />
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={isSubmitting || !formData.title.trim() || !formData.url.trim()}
        >
          {isSubmitting ? 'Saving...' : submitLabel}
        </Button>
      </div>
    </form>
  );
}