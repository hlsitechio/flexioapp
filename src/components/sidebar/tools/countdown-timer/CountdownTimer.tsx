import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Timer, Plus, Minus } from 'lucide-react';
import { useSidebar } from '@/components/ui/sidebar';
import { CountdownTimerCollapsed } from './CountdownTimerCollapsed';

export function CountdownTimer() {
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';
  const [initialTime, setInitialTime] = useState(25 * 60); // 25 minutes in seconds
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const addMinute = () => {
    if (!isActive) {
      const newTime = initialTime + 60; // Add 1 minute
      setInitialTime(newTime);
      setTimeLeft(newTime);
    }
  };

  const removeMinute = () => {
    if (!isActive && initialTime > 60) { // Don't go below 1 minute
      const newTime = initialTime - 60; // Remove 1 minute
      setInitialTime(newTime);
      setTimeLeft(newTime);
    }
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(initialTime);
  };

  if (isCollapsed) {
    return (
      <CountdownTimerCollapsed 
        isActive={isActive}
        timeLeft={timeLeft}
        onToggle={toggleTimer}
      />
    );
  }

  return (
    <Card className="border-0 bg-muted/30">
      <CardContent className="p-3">
        <div className="flex items-center gap-2">
          <button onClick={toggleTimer} className="hover:scale-110 transition-transform">
            <Timer className={`h-4 w-4 ${isActive ? 'text-green-500' : 'text-primary'}`} />
          </button>
          <button 
            onClick={resetTimer}
            className="text-sm font-medium text-foreground hover:text-primary transition-colors flex-1 text-left"
          >
            {formatTime(timeLeft)}
          </button>
          <div className="ml-auto flex gap-1">
            <button 
              onClick={removeMinute}
              disabled={isActive || initialTime <= 60}
              className="w-5 h-5 flex items-center justify-center rounded hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Minus className="h-3 w-3" />
            </button>
            <button 
              onClick={addMinute}
              disabled={isActive}
              className="w-5 h-5 flex items-center justify-center rounded hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}