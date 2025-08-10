import React from 'react';
import { motion } from 'framer-motion';

interface RealtimeSparklineProps {
  className?: string;
  bars?: number;
}

// Lightweight animated sparkline using framer-motion; purely decorative
export function RealtimeSparkline({ className, bars = 10 }: RealtimeSparklineProps) {
  const [values, setValues] = React.useState<number[]>(
    Array.from({ length: bars }, () => 0.3 + Math.random() * 0.6)
  );

  React.useEffect(() => {
    const id = window.setInterval(() => {
      setValues((prev) => {
        const next = [...prev.slice(1), 0.3 + Math.random() * 0.6];
        return next;
      });
    }, 700);
    return () => window.clearInterval(id);
  }, [bars]);

  return (
    <div className={"flex items-end gap-0.5 h-5 " + (className ?? '')} aria-hidden="true">
      {values.map((v, i) => (
        <motion.div
          key={i}
          initial={{ scaleY: 0.25, opacity: 0.9 }}
          animate={{ scaleY: Math.max(0.25, v) }}
          transition={{ type: 'spring', stiffness: 170, damping: 18 }}
          className="w-1 h-full origin-bottom rounded-sm bg-primary/60 dark:bg-primary/70 will-change-transform"
        />
      ))}
    </div>
  );
}

export default RealtimeSparkline;
