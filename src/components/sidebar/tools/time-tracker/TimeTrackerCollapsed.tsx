import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Play } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export function TimeTrackerCollapsed() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Card>
          <CardContent className="p-3 text-center">
            <Clock className="h-6 w-6 mx-auto mb-1" />
            <div className="text-xs font-mono">00:00</div>
          </CardContent>
        </Card>
      </TooltipTrigger>
      <TooltipContent side="right">
        <div className="text-center">
          <div>Time Tracker</div>
          <div className="text-xs text-muted-foreground">Track work sessions</div>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}