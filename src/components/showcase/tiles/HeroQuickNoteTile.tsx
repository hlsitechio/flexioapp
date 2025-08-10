import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TypingIndicator from './TypingIndicator';

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
        <div className="relative">
          {/* Animated save progress bar */}
          <AnimatePresence>
            {status === 'editing' && (
              <motion.div
                key="progress"
                className="absolute left-0 right-0 top-0 h-0.5 bg-primary/40"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
              />
            )}
          </AnimatePresence>
        </div>
        <CardHeader className="pb-2 flex items-center justify-between">
          <CardTitle className="text-base">Quick Note</CardTitle>
          <div className="flex items-center gap-2 min-w-[92px] justify-end">
            {status === 'editing' ? (
              <TypingIndicator />
            ) : (
              <AnimatePresence mode="wait" initial={false}>
                {status === 'saved' ? (
                  <motion.div
                    key="saved"
                    className="flex items-center gap-1 text-primary"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="text-xs">Saved</span>
                  </motion.div>
                ) : (
                  <motion.span
                    key="ready"
                    className="text-xs text-muted-foreground"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                  >
                    Ready
                  </motion.span>
                )}
              </AnimatePresence>
            )}
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
