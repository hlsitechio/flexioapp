import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const workspaces = [
  { id: 'mkt', name: 'Marketing', color: 'text-primary' },
  { id: 'prd', name: 'Product', color: 'text-accent' },
  { id: 'ops', name: 'Ops', color: 'text-secondary' },
];

export function WorkspaceSwitcherTile({ className }: { className?: string }) {
  const [active, setActive] = React.useState('prd');

  return (
    <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.995 }} className={className}>
      <Card className="border-0 shadow-lg hover:shadow-2xl transition-shadow ring-1 ring-border/40 hover:ring-primary/40 bg-gradient-to-br from-accent/5 via-primary/5 to-secondary/5 dark:from-accent/10 dark:via-primary/10 dark:to-secondary/10">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-base">Workspaces</CardTitle>
          <Badge variant="secondary">Live</Badge>
        </CardHeader>
        <CardContent>
          <div className="relative rounded-md border border-border/50 bg-background/60 p-2 overflow-hidden">
            <motion.div
              className="absolute left-2 right-2 h-8 rounded-md bg-primary/10 will-change-transform"
              layoutId="wsHighlight"
              initial={false}
              style={{ top: 8 }}
              animate={{ y: active === 'mkt' ? 0 : active === 'prd' ? 32 : 64 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
            <div className="relative flex flex-col gap-2">
              {workspaces.map((w) => (
                <button
                  key={w.id}
                  onClick={() => setActive(w.id)}
                  className="flex items-center justify-between gap-2 rounded-md px-2 h-8 text-sm hover:bg-muted/50"
                >
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${w.color.replace('text', 'bg')}`} />
                    <span>{w.name}</span>
                  </div>
                  <motion.span
                    key={active === w.id ? 'on' : 'off-' + w.id}
                    initial={{ opacity: 0, x: 6 }}
                    animate={{ opacity: active === w.id ? 1 : 0, x: active === w.id ? 0 : 6 }}
                    className="text-[10px] text-muted-foreground"
                  >
                    {active === w.id ? 'Active' : ''}
                  </motion.span>
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default WorkspaceSwitcherTile;
