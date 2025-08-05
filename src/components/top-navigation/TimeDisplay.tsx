import { useState, useEffect } from 'react';
import { useSettings } from '@/contexts/SettingsContext';

export function TimeDisplay() {
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Safely get settings with fallback defaults
  let settings;
  try {
    settings = useSettings();
  } catch (error) {
    // Fallback to default settings if context is not available
    settings = {
      showSeconds: true,
      showDate: true,
      showYear: true,
      use24HourFormat: false
    };
  }
  
  const { showSeconds, showDate, showYear, use24HourFormat } = settings;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, showSeconds ? 1000 : 60000); // Update every second if showing seconds, otherwise every minute

    return () => clearInterval(timer);
  }, [showSeconds]);

  const formatTime = (date: Date) => {
    // Optimize by avoiding object creation on every render
    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      hour12: !use24HourFormat
    };
    
    if (showSeconds) {
      timeOptions.second = '2-digit';
    }
    
    const dateOptions: Intl.DateTimeFormatOptions = {};
    
    if (showDate) {
      dateOptions.weekday = 'long';
      dateOptions.month = 'long';
      dateOptions.day = 'numeric';
      
      if (showYear) {
        dateOptions.year = 'numeric';
      }
    }
    
    // Format time and date separately for better performance
    const timeString = date.toLocaleTimeString('en-US', timeOptions);
    const dateString = showDate ? date.toLocaleDateString('en-US', dateOptions) : '';
    
    return showDate ? `${dateString}, ${timeString}` : timeString;
  };

  return (
    <div className="text-sm text-muted-foreground font-mono bg-muted/50 px-3 py-1 rounded-lg border border-border/50">
      {formatTime(currentTime)}
    </div>
  );
}