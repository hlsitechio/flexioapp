import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';

export function CustomizeControlsTile({ className }: { className?: string }) {
  const [glow, setGlow] = React.useState(true);
  const [vibrancy, setVibrancy] = React.useState(60);

  return (
    <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.995 }} className={className}>
      <Card className="border-0 shadow-lg hover:shadow-2xl transition-shadow ring-1 ring-border/40 hover:ring-primary/40 bg-gradient-to-br from-secondary/5 via-accent/5 to-primary/5 dark:from-secondary/10 dark:via-accent/10 dark:to-primary/10">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Customize Live</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 items-center">
            <div>
              <div className="text-xs mb-1 text-muted-foreground">Vibrancy</div>
              <Slider value={[vibrancy]} onValueChange={(v) => setVibrancy(v[0] ?? 50)} max={100} step={1} />
              <div className="text-[10px] text-muted-foreground mt-1">{vibrancy}%</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-xs text-muted-foreground">Glow</div>
              <Switch checked={glow} onCheckedChange={setGlow} />
            </div>
            <div className="col-span-2">
              <div className="text-xs mb-2 text-muted-foreground">Preview</div>
              <div className="relative h-24 rounded-md border border-border/50 bg-background/60 overflow-hidden">
                <motion.div
                  className="absolute inset-0"
                  style={{ background: 'linear-gradient(135deg, hsl(var(--primary) / 0.3), hsl(var(--accent) / 0.3))' }}
                  animate={{ rotate: [0, 3, -3, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                />
                <motion.div
                  className="absolute inset-0"
                  initial={false}
                  animate={{
                    boxShadow: glow ? `inset 0 0 ${12 + vibrancy / 6}px hsl(var(--primary) / 0.35)` : 'inset 0 0 0 hsl(var(--primary) / 0.0)'
                  }}
                  transition={{ type: 'spring', stiffness: 140, damping: 18 }}
                />
                <motion.div
                  className="absolute right-3 bottom-3 h-8 w-8 rounded-full"
                  style={{ background: 'radial-gradient(circle at 30% 30%, hsl(var(--primary)), hsl(var(--primary) / 0.6))' }}
                  animate={{ scale: 1 + vibrancy / 200, rotate: glow ? [0, 8, -6, 0] : 0 }}
                  transition={{ duration: 3, repeat: glow ? Infinity : 0, ease: 'easeInOut' }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default CustomizeControlsTile;
