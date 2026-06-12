'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GiftAnimationProps {
  show: boolean;
  onClose: () => void;
}

export default function GiftAnimation({ show, onClose }: GiftAnimationProps) {
  const [visible, setVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      setIsOpen(false);
      
      // Open the gift box after 400ms
      const openTimer = setTimeout(() => {
        setIsOpen(true);
      }, 500);

      // Close the modal after 3200ms
      const closeTimer = setTimeout(() => {
        setVisible(false);
        setTimeout(onClose, 300);
      }, 3200);

      return () => {
        clearTimeout(openTimer);
        clearTimeout(closeTimer);
      };
    }
  }, [show, onClose]);

  if (!visible && !show) return null;

  // Generate confetti particles
  const confettiParticles = Array.from({ length: 32 }).map((_, i) => {
    const angle = (i / 32) * 2 * Math.PI + (Math.random() - 0.5) * 0.2;
    const distance = 80 + Math.random() * 100;
    const size = 6 + Math.random() * 8;
    const colors = [
      '#f59e0b', // amber
      '#ef4444', // red
      '#3b82f6', // blue
      '#10b981', // emerald
      '#ec4899', // pink
      '#8b5cf6', // violet
    ];
    const color = colors[i % colors.length];

    return {
      id: i,
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance - 20, // adjust origin to center of box opening
      size,
      color,
      rotation: Math.random() * 360,
    };
  });

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center transition-all duration-300 ${
        show && visible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/55 backdrop-blur-sm"
        onClick={() => {
          setVisible(false);
          setTimeout(onClose, 300);
        }}
      />

      {/* Main Container */}
      <div className="relative flex flex-col items-center justify-center">
        {/* Glow behind the box */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ scale: 0.2, opacity: 0 }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.6, 0.8, 0.6],
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute w-[220px] h-[220px] rounded-full bg-gradient-to-r from-blue-500/30 to-amber-500/30 blur-2xl z-0"
            />
          )}
        </AnimatePresence>

        {/* Gift Box Container */}
        <div className="relative w-[200px] h-[200px] flex items-center justify-center z-10 select-none">
          {/* Confetti Explosion */}
          <AnimatePresence>
            {isOpen && (
              <div className="absolute pointer-events-none inset-0 flex items-center justify-center">
                {confettiParticles.map((particle) => (
                  <motion.div
                    key={particle.id}
                    initial={{ x: 0, y: 0, scale: 0, opacity: 1, rotate: 0 }}
                    animate={{
                      x: particle.x,
                      y: particle.y,
                      scale: [0, 1.2, 0.7, 0],
                      opacity: [1, 1, 0.8, 0],
                      rotate: particle.rotation + 360,
                    }}
                    transition={{
                      duration: 1.5,
                      ease: 'easeOut',
                    }}
                    className="absolute rounded-sm"
                    style={{
                      width: particle.size,
                      height: particle.size,
                      backgroundColor: particle.color,
                    }}
                  />
                ))}
              </div>
            )}
          </AnimatePresence>

          {/* Styled Gift Box */}
          <div className="relative w-36 h-36 flex flex-col items-center justify-end">
            {/* Lid */}
            <motion.div
              initial={{ y: 0, rotate: 0 }}
              animate={
                isOpen
                  ? {
                      y: -36,
                      rotate: -15,
                      x: -12,
                      scale: 1.05,
                      opacity: [1, 0.9, 0],
                    }
                  : { y: 0, rotate: 0 }
              }
              transition={{
                type: 'spring',
                stiffness: 120,
                damping: 12,
              }}
              className="absolute top-[28px] w-[112px] h-[24px] bg-gradient-to-r from-blue-400 to-blue-500 rounded-md shadow-md z-20 flex items-center justify-center"
            >
              {/* Lid Ribbon top */}
              <div className="w-[16px] h-full bg-amber-400" />
              {/* Bow Ribbon */}
              <div className="absolute -top-[16px] w-[32px] h-[16px] flex justify-center">
                <div className="w-[12px] h-[12px] rounded-full border-[3px] border-amber-400 rotate-45 mr-[-4px]" />
                <div className="w-[12px] h-[12px] rounded-full border-[3px] border-amber-400 -rotate-45 ml-[-4px]" />
              </div>
            </motion.div>

            {/* Box Body */}
            <motion.div
              initial={{ scale: 1 }}
              animate={
                isOpen
                  ? {
                      scale: [1, 0.9, 1.08, 1],
                      y: [0, 8, -4, 0],
                    }
                  : { scale: 1 }
              }
              transition={{
                duration: 0.6,
                ease: 'easeInOut',
              }}
              className="relative w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-b-lg shadow-xl overflow-hidden z-10 flex items-center justify-center"
            >
              {/* Ribbon horizontal */}
              <div className="absolute inset-y-0 w-[14px] bg-amber-400" />
              {/* Ribbon vertical */}
              <div className="absolute inset-x-0 h-[14px] bg-amber-400" />
            </motion.div>
          </div>
        </div>

        {/* Modal Caption */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isOpen ? { opacity: 1, y: 0 } : { opacity: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="mt-6 text-center text-white font-bold text-xl tracking-wide drop-shadow-lg"
        >
          🎉 Yêu cầu đã được gửi!
        </motion.div>
      </div>
    </div>
  );
}
