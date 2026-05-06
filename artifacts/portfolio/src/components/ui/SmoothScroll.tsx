import React, { useEffect } from 'react';
import Lenis from 'lenis';

interface SmoothScrollProps {
  children: React.ReactNode;
}

export function SmoothScroll({ children }: SmoothScrollProps) {
  useEffect(() => {
    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      // Increased touch multiplier for more responsive feel on mobile
      touchMultiplier: 2.5,
      infinite: false,
    });

    // RAF loop for Lenis
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Clean up
    return () => {
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
