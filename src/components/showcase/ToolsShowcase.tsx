import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Calendar as UICalendar } from '@/components/ui/calendar';
import { StickyNote, CheckSquare, Calendar as CalendarIcon, Plus, Minus, Clock, Play, Square } from 'lucide-react';

interface ToolsShowcaseProps {
  className?: string;
}

// A presentational-only showcase that uses our real design components
// but disables interactions. This is used on the landing page instead of a static image.
export function ToolsShowcase({ className }: ToolsShowcaseProps) {
  const today = new Date();

  return (
    <div
      className={cn(
        'pointer-events-none select-none',
        // Make the panel feel large and immersive
        'w-full',
        className
      )}
      aria-hidden
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Quick Note */}
        <Card className="bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <StickyNote className="h-4 w-4 text-primary" />
              Quick Note
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-lg border border-border/60 p-4 bg-muted/40 text-sm leading-relaxed">
              – Draft the kickoff agenda for Monday\n              – Share dashboard links with the team\n              – Prepare quick demo walkthrough
            </div>
            <div className="text-xs text-muted-foreground">Last saved a few minutes ago</div>
          </CardContent>
        </Card>

        {/* Task Counter */}
        <Card className="bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <CheckSquare className="h-4 w-4 text-primary" />
              Task Counter
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="text-3xl font-bold">4</div>
              <div className="text-sm text-muted-foreground">tasks completed today</div>
              <div className="ml-auto flex items-center gap-1 opacity-70">
                <button className="w-6 h-6 grid place-items-center rounded border border-border/60" aria-label="decrement" disabled>
                  <Minus className="h-3 w-3" />
                </button>
                <button className="w-6 h-6 grid place-items-center rounded border border-border/60" aria-label="increment" disabled>
                  <Plus className="h-3 w-3" />
                </button>
              </div>
            </div>
            <div className="mt-4">
              <Progress value={65} className="h-2" />
              <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                <span>Today</span>
                <span>65% complete</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Time Tracker */}
        <Card className="bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock className="h-4 w-4 text-primary" />
              Time Tracker
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="font-mono text-3xl font-semibold tabular-nums">00:42:16</div>
              <div className="text-sm text-muted-foreground">Design review</div>
              <div className="ml-auto flex items-center gap-1 opacity-70">
                <button className="w-6 h-6 grid place-items-center rounded border border-border/60" aria-label="pause" disabled>
                  <Play className="h-3 w-3" />
                </button>
                <button className="w-6 h-6 grid place-items-center rounded border border-border/60" aria-label="stop" disabled>
                  <Square className="h-3 w-3" />
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mini Calendar */}
        <Card className="bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-border/50 lg:col-span-1 sm:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <CalendarIcon className="h-4 w-4 text-primary" />
              Calendar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-border/60 p-2">
              <UICalendar
                mode="single"
                selected={today}
                defaultMonth={today}
                showOutsideDays
                className="pointer-events-none"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
