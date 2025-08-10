import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RealtimeSparkline } from './RealtimeSparkline';

export function RealtimeKPITile({ className }: { className?: string }) {
  const [kpis, setKpis] = React.useState([
    { label: 'Active Users', value: 1280 },
    { label: 'Conversion', value: 3.4 },
    { label: 'MRR', value: 42.3 },
  ]);

  React.useEffect(() => {
    const id = window.setInterval(() => {
      setKpis((prev) => prev.map((k, i) => ({
        ...k,
        value: parseFloat((k.value + (Math.random() - 0.5) * (i === 0 ? 20 : 0.2)).toFixed(1)),
      })));
    }, 1200);
    return () => window.clearInterval(id);
  }, []);

  return (
    <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.995 }} className={className}>
      <Card className="border-0 shadow-lg hover:shadow-2xl transition-shadow ring-1 ring-border/40 hover:ring-primary/40 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 dark:from-primary/10 dark:via-secondary/10 dark:to-accent/10">
        <CardHeader className="pb-2 flex items-center justify-between">
          <CardTitle className="text-base">Realtime KPIs</CardTitle>
          <RealtimeSparkline />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {kpis.map((k) => (
              <div key={k.label} className="rounded-md border border-border/50 bg-background/60 p-3">
                <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{k.label}</div>
                <motion.div
                  key={k.value}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="text-sm font-semibold"
                >
                  {k.label === 'Conversion' ? `${k.value}%` : k.label === 'MRR' ? `$${k.value}k` : Math.round(k.value)}
                </motion.div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default RealtimeKPITile;
