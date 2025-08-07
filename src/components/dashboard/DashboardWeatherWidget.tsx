import React, { useState } from 'react';
import { WidgetShell } from './WidgetShell';
import { Cloud, Sun, CloudRain, Snowflake, Wind, MapPin } from 'lucide-react';

export function DashboardWeatherWidget() {
  const [weather] = useState({
    temp: 22,
    condition: 'sunny',
    location: 'Your Location',
    humidity: 65,
    windSpeed: 12
  });

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sunny': return <Sun className="h-8 w-8 text-primary" aria-hidden />;
      case 'cloudy': return <Cloud className="h-8 w-8 text-muted-foreground" aria-hidden />;
      case 'rainy': return <CloudRain className="h-8 w-8 text-accent" aria-hidden />;
      case 'snowy': return <Snowflake className="h-8 w-8 text-foreground/60" aria-hidden />;
      default: return <Sun className="h-8 w-8 text-primary" aria-hidden />;
    }
  };

  return (
    <WidgetShell
      title="Weather"
      icon={getWeatherIcon(weather.condition)}
      subtitle={
        <span className="inline-flex items-center gap-1">
          <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-muted-foreground">{weather.location}</span>
        </span>
      }
      variant="accent"
      size="md"
    >
      <div className="space-y-4 animate-fade-in">
        <div className="text-center">
          <div className="text-3xl font-bold tabular-nums">{weather.temp}°C</div>
          <div className="text-sm text-muted-foreground capitalize">{weather.condition}</div>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Cloud className="h-4 w-4 text-muted-foreground" />
            <span className="text-foreground/80">{weather.humidity}%</span>
          </div>
          <div className="flex items-center gap-1">
            <Wind className="h-4 w-4 text-muted-foreground" />
            <span className="text-foreground/80">{weather.windSpeed} km/h</span>
          </div>
        </div>
      </div>
    </WidgetShell>
  );
}
