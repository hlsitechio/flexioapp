import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Sun, Thermometer } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export function WeatherWidgetCollapsed() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Card className="bg-gradient-to-br from-sky-100 to-blue-100 dark:from-sky-900/20 dark:to-blue-900/20">
          <CardContent className="p-3 text-center">
            <Sun className="h-6 w-6 mx-auto mb-1 text-yellow-500" />
            <div className="text-sm font-bold">22°</div>
          </CardContent>
        </Card>
      </TooltipTrigger>
      <TooltipContent side="right">
        <div className="text-center">
          <div>Weather Widget</div>
          <div className="text-xs text-muted-foreground">22°C • Sunny</div>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}