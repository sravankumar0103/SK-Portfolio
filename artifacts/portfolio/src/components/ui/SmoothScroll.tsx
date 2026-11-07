import React, { useEffect } from 'react';
import Lenis from 'lenis';
import { useReducedMotion } from 'framer-motion';
import { SCROLL_DURATION, scrollEasing, setLenis } from '@/lib/lenis';

interface SmoothScrollProps {
  children: React.ReactNode;
}

export function SmoothScroll({ children }: SmoothScrollProps) {
  // Read once at mount: framer-motion's hook does not subscribe to changes, so
  // flipping the OS setting mid-session applies on the next load.
  const reduce = useReducedMotion();

  useEffect(() => {
    // Reduced motion: no Lenis, so every scroll goes through the native
    // fallbacks in lib/lenis.ts.
    if (reduce) {
      setLenis(null);
      return;
    }

    // Initialize Lenis
    const lenis = new Lenis({
      duration: SCROLL_DURATION,
      easing: scrollEasing,
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      // Increased touch multiplier for more responsive feel on mobile
      touchMultiplier: 2.5,
      // Apply the same smoothing to touch scroll as desktop wheel scroll,
      // instead of falling back to native touch scrolling (Lenis v1 default).
      syncTouch: true,
      syncTouchLerp: 0.075,
      infinite: false,
    });

    setLenis(lenis);

    // RAF loop for Lenis
    let rafId = requestAnimationFrame(function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    });

    // Clean up
    return () => {
      cancelAnimationFrame(rafId);
      setLenis(null);
      lenis.destroy();
    };
  }, [reduce]);

  return <>{children}</>;
}
