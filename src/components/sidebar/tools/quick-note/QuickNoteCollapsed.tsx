import { StickyNote } from 'lucide-react';

interface QuickNoteCollapsedProps {
  note: string;
  onEdit: () => void;
}

export function QuickNoteCollapsed({ note, onEdit }: QuickNoteCollapsedProps) {
  return (
    <div className="flex justify-center">
      <button 
        onClick={onEdit}
        className="w-10 h-10 p-0 rounded-lg text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-all cursor-pointer flex items-center justify-center mx-auto"
        title={note || 'Add note...'}
      >
        <StickyNote className="h-4 w-4" />
      </button>
    </div>
  );
}