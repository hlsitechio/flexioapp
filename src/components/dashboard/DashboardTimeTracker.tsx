import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Play, Pause, Square } from 'lucide-react';

export function DashboardTimeTracker() {
  const [isTracking, setIsTracking] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentTask, setCurrentTask] = useState('Development Work');

  const [todayTime] = useState([
    { task: 'Development', time: '3h 24m', color: 'bg-blue-500' },
    { task: 'Design', time: '1h 45m', color: 'bg-green-500' },
    { task: 'Meetings', time: '2h 10m', color: 'bg-orange-500' }
  ]);

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
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Time Tracker
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center space-y-2">
          <div className="text-2xl font-mono font-bold">
            {formatTime(currentTime)}
          </div>
          <Badge variant="outline" className="text-xs">
            {currentTask}
          </Badge>
        </div>
        
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={isTracking ? "destructive" : "default"}
            className="flex-1"
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
            onClick={() => {
              setIsTracking(false);
              setCurrentTime(0);
            }}
          >
            <Square className="h-3 w-3" />
          </Button>
        </div>
        
        <div className="space-y-2">
          <div className="text-xs font-medium">Today's Summary</div>
          {todayTime.map((entry, index) => (
            <div key={index} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${entry.color}`} />
                <span>{entry.task}</span>
              </div>
              <span className="font-mono">{entry.time}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}