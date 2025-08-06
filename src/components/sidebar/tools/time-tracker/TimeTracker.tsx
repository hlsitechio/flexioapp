import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Play, Pause, Square } from 'lucide-react';

export function TimeTracker() {
  const [isTracking, setIsTracking] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentTask] = useState('Work Session');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTracking) {
      interval = setInterval(() => {
        setCurrentTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTracking]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Time Tracker
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-center space-y-1">
          <div className="text-lg font-mono font-bold">
            {formatTime(currentTime)}
          </div>
          <Badge variant="outline" className="text-xs">
            {currentTask}
          </Badge>
        </div>
        
        <div className="flex gap-1">
          <Button
            size="sm"
            variant={isTracking ? "destructive" : "default"}
            className="flex-1 text-xs"
            onClick={() => setIsTracking(!isTracking)}
          >
            {isTracking ? (
              <><Pause className="h-3 w-3 mr-1" /> Pause</>
            ) : (
              <><Play className="h-3 w-3 mr-1" /> Start</>
            )}
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="px-2"
            onClick={() => {
              setIsTracking(false);
              setCurrentTime(0);
            }}
          >
            <Square className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}