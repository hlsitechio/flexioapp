import { useState, useEffect } from 'react';
import { Edit3, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TopNavigationProps {
  editMode: boolean;
  setEditMode: (editMode: boolean) => void;
}

export function TopNavigation({ editMode, setEditMode }: TopNavigationProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <header className="h-16 bg-card/80 backdrop-blur-xl border-b border-border/50 flex items-center justify-between px-6 animate-fade-in">
      <div className="flex items-center space-x-4">
        <div className="text-lg font-medium text-foreground">
          Premium Dashboard
        </div>
      </div>

      <div className="flex items-center space-x-6">
        {/* System Time */}
        <div className="text-sm text-muted-foreground font-mono bg-muted/50 px-3 py-1 rounded-lg border border-border/50">
          {formatTime(currentTime)}
        </div>

        {/* Edit Mode Toggle */}
        <Button
          variant={editMode ? "default" : "outline"}
          size="sm"
          onClick={() => setEditMode(!editMode)}
          className={`transition-all duration-300 ${
            editMode 
              ? 'button-premium glow' 
              : 'hover:shadow-md'
          }`}
        >
          {editMode ? (
            <>
              <Eye className="h-4 w-4 mr-2" />
              View Mode
            </>
          ) : (
            <>
              <Edit3 className="h-4 w-4 mr-2" />
              Edit Mode
            </>
          )}
        </Button>
      </div>
    </header>
  );
}