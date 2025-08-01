import { Timer } from 'lucide-react';

interface CountdownTimerCollapsedProps {
  isActive: boolean;
  timeLeft: number;
  onToggle: () => void;
}

export function CountdownTimerCollapsed({ isActive, timeLeft, onToggle }: CountdownTimerCollapsedProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex justify-center">
      <button 
        onClick={onToggle} 
        className="w-10 h-10 p-0 rounded-lg text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-all cursor-pointer flex items-center justify-center mx-auto"
        title={`Timer: ${formatTime(timeLeft)}`}
      >
        <Timer className={`h-4 w-4 ${isActive ? 'text-green-500' : ''}`} />
      </button>
    </div>
  );
}