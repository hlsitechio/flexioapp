import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Timer } from 'lucide-react';

export function CountdownTimer() {
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

  return (
    <Card className="border-0 bg-muted/30">
      <CardContent className="p-3">
        <div className="flex items-center gap-2">
          <button onClick={toggleTimer} className="hover:scale-110 transition-transform">
            <Timer className={`h-4 w-4 ${isActive ? 'text-green-500' : 'text-primary'}`} />
          </button>
          <span className="text-sm font-medium text-foreground">
            {formatTime(timeLeft)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}