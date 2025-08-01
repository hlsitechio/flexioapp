import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DashboardMiniCalendarProps {
  className?: string;
}

export function DashboardMiniCalendar({ className }: DashboardMiniCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const today = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  // Get first day of month and number of days
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();
  
  // Get previous month's last few days
  const prevMonth = new Date(year, month - 1, 0);
  const prevMonthDays = prevMonth.getDate();
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setMonth(month + (direction === 'next' ? 1 : -1));
    setCurrentDate(newDate);
  };
  
  const isToday = (day: number) => {
    return today.getDate() === day && 
           today.getMonth() === month && 
           today.getFullYear() === year;
  };
  
  // Generate calendar days
  const calendarDays = [];
  
  // Previous month's days
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    calendarDays.push({
      day: prevMonthDays - i,
      isCurrentMonth: false,
      isToday: false
    });
  }
  
  // Current month's days
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push({
      day,
      isCurrentMonth: true,
      isToday: isToday(day)
    });
  }
  
  // Next month's days to fill the grid
  const remainingCells = 42 - calendarDays.length; // 6 rows × 7 days
  for (let day = 1; day <= remainingCells; day++) {
    calendarDays.push({
      day,
      isCurrentMonth: false,
      isToday: false
    });
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <CalendarIcon className="h-4 w-4" />
            Calendar
          </CardTitle>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateMonth('prev')}
              className="h-7 w-7 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateMonth('next')}
              className="h-7 w-7 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {/* Month and Year */}
        <div className="text-center mb-4">
          <div className="text-lg font-semibold text-foreground">
            {monthNames[month]} {year}
          </div>
        </div>
        
        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {/* Week headers */}
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
            <div key={index} className="text-center text-muted-foreground font-medium p-2 text-sm">
              {day}
            </div>
          ))}
          
          {/* Calendar days */}
          {calendarDays.slice(0, 35).map((day, index) => (
            <div
              key={index}
              className={`
                text-center p-2 rounded-lg cursor-pointer transition-colors text-sm
                ${day.isCurrentMonth 
                  ? 'text-foreground hover:bg-muted' 
                  : 'text-muted-foreground/40'
                }
                ${day.isToday 
                  ? 'bg-blue-500 text-white font-semibold hover:bg-blue-600' 
                  : ''
                }
              `}
            >
              {day.day}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}