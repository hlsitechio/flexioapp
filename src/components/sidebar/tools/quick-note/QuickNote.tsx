import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { StickyNote, Edit3 } from 'lucide-react';

export function QuickNote() {
  const [note, setNote] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  return (
    <Card className="border-0 bg-muted/30">
      <CardContent className="p-3">
        <div className="flex items-center gap-2">
          <StickyNote className="h-4 w-4 text-primary" />
          {isEditing ? (
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              onBlur={handleSave}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              placeholder="Quick note..."
              className="text-sm bg-transparent border-none outline-none flex-1 text-foreground placeholder:text-muted-foreground"
              autoFocus
            />
          ) : (
            <span 
              className="text-sm text-foreground flex-1 cursor-pointer hover:text-primary transition-colors"
              onClick={handleEdit}
            >
              {note || 'Add note...'}
            </span>
          )}
          <button 
            onClick={handleEdit}
            className="opacity-60 hover:opacity-100 transition-opacity"
          >
            <Edit3 className="h-3 w-3" />
          </button>
        </div>
      </CardContent>
    </Card>
  );
}