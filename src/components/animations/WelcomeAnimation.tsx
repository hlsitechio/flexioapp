import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface WelcomeAnimationProps {
  onComplete?: () => void;
  duration?: number;
}

export function WelcomeAnimation({ onComplete, duration = 9000 }: WelcomeAnimationProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  
  const fullText = "Welcome to FlexIO";
  const letters = fullText.split('');
  const letterDelay = duration / letters.length;

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];

    // Schedule letter transitions
    letters.forEach((_, index) => {
      timers.push(
        setTimeout(() => setCurrentLetterIndex(index + 1), index * letterDelay)
      );
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

  const letterVariants = {
    hidden: { 
      opacity: 0,
      filter: "blur(20px)",
      textShadow: "0 0 0px rgba(255, 255, 255, 0)"
    },
    visible: (i: number) => ({ 
      opacity: 1,
      filter: "blur(0px)",
      textShadow: [
        "0 0 20px rgba(255, 255, 255, 0.3)",
        "0 0 40px rgba(255, 255, 255, 0.2)",
        "0 0 60px rgba(255, 255, 255, 0.1)"
      ],
      transition: {
        delay: i * (letterDelay / 1000),
        duration: 1.5,
        ease: "easeOut" as const,
        textShadow: {
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse" as const,
          ease: "easeInOut" as const
        }
      }
    })
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
          {/* Letter by letter animation */}
          <div className="text-center">
            <div className="text-6xl md:text-8xl lg:text-9xl font-bold text-white tracking-wider">
              {letters.map((letter, index) => (
                <motion.span
                  key={index}
                  className={letter === ' ' ? 'inline-block w-8' : 'inline-block'}
                  custom={index}
                  variants={letterVariants}
                  initial="hidden"
                  animate={index < currentLetterIndex ? "visible" : "hidden"}
                >
                  {letter === ' ' ? '\u00A0' : letter}
                </motion.span>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}