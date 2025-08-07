import { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants, Easing } from 'framer-motion';
import { cn } from '@/lib/utils';

interface WelcomeAnimationProps {
  onComplete?: () => void;
  duration?: number;
}

export function WelcomeAnimation({ onComplete, duration = 4000 }: WelcomeAnimationProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [stage, setStage] = useState(0); // 0: fade in, 1: text effects, 2: fade out

  useEffect(() => {
    const timer1 = setTimeout(() => setStage(1), 500);
    const timer2 = setTimeout(() => setStage(2), duration - 1000);
    const timer3 = setTimeout(() => {
      setIsVisible(false);
      onComplete?.();
    }, duration);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [duration, onComplete]);

  const letterVariants: Variants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.3,
      rotateX: -90
    },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.8,
        ease: [0.6, 0.05, 0.01, 0.9] as Easing,
        type: "spring" as const,
        stiffness: 100
      }
    }),
    glow: {
      textShadow: [
        "0 0 10px rgba(59, 130, 246, 0.5)",
        "0 0 20px rgba(59, 130, 246, 0.8)",
        "0 0 30px rgba(59, 130, 246, 0.6)",
        "0 0 10px rgba(59, 130, 246, 0.3)"
      ],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut"
      }
    }
  };

  const overlayVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.5 }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 1, ease: "easeInOut" as Easing }
    }
  };

  const containerVariants: Variants = {
    hidden: { 
      scale: 0.8,
      opacity: 0
    },
    visible: { 
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut" as Easing
      }
    },
    exit: { 
      scale: 1.1,
      opacity: 0,
      y: -50,
      transition: { 
        duration: 1,
        ease: "easeInOut" as Easing
      }
    }
  };

  const welcomeText = "Welcome to";
  const flexioText = "FlexIO";

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Animated background particles */}
          <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: 50 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-blue-400/30 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -100, 0],
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0]
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>

          {/* Main content container */}
          <motion.div
            className="text-center space-y-8 px-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Welcome to */}
            <div className="space-y-2">
              <motion.div className="flex justify-center space-x-2">
                {welcomeText.split('').map((letter, index) => (
                  <motion.span
                    key={index}
                    className={cn(
                      "text-4xl md:text-6xl lg:text-7xl font-light text-white/90",
                      letter === ' ' ? 'w-4' : ''
                    )}
                    custom={index}
                    variants={letterVariants}
                    initial="hidden"
                    animate={stage >= 1 ? ["visible", "glow"] : "visible"}
                  >
                    {letter === ' ' ? '\u00A0' : letter}
                  </motion.span>
                ))}
              </motion.div>

              {/* FlexIO - Hero text */}
              <motion.div 
                className="relative"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  transition: { delay: 1.5, duration: 1, ease: "easeOut" }
                }}
              >
                <motion.h1
                  className="text-6xl md:text-8xl lg:text-9xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 bg-clip-text text-transparent"
                  animate={stage >= 1 ? {
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                    transition: {
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear"
                    }
                  } : {}}
                  style={{
                    backgroundSize: "200% 200%"
                  }}
                >
                  {flexioText}
                </motion.h1>

                {/* Glow effect behind FlexIO */}
                <motion.div
                  className="absolute inset-0 text-6xl md:text-8xl lg:text-9xl font-bold text-blue-400/20 blur-xl"
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.2, 0.4, 0.2]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  {flexioText}
                </motion.div>
              </motion.div>
            </div>

            {/* Subtitle */}
            <motion.p
              className="text-xl md:text-2xl text-white/70 font-light tracking-wide"
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                transition: { delay: 2, duration: 0.8 }
              }}
            >
              Your productivity journey begins here
            </motion.p>

            {/* Loading indicator */}
            <motion.div
              className="flex justify-center space-x-2 mt-12"
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: 1,
                transition: { delay: 2.5, duration: 0.5 }
              }}
            >
              {Array.from({ length: 3 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="w-3 h-3 bg-blue-400 rounded-full"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </motion.div>

            {/* Progress bar */}
            <motion.div
              className="w-64 h-1 bg-white/10 rounded-full mx-auto overflow-hidden"
              initial={{ opacity: 0, width: 0 }}
              animate={{ 
                opacity: 1, 
                width: 256,
                transition: { delay: 2.8, duration: 0.5 }
              }}
            >
              <motion.div
                className="h-full bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"
                initial={{ width: "0%" }}
                animate={{ 
                  width: "100%",
                  transition: { 
                    delay: 3,
                    duration: duration / 1000 - 3,
                    ease: "easeInOut"
                  }
                }}
              />
            </motion.div>
          </motion.div>

          {/* Corner decorations */}
          <motion.div
            className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-blue-400/30"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              transition: { delay: 1, duration: 0.5 }
            }}
          />
          <motion.div
            className="absolute top-8 right-8 w-16 h-16 border-r-2 border-t-2 border-blue-400/30"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              transition: { delay: 1.2, duration: 0.5 }
            }}
          />
          <motion.div
            className="absolute bottom-8 left-8 w-16 h-16 border-l-2 border-b-2 border-blue-400/30"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              transition: { delay: 1.4, duration: 0.5 }
            }}
          />
          <motion.div
            className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 border-blue-400/30"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              transition: { delay: 1.6, duration: 0.5 }
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}