import { useState, useEffect } from 'react';
import { Pin, Plus, X, Edit3 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface PinnedNote {
  id: string;
  content: string;
  pinned_at: string;
}

interface PinnedNotesProps {
  isCollapsed: boolean;
}

export function PinnedNotes({ isCollapsed }: PinnedNotesProps) {
  const { user } = useAuth();
  const [pinnedNotes, setPinnedNotes] = useState<PinnedNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    if (!user) return;
    fetchPinnedNotes();
  }, [user]);

  const fetchPinnedNotes = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('pinned_notes')
        .select('*')
        .eq('user_id', user.id)
        .order('pinned_at', { ascending: false })
        .limit(3);

      if (error) throw error;
      setPinnedNotes(data || []);
    } catch (error) {
      console.error('Error fetching pinned notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const addPinnedNote = async () => {
    if (!user || !newNoteContent.trim()) return;

    try {
      const { data, error } = await supabase
        .from('pinned_notes')
        .insert({
          user_id: user.id,
          content: newNoteContent.trim()
        })
        .select()
        .single();

      if (error) throw error;
      setPinnedNotes(notes => [data, ...notes.slice(0, 2)]);
      setNewNoteContent('');
      setIsAdding(false);
    } catch (error) {
      console.error('Error adding pinned note:', error);
    }
  };

  const updatePinnedNote = async (id: string, content: string) => {
    if (!user || !content.trim()) return;

    try {
      const { error } = await supabase
        .from('pinned_notes')
        .update({ content: content.trim() })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      setPinnedNotes(notes => 
        notes.map(note => 
          note.id === id ? { ...note, content: content.trim() } : note
        )
      );
      setEditingId(null);
      setEditContent('');
    } catch (error) {
      console.error('Error updating pinned note:', error);
    }
  };

  const removePinnedNote = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('pinned_notes')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      setPinnedNotes(notes => notes.filter(note => note.id !== id));
    } catch (error) {
      console.error('Error removing pinned note:', error);
    }
  };

  const startEditing = (note: PinnedNote) => {
    setEditingId(note.id);
    setEditContent(note.content);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditContent('');
  };

  if (loading) {
    return (
      <div className={`space-y-2 ${isCollapsed ? 'px-1' : 'px-2'}`}>
        {[...Array(2)].map((_, i) => (
          <div key={i} className="h-8 bg-muted/50 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  if (isCollapsed) {
    return (
      <div className="flex flex-col items-center space-y-1 px-1">
        <Pin className="h-4 w-4 text-primary" />
        <span className="text-xs font-medium">{pinnedNotes.length}</span>
      </div>
    );
  }

  return (
    <div className="space-y-2 px-2">
      {!isAdding && (
        <Button
          variant="ghost"
          size="sm"
          className="w-full h-8 text-xs justify-start"
          onClick={() => setIsAdding(true)}
        >
          <Plus className="h-3 w-3 mr-2" />
          Add note
        </Button>
      )}

      {isAdding && (
        <Card className="border-0 bg-muted/30">
          <CardContent className="p-2">
            <div className="space-y-2">
              <Input
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
                placeholder="Enter note..."
                className="h-8 text-xs"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') addPinnedNote();
                  if (e.key === 'Escape') setIsAdding(false);
                }}
              />
              <div className="flex gap-1">
                <Button size="sm" className="h-6 text-xs px-2" onClick={addPinnedNote}>
                  Save
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="h-6 text-xs px-2" 
                  onClick={() => setIsAdding(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {pinnedNotes.map((note) => (
        <Card key={note.id} className="border-0 bg-muted/30">
          <CardContent className="p-2">
            {editingId === note.id ? (
              <div className="space-y-2">
                <Input
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="h-8 text-xs"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') updatePinnedNote(note.id, editContent);
                    if (e.key === 'Escape') cancelEditing();
                  }}
                />
                <div className="flex gap-1">
                  <Button 
                    size="sm" 
                    className="h-6 text-xs px-2" 
                    onClick={() => updatePinnedNote(note.id, editContent)}
                  >
                    Save
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="h-6 text-xs px-2" 
                    onClick={cancelEditing}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between gap-2">
                <p className="text-xs text-foreground flex-1 leading-relaxed">
                  {note.content}
                </p>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-5 w-5 p-0 opacity-60 hover:opacity-100"
                    onClick={() => startEditing(note)}
                  >
                    <Edit3 className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-5 w-5 p-0 opacity-60 hover:opacity-100"
                    onClick={() => removePinnedNote(note.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      {pinnedNotes.length === 0 && !isAdding && (
        <div className="text-xs text-muted-foreground px-2">
          No pinned notes yet
        </div>
      )}
    </div>
  );
}