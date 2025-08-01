import { Calendar as CalendarIcon } from 'lucide-react';

interface SidebarCompactCalendarCollapsedProps {
  currentTime: Date;
}

export function SidebarCompactCalendarCollapsed({ currentTime }: SidebarCompactCalendarCollapsedProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="flex justify-center">
      <button 
        className="w-10 h-10 p-0 rounded-lg text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-all cursor-pointer flex items-center justify-center mx-auto"
        title={formatDate(currentTime)}
      >
        <CalendarIcon className="h-4 w-4" />
      </button>
    </div>
  );
}