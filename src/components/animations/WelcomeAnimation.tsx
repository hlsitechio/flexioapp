import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface WelcomeAnimationProps {
  onComplete?: () => void;
  duration?: number;
  children?: React.ReactNode;
}

// Cookie utility functions
const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
};

const setCookie = (name: string, value: string, days: number = 365): void => {
  const expires = new Date();
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
};

const ANIMATION_COOKIE_NAME = 'flexio_welcome_shown';

export function WelcomeAnimation({ onComplete, duration = 6000, children }: WelcomeAnimationProps) {
  const [shouldShowAnimation, setShouldShowAnimation] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const [isDisappearing, setIsDisappearing] = useState(false);
  const [disappearLetterIndex, setDisappearLetterIndex] = useState(0);
  const [showBackground, setShowBackground] = useState(false);
  
  const fullText = "Welcome to FlexIO!";
  const letters = fullText.split('');
  const toWordIndex = fullText.indexOf('to'); // Index 8
  const letterDelay = 80; // Faster delay between letters to reduce total duration

  // Check if animation should be shown on component mount
  useEffect(() => {
    const hasSeenAnimation = getCookie(ANIMATION_COOKIE_NAME);
    
    if (!hasSeenAnimation) {
      setShouldShowAnimation(true);
      setIsVisible(true);
    } else {
      // Skip animation, show content immediately
      setShouldShowAnimation(false);
      setShowBackground(true);
      onComplete?.();
    }
  }, [onComplete]);

  // Animation logic - only runs if shouldShowAnimation is true
  useEffect(() => {
    if (!shouldShowAnimation) return;

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
      // Reveal background immediately when starting fade-out
      setShowBackground(true);
      setIsDisappearing(true);
      
      const disappearTimer = setInterval(() => {
        setDisappearLetterIndex(prev => {
          if (prev >= letters.length) {
            clearInterval(disappearTimer);
            // Complete animation faster with no delay
            setTimeout(() => {
              setIsVisible(false);
              // Set cookie to prevent animation on subsequent visits
              setCookie(ANIMATION_COOKIE_NAME, 'true');
              onComplete?.();
            }, 150);
            return prev;
          }
          return prev + 1;
        });
      }, Math.max(40, Math.floor(letterDelay * 0.6)));

      return () => clearInterval(disappearTimer);
    }, letters.length * letterDelay + 300);

    return () => {
      clearInterval(letterTimer);
      clearTimeout(disappearStartTimer);
    };
  }, [shouldShowAnimation, onComplete, letters.length]);

  const letterVariants = {
    hidden: { 
      opacity: 0,
      filter: "blur(15px)",
    },
    visible: { 
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        duration: 1.2,
        ease: [0.22, 1, 0.36, 1] as const
      }
    },
    disappearing: {
      opacity: 0,
      filter: "blur(15px)",
      transition: {
        duration: 1.2,
        ease: [0.22, 1, 0.36, 1] as const
      }
    }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.5 }
    },
    fading: {
      opacity: 0.3,
      transition: { duration: 0.6, ease: "easeOut" as const }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.8, ease: "easeOut" as const }
    }
  };

  const backgroundVariants = {
    hidden: { 
      opacity: 0,
      scale: 1,
      y: 0
    },
    visible: { 
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { 
        duration: 1.2,
        ease: [0.16, 1, 0.3, 1] as const,
        opacity: { duration: 1.0, ease: "easeOut" }
      }
    }
  };

  return (
    <>
      {/* Background website content */}
      <AnimatePresence>
        {showBackground && children && (
          <motion.div
            className="min-h-screen w-full overflow-x-clip"
            variants={backgroundVariants}
            initial="hidden"
            animate="visible"
            style={{ position: 'relative', zIndex: 1 }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Welcome animation overlay */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black"
            variants={overlayVariants}
            initial="hidden"
            animate={
              isDisappearing && disappearLetterIndex >= toWordIndex 
                ? "fading" 
                : "visible"
            }
            exit="exit"
            style={{ pointerEvents: isDisappearing ? 'none' : 'auto' }}
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
    </>
  );
}