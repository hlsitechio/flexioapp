import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Timer, Play, Pause, RotateCcw, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function DashboardCountdownTimer() {
  const [initialTime, setInitialTime] = useState(300); // 5 minutes default
  const [timeLeft, setTimeLeft] = useState(300);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      intervalId = setInterval(() => {
        setTimeLeft(timeLeft => {
          if (timeLeft <= 1) {
            setIsActive(false);
            return 0;
          }
          return timeLeft - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isActive, timeLeft]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(initialTime);
  };

  const addMinute = () => {
    if (!isActive) {
      const newTime = initialTime + 60;
      setInitialTime(newTime);
      setTimeLeft(newTime);
    }
  };

  const removeMinute = () => {
    if (!isActive && initialTime > 60) {
      const newTime = initialTime - 60;
      setInitialTime(newTime);
      setTimeLeft(newTime);
    }
  };

  const progress = ((initialTime - timeLeft) / initialTime) * 100;
  const isTimeUp = timeLeft === 0;

  return (
    <Card className="animate-fade-in">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Timer className="h-5 w-5 text-primary" />
          Countdown Timer
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center space-y-4">
          <div className={`text-4xl font-bold transition-colors ${
            isTimeUp ? 'text-destructive' : 'text-primary'
          }`}>
            {formatTime(timeLeft)}
          </div>
          
          {/* Progress bar */}
          <div className="w-full bg-secondary rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-1000 ${
                isTimeUp ? 'bg-destructive' : 'bg-primary'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-center gap-2">
            <Button
              onClick={removeMinute}
              size="sm"
              variant="outline"
              className="h-8 w-8 p-0"
              disabled={isActive || initialTime <= 60}
            >
              <Minus className="h-4 w-4" />
            </Button>
            
            <Button
              onClick={toggleTimer}
              size="sm"
              variant={isActive ? "destructive" : "default"}
              className="px-4"
            >
              {isActive ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
              {isActive ? 'Pause' : 'Start'}
            </Button>
            
            <Button
              onClick={addMinute}
              size="sm"
              variant="outline"
              className="h-8 w-8 p-0"
              disabled={isActive}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <Button
            onClick={resetTimer}
            size="sm"
            variant="ghost"
            className="text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}