import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface WelcomeAnimationProps {
  onComplete?: () => void;
  duration?: number;
}

export function WelcomeAnimation({ onComplete, duration = 6000 }: WelcomeAnimationProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  
  const fullText = "Welcome to FlexIO!";
  const letters = fullText.split('');
  const letterDelay = 200; // Fixed delay between letters

  useEffect(() => {
    // Start letter animation immediately
    const letterTimer = setInterval(() => {
      setCurrentLetterIndex(prev => {
        if (prev >= letters.length) {
          clearInterval(letterTimer);
          return prev;
        }
        return prev + 1;
      });
    }, letterDelay);

    // Complete animation after all letters + some viewing time
    const completeTimer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onComplete?.(), 1000); // Add fade out time
    }, letters.length * letterDelay + 2000);

    return () => {
      clearInterval(letterTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete, letters.length]);

  const letterVariants = {
    hidden: { 
      opacity: 0,
      filter: "blur(15px)",
    },
    visible: { 
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.8,
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
      transition: { duration: 1, ease: "easeOut" as const }
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
            <div className="text-6xl md:text-8xl lg:text-9xl font-bold text-white tracking-wider">
              {letters.map((letter, index) => (
                <motion.span
                  key={index}
                  className={letter === ' ' ? 'inline-block w-8' : 'inline-block'}
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