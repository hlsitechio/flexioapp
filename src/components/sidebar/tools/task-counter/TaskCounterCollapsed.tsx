import { CheckSquare } from 'lucide-react';

interface TaskCounterCollapsedProps {
  count: number;
}

export function TaskCounterCollapsed({ count }: TaskCounterCollapsedProps) {
  return (
    <div className="flex justify-center">
      <button 
        className="w-10 h-10 p-0 rounded-lg text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-all cursor-pointer flex items-center justify-center mx-auto"
        title={`${count} tasks`}
      >
        <CheckSquare className="h-4 w-4" />
      </button>
    </div>
  );
}