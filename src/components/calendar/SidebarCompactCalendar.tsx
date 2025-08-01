import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar as CalendarIcon } from 'lucide-react';

export function SidebarCompactCalendar() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card className="border-0 bg-muted/30">
      <CardContent className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Mini Calendar</span>
          </div>
          <span className="text-sm text-muted-foreground">
            {formatDate(currentTime)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}