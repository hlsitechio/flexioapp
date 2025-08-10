import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';
import TypingIndicator from './TypingIndicator';

const INSIGHTS = [
  'Spike in organic traffic — +18% WoW',
  'Top converting segment: US • Mobile • New',
  'Reduce bounce on pricing: test sticky CTA',
];

export function AIInsightsTile({ className }: { className?: string }) {
  const [status, setStatus] = React.useState<'thinking' | 'ready'>('thinking');
  const [idx, setIdx] = React.useState(0);

  React.useEffect(() => {
    const id = window.setInterval(() => {
      setStatus((s) => (s === 'thinking' ? 'ready' : 'thinking'));
      setIdx((i) => (i + 1) % INSIGHTS.length);
    }, 2200);
    return () => window.clearInterval(id);
  }, []);

  return (
    <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.995 }} className={className}>
      <Card className="border-0 shadow-lg hover:shadow-2xl transition-shadow ring-1 ring-border/40 hover:ring-primary/40 bg-gradient-to-br from-accent/5 via-secondary/5 to-primary/5 dark:from-accent/10 dark:via-secondary/10 dark:to-primary/10">
        <CardHeader className="pb-2 flex items-center justify-between">
          <CardTitle className="text-base">AI Insights</CardTitle>
          <Sparkles className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-border/50 bg-background/60 p-3">
            <AnimatePresence mode="wait" initial={false}>
              {status === 'thinking' ? (
                <motion.div key="thinking" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                  <TypingIndicator />
                  <span className="text-xs text-muted-foreground">Analyzing data…</span>
                </motion.div>
              ) : (
                <motion.div key="ready" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="text-sm">
                  {INSIGHTS[idx]}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default AIInsightsTile;
