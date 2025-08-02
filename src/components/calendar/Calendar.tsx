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
    <Card className={`${className} h-full flex flex-col`}>
      <CardHeader className={shouldCompactHeader ? "pb-2" : ""}>
        <CardTitle className={`flex items-center gap-2 ${shouldCompactHeader ? 'text-base' : 'text-lg'}`}>
          <CalendarDays className={shouldCompactHeader ? "h-4 w-4" : "h-5 w-5"} />
          Calendar{shouldCompactHeader ? "" : " Widget"}
        </CardTitle>
      </CardHeader>
      <CardContent className={`flex-1 flex flex-col ${shouldCompactHeader ? "pt-0" : ""}`}>
        <div className="flex-1 flex items-center justify-center">
          <CalendarPrimitive
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            className={`rounded-md border ${isCompact ? 'scale-90' : ''}`}
            modifiers={{
              hasEvents: (date) => getEventsForDate(date).length > 0
            }}
            modifiersClassNames={{
              hasEvents: "bg-primary/10 font-semibold"
            }}
            classNames={{
              months: "flex w-full flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 flex-1",
              month: "space-y-4 w-full flex flex-col",
              table: "w-full h-full border-collapse",
              head_row: "",
              head_cell: `text-muted-foreground rounded-md w-8 font-normal ${isCompact ? 'text-xs' : 'text-sm'}`,
              row: "flex w-full mt-2",
              cell: `relative p-0 text-center ${isCompact ? 'text-xs' : 'text-sm'} focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected].day-range-end)]:rounded-r-md`,
              day: `h-8 w-8 p-0 font-normal aria-selected:opacity-100 ${isCompact ? 'text-xs' : ''}`,
              day_range_end: "day-range-end",
              day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
              day_today: "bg-accent text-accent-foreground",
              day_outside: "text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
              day_disabled: "text-muted-foreground opacity-50",
              day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
              day_hidden: "invisible",
            }}
          />
        </div>
        
        {!shouldHideEvents && selectedDate && selectedDateEvents.length > 0 && (
          <div className="space-y-2 mt-4">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Events for {selectedDate.toLocaleDateString()}
            </h4>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {selectedDateEvents.map(event => (
                <div key={event.id} className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
                  <span className="text-sm truncate">{event.title}</span>
                  {event.type && (
                    <Badge variant="secondary" className="text-xs ml-2 flex-shrink-0">
                      {event.type}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}