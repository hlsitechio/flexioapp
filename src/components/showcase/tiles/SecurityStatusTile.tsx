import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, CheckCircle2 } from 'lucide-react';
import OrbitPulse from './OrbitPulse';

const events = [
  'RLS enabled',
  'CSP reports monitored',
  '2FA enforced',
];

export function SecurityStatusTile({ className }: { className?: string }) {
  const [idx, setIdx] = React.useState(0);
  React.useEffect(() => {
    const id = window.setInterval(() => setIdx((i) => (i + 1) % events.length), 1200);
    return () => window.clearInterval(id);
  }, []);

  return (
    <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.995 }} className={className}>
      <Card className="border-0 shadow-lg hover:shadow-2xl transition-shadow ring-1 ring-border/40 hover:ring-primary/40 bg-gradient-to-br from-secondary/5 via-primary/5 to-accent/5 dark:from-secondary/10 dark:via-primary/10 dark:to-accent/10">
        <CardHeader className="pb-2 flex items-center justify-between">
          <CardTitle className="text-base">Security</CardTitle>
          <div className="flex items-center gap-2">
            <OrbitPulse />
            <Shield className="h-4 w-4 text-primary" />
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {events.map((e, i) => (
              <li key={e} className="flex items-center gap-2 text-sm">
                <AnimatePresence mode="wait" initial={false}>
                  {idx === i ? (
                    <motion.span key="on" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }}>
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                    </motion.span>
                  ) : (
                    <motion.span key="off" className="h-4 w-4 rounded-full border border-border/60" />
                  )}
                </AnimatePresence>
                <span className={idx === i ? 'text-foreground' : 'text-muted-foreground'}>{e}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default SecurityStatusTile;
