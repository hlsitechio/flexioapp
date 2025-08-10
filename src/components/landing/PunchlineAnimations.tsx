import { motion } from 'framer-motion';
import React from 'react';

export type MotionGlyphId = 'realtime' | 'customize' | 'workspace' | 'fast' | 'secure' | 'ai';

interface MotionGlyphProps {
  id: MotionGlyphId;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

const cycles = { repeat: Infinity, repeatType: 'mirror' as const };

export function MotionGlyph({ id, Icon }: MotionGlyphProps) {
  // Subtle, tasteful motion variants tailored to each punchline
  const common = { className: 'h-5 w-5 text-primary mt-0.5' } as const;

  switch (id) {
    case 'realtime':
      return (
        <motion.div initial={{ y: 0 }} animate={{ y: [-1, 1] }} transition={{ duration: 1.2, ...cycles }}>
          <Icon {...common} aria-hidden="true" />
        </motion.div>
      );
    case 'customize':
      return (
        <motion.div initial={{ rotate: -2 }} animate={{ rotate: [0, 3, -3, 0] }} transition={{ duration: 1.6, ...cycles }}>
          <Icon {...common} aria-hidden="true" />
        </motion.div>
      );
    case 'workspace':
      return (
        <motion.div initial={{ scale: 0.98 }} animate={{ scale: [0.98, 1.02, 0.98] }} transition={{ duration: 1.8, ...cycles }}>
          <Icon {...common} aria-hidden="true" />
        </motion.div>
      );
    case 'fast':
      return (
        <motion.div initial={{ x: 0 }} animate={{ x: [-2, 2, -2] }} transition={{ duration: 1.1, ...cycles }}>
          <Icon {...common} aria-hidden="true" />
        </motion.div>
      );
    case 'secure':
      return (
        <motion.div initial={{ scale: 1 }} animate={{ scale: [1, 1.06, 1] }} transition={{ duration: 1.4, ...cycles }}>
          <Icon {...common} aria-hidden="true" />
        </motion.div>
      );
    case 'ai':
      return (
        <motion.div initial={{ opacity: 0.8 }} animate={{ opacity: [0.8, 1, 0.8] }} transition={{ duration: 1.5, ...cycles }}>
          <Icon {...common} aria-hidden="true" />
        </motion.div>
      );
    default:
      return <Icon {...common} aria-hidden="true" />;
  }
}

export default MotionGlyph;
