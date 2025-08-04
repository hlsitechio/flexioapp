import { StickyNote } from 'lucide-react';
import { useGenericTool } from '@/hooks/useGenericTool';
import { ToolContainer } from '@/components/shared/ToolContainer';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

interface QuickNoteState {
  content: string;
  lastSaved: string | null;
}

const initialState: QuickNoteState = {
  content: '',
  lastSaved: null,
};

export function QuickNote() {
  const { data: state, updateData: setState } = useGenericTool(initialState, 'quick-note');

  const handleSave = () => {
    setState(prev => ({
      ...prev,
      lastSaved: new Date().toLocaleTimeString(),
    }));
  };

  const handleClear = () => {
    setState({ content: '', lastSaved: null });
  };

  const CollapsedContent = () => (
    <div className="flex flex-col items-center space-y-1">
      <StickyNote className="h-4 w-4 text-primary" />
      <div className="text-xs font-medium text-center">
        {state.content.length}
      </div>
      <div className="text-[10px] text-muted-foreground text-center">
        Notes
      </div>
    </div>
  );

  return (
    <ToolContainer 
      title="Quick Note" 
      icon={StickyNote}
      collapsedContent={<CollapsedContent />}
    >
      <div className="space-y-3">
        <Textarea
          value={state.content}
          onChange={(e) => setState(prev => ({ ...prev, content: e.target.value }))}
          placeholder="Write your quick note here..."
          rows={4}
          className="resize-none"
        />
        
        <div className="flex justify-between items-center">
          <div className="text-xs text-muted-foreground">
            {state.content.length} characters
            {state.lastSaved && (
              <span className="ml-2">• Saved {state.lastSaved}</span>
            )}
          </div>
          
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              disabled={!state.content}
            >
              Clear
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSave}
              disabled={!state.content}
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    </ToolContainer>
  );
}