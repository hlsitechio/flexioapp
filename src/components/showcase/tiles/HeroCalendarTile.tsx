import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import OrbitPulse from './OrbitPulse';
import { Calendar as UICalendar } from '@/components/ui/calendar';

interface HeroCalendarTileProps {
  date: Date | undefined;
  onDateChange: (d?: Date) => void;
  className?: string;
}

export function HeroCalendarTile({ date, onDateChange, className }: HeroCalendarTileProps) {
  const [ping, setPing] = React.useState(false);
  const lastValueRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    const nextVal = date?.getTime() ?? null;
    if (nextVal !== lastValueRef.current) {
      lastValueRef.current = nextVal;
      if (nextVal) {
        setPing(true);
        const id = window.setTimeout(() => setPing(false), 700);
        return () => window.clearTimeout(id);
      }
    }
  }, [date]);

  return (
    <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.995 }} className={className}>
      <Card className="border-0 shadow-lg hover:shadow-2xl transition-shadow ring-1 ring-border/40 hover:ring-primary/40 bg-gradient-to-br from-secondary/5 via-primary/5 to-accent/5 dark:from-secondary/10 dark:via-primary/10 dark:to-accent/10">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-base">Calendar</CardTitle>
          <div className="relative">
            <OrbitPulse />
            <AnimatePresence>
              {ping && (
                <motion.span
                  key="ping"
                  className="absolute inset-[-6px] rounded-full border border-primary/30"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.2 }}
                  transition={{ duration: 0.5 }}
                />
              )}
            </AnimatePresence>
          </div>
        </CardHeader>
        <CardContent>
          <UICalendar
            mode="single"
            selected={date}
            onSelect={onDateChange}
            initialFocus
            className="p-3 pointer-events-auto"
          />
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default HeroCalendarTile;
