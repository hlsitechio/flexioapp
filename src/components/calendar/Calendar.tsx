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
}

export function Calendar({ events = [], onDateSelect, className }: CalendarProps) {
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

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5" />
          Calendar Widget
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <CalendarPrimitive
          mode="single"
          selected={selectedDate}
          onSelect={handleDateSelect}
          className="rounded-md border"
          modifiers={{
            hasEvents: (date) => getEventsForDate(date).length > 0
          }}
          modifiersClassNames={{
            hasEvents: "bg-primary/10 font-semibold"
          }}
        />
        
        {selectedDate && selectedDateEvents.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Events for {selectedDate.toLocaleDateString()}
            </h4>
            <div className="space-y-1">
              {selectedDateEvents.map(event => (
                <div key={event.id} className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
                  <span className="text-sm">{event.title}</span>
                  {event.type && (
                    <Badge variant="secondary" className="text-xs">
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