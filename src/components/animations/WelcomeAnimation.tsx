import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface WelcomeAnimationProps {
  onComplete?: () => void;
  duration?: number;
}

export function WelcomeAnimation({ onComplete, duration = 6000 }: WelcomeAnimationProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onComplete?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  const textVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.8,
      filter: "blur(10px)"
    },
    visible: { 
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: 1,
        ease: "easeOut" as const
      }
    }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.5 }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 1, ease: "easeInOut" as const }
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <div className="text-center">
            <motion.h1
              className="text-6xl md:text-8xl lg:text-9xl font-bold text-white tracking-wider"
              variants={textVariants}
              initial="hidden"
              animate="visible"
            >
              Welcome to FlexIO!
            </motion.h1>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}