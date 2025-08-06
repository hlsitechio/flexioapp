import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Music, Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';

export function DashboardMusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack] = useState({
    title: 'Ambient Focus',
    artist: 'Nature Sounds',
    duration: '4:32',
    progress: 45
  });

  return (
    <Card className="h-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Music className="h-5 w-5" />
          Music Player
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center space-y-1">
          <div className="font-medium text-sm">{currentTrack.title}</div>
          <div className="text-xs text-muted-foreground">{currentTrack.artist}</div>
        </div>
        
        <div className="space-y-2">
          <Progress value={currentTrack.progress} className="h-1" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>2:03</span>
            <span>{currentTrack.duration}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-center gap-3">
          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
            <SkipBack className="h-4 w-4" />
          </Button>
          <Button 
            size="sm" 
            className="h-10 w-10 rounded-full p-0"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? 
              <Pause className="h-4 w-4" /> : 
              <Play className="h-4 w-4" />
            }
          </Button>
          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <Volume2 className="h-4 w-4" />
          <Progress value={70} className="h-1" />
        </div>
      </CardContent>
    </Card>
  );
}