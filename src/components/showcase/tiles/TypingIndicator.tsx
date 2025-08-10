import React from 'react';
import { motion } from 'framer-motion';

interface TypingIndicatorProps {
  className?: string;
  size?: number; // height of the dots container
}

export function TypingIndicator({ className, size = 14 }: TypingIndicatorProps) {
  const dots = [0, 1, 2];
  return (
    <div className={"flex items-end gap-1 " + (className ?? '')} style={{ height: size }} aria-hidden="true">
      {dots.map((i) => (
        <motion.span
          key={i}
          initial={{ y: 0, opacity: 0.7 }}
          animate={{ y: [-2, 0, -2] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
          className="w-1.5 h-1.5 rounded-full bg-primary"
        />
      ))}
    </div>
  );
}

export default TypingIndicator;
