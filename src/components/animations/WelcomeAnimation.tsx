import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface WelcomeAnimationProps {
  onComplete?: () => void;
  duration?: number;
}

export function WelcomeAnimation({ onComplete, duration = 6000 }: WelcomeAnimationProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const [isDisappearing, setIsDisappearing] = useState(false);
  const [disappearLetterIndex, setDisappearLetterIndex] = useState(0);
  
  const fullText = "Welcome to FlexIO!";
  const letters = fullText.split('');
  const letterDelay = 150; // Slower delay between letters

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

    // Start disappearing animation after viewing time
    const disappearStartTimer = setTimeout(() => {
      setIsDisappearing(true);
      
      const disappearTimer = setInterval(() => {
        setDisappearLetterIndex(prev => {
          if (prev >= letters.length) {
            clearInterval(disappearTimer);
            // Complete animation after all letters disappeared
            setTimeout(() => {
              setIsVisible(false);
              onComplete?.();
            }, 500);
            return prev;
          }
          return prev + 1;
        });
      }, letterDelay);

      return () => clearInterval(disappearTimer);
    }, letters.length * letterDelay + 2000);

    return () => {
      clearInterval(letterTimer);
      clearTimeout(disappearStartTimer);
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
        duration: 1.5,
        ease: [0.25, 0.1, 0.25, 1] as const
      }
    },
    disappearing: {
      opacity: 0,
      filter: "blur(15px)",
      transition: {
        duration: 1.5,
        ease: [0.25, 0.1, 0.25, 1] as const
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
                  animate={
                    isDisappearing 
                      ? (index < disappearLetterIndex ? "disappearing" : "visible")
                      : (index < currentLetterIndex ? "visible" : "hidden")
                  }
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