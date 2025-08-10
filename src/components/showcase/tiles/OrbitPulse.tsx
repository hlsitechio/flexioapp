import React from 'react';
import { motion } from 'framer-motion';

interface OrbitPulseProps {
  size?: number;
  className?: string;
}

export function OrbitPulse({ size = 18, className }: OrbitPulseProps) {
  const radius = size / 2;
  const dotSize = Math.max(3, Math.floor(size / 6));

  return (
    <div
      className={"relative inline-flex items-center justify-center " + (className ?? '')}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <div className="absolute inset-0 rounded-full border border-primary/30" />
      <motion.div
        className="absolute"
        style={{ width: size, height: size }}
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, ease: 'linear', duration: 2.4 }}
      >
        <div
          className="absolute rounded-full bg-primary"
          style={{ width: dotSize, height: dotSize, top: 0, left: radius - dotSize / 2 }}
        />
      </motion.div>
      <motion.div
        className="absolute inset-[-2px] rounded-full"
        initial={{ boxShadow: '0 0 0 0 hsl(var(--primary) / 0.0)' }}
        animate={{ boxShadow: ['0 0 0 0 hsl(var(--primary) / 0.0)', '0 0 0 6px hsl(var(--primary) / 0.08)', '0 0 0 0 hsl(var(--primary) / 0.0)'] }}
        transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 0.6 }}
      />
    </div>
  );
}

export default OrbitPulse;
