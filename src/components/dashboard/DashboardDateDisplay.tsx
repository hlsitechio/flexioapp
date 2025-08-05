import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';

export function DashboardDateDisplay() {
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000); // Update every second to keep it current

    return () => clearInterval(timer);
  }, []);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const month = monthNames[currentDate.getMonth()];
  const day = currentDate.getDate();
  const year = currentDate.getFullYear();

  return (
    <Card className="h-full flex items-center justify-center bg-gradient-to-br from-card to-card/80 border-border/50">
      <CardContent className="p-6 text-center">
        <div className="space-y-2">
          <div className="text-2xl md:text-3xl font-semibold text-foreground">
            {month}
          </div>
          <div className="text-6xl md:text-7xl font-bold text-primary">
            {day}
          </div>
          <div className="text-2xl md:text-3xl font-semibold text-muted-foreground">
            {year}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}