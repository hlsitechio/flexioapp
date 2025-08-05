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
    <Card className="h-full flex items-center justify-center bg-gradient-to-br from-purple-500/20 via-violet-500/10 to-blue-500/20 border-purple-300/30 backdrop-blur-sm">
      <CardContent className="p-6 text-center">
        <div className="space-y-2">
          <div className="text-2xl md:text-3xl font-semibold text-transparent bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text">
            {month}
          </div>
          <div className="text-6xl md:text-7xl font-bold text-transparent bg-gradient-to-br from-purple-600 via-violet-500 to-blue-500 bg-clip-text drop-shadow-lg">
            {day}
          </div>
          <div className="text-2xl md:text-3xl font-semibold text-transparent bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text">
            {year}
          </div>
        </div>
        {/* Decorative gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/5 via-transparent to-violet-500/5 rounded-lg pointer-events-none" />
      </CardContent>
    </Card>
  );
}