import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import RealtimeSparkline from './RealtimeSparkline';

interface HeroQuickNoteTileProps {
  note: string;
  onNoteChange: (value: string) => void;
  className?: string;
}

export function HeroQuickNoteTile({ note, onNoteChange, className }: HeroQuickNoteTileProps) {
  const [status, setStatus] = React.useState<'idle' | 'editing' | 'saved'>('idle');
  const timerRef = React.useRef<number | null>(null);

  const handleChange = (val: string) => {
    onNoteChange(val);
    setStatus('editing');
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setStatus('saved'), 700);
  };

  React.useEffect(() => () => { if (timerRef.current) window.clearTimeout(timerRef.current); }, []);

  return (
    <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.995 }} className={className}>
      <Card className="border-0 shadow-lg hover:shadow-2xl transition-shadow ring-1 ring-border/40 hover:ring-primary/40 bg-gradient-to-br from-accent/5 via-secondary/5 to-primary/5 dark:from-accent/10 dark:via-secondary/10 dark:to-primary/10">
        <CardHeader className="pb-2 flex items-center justify-between">
          <CardTitle className="text-base">Quick Note</CardTitle>
          <div className="flex items-center gap-2">
            <RealtimeSparkline />
            <div className="text-xs text-muted-foreground min-w-[72px] text-right">
              <AnimatePresence mode="wait">
                {status === 'editing' ? (
                  <motion.span key="editing" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}>
                    Editing…
                  </motion.span>
                ) : status === 'saved' ? (
                  <motion.span key="saved" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}>
                    Saved
                  </motion.span>
                ) : (
                  <motion.span key="idle" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}>
                    Ready
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <textarea
            value={note}
            onChange={(e) => handleChange(e.target.value)}
            className="w-full h-28 resize-none rounded-md border border-border/50 bg-background p-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-transparent transition-shadow"
            placeholder="Type a quick note..."
            aria-label="Quick note editor"
          />
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default HeroQuickNoteTile;
