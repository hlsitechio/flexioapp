import { useState } from 'react';
import { Calendar as CalendarPrimitive } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Clock } from 'lucide-react';

export interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  type?: 'meeting' | 'deadline' | 'event';
}

export interface CalendarProps {
  events?: CalendarEvent[];
  onDateSelect?: (date: Date | undefined) => void;
  className?: string;
  gridSize?: '2x2' | '3x3' | '4x4' | '6x6' | '9x9' | '12x12';
}

export function Calendar({ events = [], onDateSelect, className, gridSize = '4x4' }: CalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    onDateSelect?.(date);
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => 
      event.date.toDateString() === date.toDateString()
    );
  };

  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  // Determine layout based on grid size
  const isCompact = gridSize === '2x2';
  const isSmall = gridSize === '3x3' || gridSize === '2x2';
  const shouldHideEvents = isCompact;
  const shouldCompactHeader = isSmall;

  return (
    <div className={`${className} h-full w-full flex flex-col bg-card rounded-lg border relative`}>
      {/* Title as overlay in top corner */}
      <div className="absolute top-3 left-3 z-10 bg-background/95 backdrop-blur-sm rounded-md px-2 py-1 border shadow-sm">
        <div className={`flex items-center gap-1.5 ${shouldCompactHeader ? 'text-xs' : 'text-sm'} font-medium`}>
          <CalendarDays className={shouldCompactHeader ? "h-3 w-3" : "h-4 w-4"} />
          Calendar
        </div>
      </div>

      {/* Calendar takes full space */}
      <div className="flex-1 w-full flex items-center justify-center p-3">
        <CalendarPrimitive
          mode="single"
          selected={selectedDate}
          onSelect={handleDateSelect}
          className="w-full h-full flex items-center justify-center"
          modifiers={{
            hasEvents: (date) => getEventsForDate(date).length > 0
          }}
          modifiersClassNames={{
            hasEvents: "bg-primary/10 font-semibold"
          }}
          classNames={{
            months: "flex w-full h-full flex-col justify-center",
            month: "w-full h-full flex flex-col justify-center space-y-4",
            caption: `flex justify-center pt-1 relative items-center ${isCompact ? 'text-base mb-2' : 'text-xl font-medium mb-4'}`,
            caption_label: `${isCompact ? 'text-base font-medium' : 'text-xl font-semibold'}`,
            nav: "space-x-1 flex items-center",
            nav_button: `inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground ${isCompact ? 'h-7 w-7' : 'h-8 w-8'}`,
            nav_button_previous: "absolute left-1",
            nav_button_next: "absolute right-1",
            table: "w-full border-collapse",
            head_row: "flex w-full",
            head_cell: `text-muted-foreground rounded-md font-normal flex-1 text-center ${isCompact ? 'text-sm p-1.5' : 'text-base p-3'}`,
            row: "flex w-full",
            cell: `relative text-center flex-1 ${isCompact ? 'text-sm p-0.5' : 'text-base p-1'} focus-within:relative focus-within:z-20`,
            day: `${isCompact ? 'h-10 w-full text-sm' : 'h-14 w-full text-base'} p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground rounded-md transition-colors flex items-center justify-center`,
            day_range_end: "day-range-end",
            day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
            day_today: "bg-accent text-accent-foreground font-semibold ring-2 ring-primary/20",
            day_outside: "text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
            day_disabled: "text-muted-foreground opacity-50",
            day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
            day_hidden: "invisible",
          }}
        />
      </div>
        
      {/* Events section at bottom for larger grids */}
      {!shouldHideEvents && selectedDate && selectedDateEvents.length > 0 && (
        <div className="absolute bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t rounded-b-lg p-3 max-h-32 overflow-hidden">
          <div className="space-y-1">
            <h4 className="text-xs font-medium flex items-center gap-1 text-muted-foreground">
              <Clock className="h-3 w-3" />
              {selectedDate.toLocaleDateString()}
            </h4>
            <div className="space-y-1 max-h-20 overflow-y-auto">
              {selectedDateEvents.slice(0, 2).map(event => (
                <div key={event.id} className="flex items-center justify-between p-1.5 bg-muted/50 rounded text-xs">
                  <span className="truncate">{event.title}</span>
                  {event.type && (
                    <Badge variant="secondary" className="text-xs ml-1 flex-shrink-0 px-1 py-0">
                      {event.type}
                    </Badge>
                  )}
                </div>
              ))}
              {selectedDateEvents.length > 2 && (
                <div className="text-xs text-muted-foreground text-center">
                  +{selectedDateEvents.length - 2} more
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}