import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

export function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 25, stiffness: 150 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isVisible]);

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-primary/50 pointer-events-none z-[9999] hidden md:block"
        style={{
          translateX: cursorXSpring,
          translateY: cursorYSpring,
          x: '-50%',
          y: '-50%',
          opacity: isVisible ? 1 : 0,
        }}
      />
      <motion.div
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-primary pointer-events-none z-[9999] hidden md:block"
        style={{
          translateX: cursorX,
          translateY: cursorY,
          x: '-50%',
          y: '-50%',
          opacity: isVisible ? 1 : 0,
        }}
      />
    </>
  );
}
