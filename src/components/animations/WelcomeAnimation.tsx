import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface WelcomeAnimationProps {
  onComplete?: () => void;
  duration?: number;
}

export function WelcomeAnimation({ onComplete, duration = 8000 }: WelcomeAnimationProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [currentWord, setCurrentWord] = useState(0);
  
  const words = ["Welcome", "to", "FlexIO"];
  const wordDuration = duration / words.length;

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];

    // Schedule word transitions
    words.forEach((_, index) => {
      if (index < words.length - 1) {
        timers.push(
          setTimeout(() => setCurrentWord(index + 1), (index + 1) * wordDuration)
        );
      }
    });

    // Schedule completion
    timers.push(
      setTimeout(() => {
        setIsVisible(false);
        onComplete?.();
      }, duration)
    );

    return () => timers.forEach(clearTimeout);
  }, [duration, onComplete]);

  const textVariants = {
    hidden: { 
      opacity: 0,
      y: 20,
      filter: "blur(10px)",
      textShadow: "0 0 0px rgba(255, 255, 255, 0)"
    },
    visible: { 
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      textShadow: [
        "0 0 20px rgba(255, 255, 255, 0.3)",
        "0 0 40px rgba(255, 255, 255, 0.2)",
        "0 0 60px rgba(255, 255, 255, 0.1)"
      ],
      transition: {
        duration: 2,
        ease: "easeOut" as const,
        textShadow: {
          duration: 3,
          repeat: Infinity,
          repeatType: "reverse" as const,
          ease: "easeInOut" as const
        }
      }
    },
    exit: { 
      opacity: 0,
      y: -20,
      filter: "blur(10px)",
      textShadow: "0 0 0px rgba(255, 255, 255, 0)",
      transition: { 
        duration: 2,
        ease: "easeIn" as const
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
      transition: { duration: 2, ease: "easeInOut" as const }
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
          {/* Simple text sequence */}
          <div className="text-center">
            <AnimatePresence mode="wait">
              <motion.h1
                key={currentWord}
                className="text-6xl md:text-8xl lg:text-9xl font-bold text-white"
                variants={textVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {words[currentWord]}
              </motion.h1>
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}