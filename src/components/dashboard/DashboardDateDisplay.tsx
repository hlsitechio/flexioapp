
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock } from 'lucide-react';

export function DashboardDateDisplay() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <Card className="h-full bg-gradient-to-br from-pink-100 to-rose-100 dark:from-pink-900/20 dark:to-rose-900/20 animate-fade-in">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calendar className="h-5 w-5 text-pink-600 dark:text-pink-400" />
          Date & Time
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center space-y-4">
          <div>
            <p className="text-lg font-semibold text-primary mb-1">
              {getGreeting()}
            </p>
            <p className="text-sm text-muted-foreground">
              {formatDate(currentTime)}
            </p>
          </div>
          
          <div className="flex items-center justify-center gap-2 p-3 bg-background/50 rounded-md border border-border/50">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-lg font-mono font-semibold text-foreground">
              {formatTime(currentTime)}
            </span>
          </div>
          
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-xs text-muted-foreground">Day</p>
              <p className="text-sm font-semibold">{currentTime.getDate()}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Month</p>
              <p className="text-sm font-semibold">{currentTime.getMonth() + 1}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Year</p>
              <p className="text-sm font-semibold">{currentTime.getFullYear()}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
