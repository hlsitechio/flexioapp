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
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {};
    
    // Add date components if enabled
    if (showDate) {
      options.weekday = 'long';
      options.month = 'long';
      options.day = 'numeric';
    }
    
    if (showYear && showDate) {
      options.year = 'numeric';
    }
    
    // Add time components
    options.hour = '2-digit';
    options.minute = '2-digit';
    
    if (showSeconds) {
      options.second = '2-digit';
    }
    
    // Set 12/24 hour format
    if (use24HourFormat) {
      options.hour12 = false;
    } else {
      options.hour12 = true;
    }
    
    return date.toLocaleString('en-US', options);
  };

  return (
    <div className="text-sm text-muted-foreground font-mono bg-muted/50 px-3 py-1 rounded-lg border border-border/50">
      {formatTime(currentTime)}
    </div>
  );
}