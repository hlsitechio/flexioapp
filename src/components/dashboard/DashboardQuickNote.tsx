import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StickyNote, Edit3, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export function DashboardQuickNote() {
  const [note, setNote] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <StickyNote className="h-5 w-5 text-primary" />
          Quick Note
          <Button 
            onClick={isEditing ? handleSave : handleEdit}
            size="sm"
            variant="ghost"
            className="ml-auto h-8 w-8 p-0"
          >
            {isEditing ? <Save className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Write your quick note here..."
            className="min-h-[100px] resize-none"
            autoFocus
          />
        ) : (
          <div 
            className="min-h-[100px] p-3 rounded-md border border-input bg-background cursor-pointer hover:bg-accent/50 transition-colors"
            onClick={handleEdit}
          >
            {note ? (
              <p className="text-sm text-foreground whitespace-pre-wrap">{note}</p>
            ) : (
              <p className="text-sm text-muted-foreground italic">
                Click to add a note...
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}