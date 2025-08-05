import { useState } from 'react';
import { Calendar as CalendarPrimitive } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Clock } from 'lucide-react';
import { GridSize } from '@/components/grid-layouts';

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
  gridSize?: GridSize;
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
  const isCompact = gridSize === '2x2' || gridSize?.startsWith('1x');
  const isSmall = gridSize === '3x3' || gridSize === '2x2' || gridSize?.startsWith('1x');
  const shouldHideEvents = isCompact;
  const shouldCompactHeader = isSmall;

  return (
    <div className={`${className} h-full w-full flex flex-col relative overflow-hidden`}>
      {/* Main Calendar Card with Gradient Background */}
      <Card className="h-full bg-gradient-to-br from-purple-500/15 via-violet-500/10 to-blue-500/15 border-purple-300/30 backdrop-blur-sm relative overflow-hidden">
        {/* Decorative gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/5 via-transparent to-violet-600/5 pointer-events-none" />
        
        {/* Header */}
        <CardHeader className={`${shouldCompactHeader ? 'p-3 pb-2' : 'p-4 pb-3'} relative z-10`}>
          <CardTitle className={`flex items-center gap-2 ${shouldCompactHeader ? 'text-sm' : 'text-lg'}`}>
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-purple-500 to-violet-500 shadow-lg">
              <CalendarDays className={`${shouldCompactHeader ? 'h-3 w-3' : 'h-4 w-4'} text-white`} />
            </div>
            <span className="text-transparent bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text font-semibold">
              Calendar
            </span>
          </CardTitle>
        </CardHeader>

        {/* Calendar Body */}
        <CardContent className={`${shouldCompactHeader ? 'p-3 pt-0' : 'p-4 pt-0'} flex-1 relative z-10`}>
          <div className="h-full flex flex-col">
            {/* Calendar Component */}
            <div className="flex-1 min-h-0">
              <CalendarPrimitive
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                className="w-full h-full flex flex-col rounded-lg bg-gradient-to-br from-white/70 via-purple-50/50 to-violet-50/50 border border-purple-200/40 backdrop-blur-sm"
                modifiers={{
                  hasEvents: (date) => getEventsForDate(date).length > 0
                }}
                modifiersClassNames={{
                  hasEvents: "bg-gradient-to-br from-purple-400/30 to-violet-400/30 font-semibold border border-purple-400/50"
                }}
                classNames={{
                  months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 flex-1",
                  month: "space-y-4 flex-1 flex flex-col",
                  caption: "flex justify-center pt-1 relative items-center text-purple-800 font-semibold",
                  caption_label: "text-sm font-medium text-transparent bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text",
                  nav: "space-x-1 flex items-center",
                  nav_button: "h-7 w-7 bg-gradient-to-br from-purple-500/20 to-violet-500/20 hover:from-purple-500/30 hover:to-violet-500/30 border border-purple-300/30 rounded-md flex items-center justify-center text-purple-600 hover:text-purple-700 transition-all duration-200",
                  nav_button_previous: "absolute left-1",
                  nav_button_next: "absolute right-1",
                  table: "w-full border-collapse space-y-1 flex-1",
                  head_row: "flex",
                  head_cell: "text-purple-600/80 rounded-md w-8 font-medium text-[0.8rem] flex items-center justify-center",
                  row: "flex w-full mt-2",
                  cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-gradient-to-br [&:has([aria-selected])]:from-purple-500/20 [&:has([aria-selected])]:to-violet-500/20 [&:has([aria-selected])]:rounded-md [&:has([aria-selected])]:border [&:has([aria-selected])]:border-purple-400/30",
                  day: "h-8 w-8 p-0 font-normal text-purple-800 hover:bg-gradient-to-br hover:from-purple-500/20 hover:to-violet-500/20 hover:text-purple-900 rounded-md transition-all duration-200 border border-transparent hover:border-purple-300/30",
                  day_selected: "bg-gradient-to-br from-purple-500 to-violet-500 text-white hover:bg-gradient-to-br hover:from-purple-600 hover:to-violet-600 hover:text-white focus:bg-gradient-to-br focus:from-purple-500 focus:to-violet-500 focus:text-white shadow-lg border-purple-400/50",
                  day_today: "bg-gradient-to-br from-purple-400/30 to-violet-400/30 text-purple-900 font-semibold border border-purple-400/50",
                  day_outside: "text-purple-400/50 opacity-50",
                  day_disabled: "text-purple-300/30 opacity-30",
                  day_range_middle: "aria-selected:bg-gradient-to-br aria-selected:from-purple-500/30 aria-selected:to-violet-500/30 aria-selected:text-purple-900",
                  day_hidden: "invisible",
                }}
              />
            </div>

            {/* Selected Date Events */}
            {!shouldHideEvents && selectedDate && (
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-3 w-3 text-purple-600" />
                  <span className="text-xs font-medium text-transparent bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text">
                    {selectedDate.toLocaleDateString()}
                  </span>
                </div>
                {selectedDateEvents.length > 0 ? (
                  <div className="space-y-1 max-h-20 overflow-y-auto">
                    {selectedDateEvents.map((event) => (
                      <div
                        key={event.id}
                        className="flex items-center gap-2 p-2 bg-gradient-to-r from-purple-500/10 to-violet-500/10 rounded-md border border-purple-300/20"
                      >
                        <Badge 
                          variant="secondary" 
                          className="bg-gradient-to-r from-purple-500 to-violet-500 text-white text-xs px-1.5 py-0.5"
                        >
                          {event.type || 'event'}
                        </Badge>
                        <span className="text-xs text-purple-800 truncate">{event.title}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-purple-600/70 italic p-2 bg-gradient-to-r from-purple-500/5 to-violet-500/5 rounded-md border border-purple-200/30">
                    No events scheduled
                  </p>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}