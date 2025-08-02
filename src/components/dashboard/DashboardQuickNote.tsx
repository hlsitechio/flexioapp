import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StickyNote, Edit3, Save, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

// Quick Note component with multiple notes support
export function DashboardQuickNote() {
  const [notes, setNotes] = useState<string[]>([]);
  const [currentNote, setCurrentNote] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    if (currentNote.trim()) {
      setNotes([...notes, currentNote.trim()]);
      setCurrentNote('');
    }
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleAddNote = () => {
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
        {/* Display existing notes */}
        {notes.length > 0 && (
          <div className="space-y-2 mb-4">
            {notes.map((note, index) => (
              <div key={index} className="flex items-start gap-2 text-sm">
                <span className="text-muted-foreground font-mono">{index + 1}.</span>
                <span className="text-foreground">{note}</span>
              </div>
            ))}
          </div>
        )}
        
        {/* Input area for new note */}
        {isEditing ? (
          <Textarea
            value={currentNote}
            onChange={(e) => setCurrentNote(e.target.value)}
            placeholder="Write your quick note here..."
            className="min-h-[80px] resize-none"
            autoFocus
          />
        ) : (
          <div 
            className="min-h-[80px] p-3 rounded-md border border-input bg-background cursor-pointer hover:bg-accent/50 transition-colors"
            onClick={handleEdit}
          >
            <p className="text-sm text-muted-foreground italic">
              Click to add a note...
            </p>
          </div>
        )}
        
        {/* Plus button to add more notes */}
        {notes.length > 0 && !isEditing && (
          <Button
            onClick={handleAddNote}
            variant="ghost"
            size="sm"
            className="w-full mt-2 text-muted-foreground hover:text-foreground"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add another note
          </Button>
        )}
      </CardContent>
    </Card>
  );
}