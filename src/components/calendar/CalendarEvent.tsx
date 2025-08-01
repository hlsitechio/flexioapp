import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, Users } from 'lucide-react';
import { CalendarEvent as CalendarEventType } from './Calendar';

interface CalendarEventProps {
  event: CalendarEventType;
  compact?: boolean;
  showDate?: boolean;
}

export function CalendarEvent({ event, compact = false, showDate = false }: CalendarEventProps) {
  const getEventTypeColor = (type?: string) => {
    switch (type) {
      case 'meeting':
        return 'bg-blue-500/10 text-blue-700 border-blue-200';
      case 'deadline':
        return 'bg-red-500/10 text-red-700 border-red-200';
      case 'event':
        return 'bg-green-500/10 text-green-700 border-green-200';
      default:
        return 'bg-gray-500/10 text-gray-700 border-gray-200';
    }
  };

  if (compact) {
    return (
      <div className="flex items-center justify-between p-2 bg-muted/30 rounded-md border">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary"></div>
          <span className="text-sm font-medium truncate">{event.title}</span>
        </div>
        {event.type && (
          <Badge variant="secondary" className="text-xs">
            {event.type}
          </Badge>
        )}
      </div>
    );
  }

  return (
    <div className="p-4 bg-card rounded-lg border shadow-sm space-y-3">
      <div className="flex items-start justify-between">
        <h3 className="font-semibold text-foreground">{event.title}</h3>
        {event.type && (
          <Badge className={getEventTypeColor(event.type)}>
            {event.type}
          </Badge>
        )}
      </div>
      
      {showDate && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          {event.date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </div>
      )}
      
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <Clock className="h-4 w-4" />
          {event.date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
        
        {/* Additional event details can be added here */}
        <div className="flex items-center gap-1">
          <Users className="h-4 w-4" />
          <span>Team</span>
        </div>
      </div>
    </div>
  );
}