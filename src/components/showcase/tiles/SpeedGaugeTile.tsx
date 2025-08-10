import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function SpeedGaugeTile({ className }: { className?: string }) {
  const [latency, setLatency] = React.useState(18);
  React.useEffect(() => {
    const id = window.setInterval(() => setLatency(Math.max(6, Math.round(6 + Math.random() * 18))), 900);
    return () => window.clearInterval(id);
  }, []);

  return (
    <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.995 }} className={className}>
      <Card className="border-0 shadow-lg hover:shadow-2xl transition-shadow ring-1 ring-border/40 hover:ring-primary/40 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 dark:from-primary/10 dark:via-accent/10 dark:to-secondary/10">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Speed</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="h-3 rounded-full bg-muted/60 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-primary"
                animate={{ width: ['0%', '65%', '100%', '0%'] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Page load</span>
              <motion.span key={latency} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="font-medium text-foreground">
                {latency} ms
              </motion.span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default SpeedGaugeTile;
