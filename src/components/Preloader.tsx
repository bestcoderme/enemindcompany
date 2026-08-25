import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';

interface PreloaderProps {
  onComplete: () => void;
  logoUrl: string;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete, logoUrl }) => {
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    // Crisp logo entrance duration
    const timer = setTimeout(() => {
      onCompleteRef.current();
    }, 900);

    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      id="preloader-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      onClick={() => onCompleteRef.current()}
      className="fixed inset-0 z-50 flex items-center justify-center bg-white cursor-pointer select-none"
    >
      <div className="relative flex items-center justify-center">
        {/* Subtle breathing glow ring */}
        <motion.div
          animate={{
            scale: [0.92, 1.15, 0.92],
            opacity: [0.15, 0.4, 0.15],
          }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-neutral-200"
        />

        {/* Clean, centered Logo */}
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            duration: 0.45,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="relative z-10 w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden shadow-xl bg-white border border-neutral-100 p-1 flex items-center justify-center"
        >
          <img
            src={logoUrl}
            alt="Logo"
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain rounded-full"
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

