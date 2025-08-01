import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LayoutDashboard } from 'lucide-react';
import { Calendar, DatePicker, MiniCalendar, CalendarEvent, CalendarEventType } from '@/components/calendar';
import { useState } from 'react';

export function DashboardWidgets() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  
  // Sample events for demonstration
  const sampleEvents: CalendarEventType[] = [
    {
      id: '1',
      title: 'Team Meeting',
      date: new Date(),
      type: 'meeting'
    },
    {
      id: '2',
      title: 'Project Deadline',
      date: new Date(Date.now() + 86400000), // Tomorrow
      type: 'deadline'
    },
    {
      id: '3',
      title: 'Company Event',
      date: new Date(Date.now() + 172800000), // Day after tomorrow
      type: 'event'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <LayoutDashboard className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-semibold text-foreground">Dashboard Widgets</h2>
      </div>
      <p className="text-muted-foreground text-sm">Components designed for the main dashboard area</p>
      
      {/* Calendar Components Grid */}
      <div className="grid gap-6">
        {/* Full Calendar Widget */}
        <Calendar 
          events={sampleEvents}
          onDateSelect={setSelectedDate}
          className="w-full"
        />
        
        {/* Date Picker Component */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Date Picker Component</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <DatePicker 
                date={selectedDate}
                onDateChange={setSelectedDate}
                placeholder="Select a date"
              />
              
              {selectedDate && (
                <div className="text-sm text-muted-foreground">
                  Selected: {selectedDate.toLocaleDateString()}
                </div>
              )}
            </CardContent>
          </Card>
          
          <MiniCalendar 
            events={sampleEvents}
            onDateSelect={setSelectedDate}
          />
        </div>
        
        {/* Calendar Events */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {sampleEvents.map(event => (
              <CalendarEvent 
                key={event.id} 
                event={event} 
                compact={true}
                showDate={true}
              />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}