import type { MotionProps } from 'framer-motion';

// DESIGN_UPGRADE.md §1 "Hover / micro".
export const EASE_OUT_QUINT = [0.22, 1, 0.36, 1] as const;
// DESIGN_UPGRADE.md §1 "Reveals on scroll". CSS uses the same curve as --ease-out-expo.
export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

// Counts as "in view" only while the element is inside the middle 40% of the viewport.
export const VIEWPORT_CENTER_MARGIN = '-30% 0px -30% 0px';

/** A list row scaling in as it reaches the centre of the viewport (Experience, Projects). */
export const rowEnter = {
  initial: { opacity: 1, y: 0, scale: 0.95 },
  whileInView: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.9, ease: EASE_OUT_QUINT },
  },
  viewport: { once: false, margin: VIEWPORT_CENTER_MARGIN },
} satisfies MotionProps;

/** A description opening to its full height as its row reaches the centre (Experience, Projects). */
export const expandOnView = {
  initial: { height: 0, opacity: 0 },
  whileInView: { height: 'auto', opacity: 1 },
  viewport: { once: false, margin: VIEWPORT_CENTER_MARGIN },
  transition: {
    height: { duration: 0.8, ease: EASE_OUT_QUINT },
    opacity: { duration: 0.5, delay: 0.2 },
  },
} satisfies MotionProps;

/** A chip sliding in from the right as it reaches the centre (Certifications, Projects). */
export function slideInFromRight(delay: number): MotionProps {
  return {
    initial: { opacity: 0, x: 20 },
    whileInView: { opacity: 1, x: 0 },
    viewport: { once: false, margin: VIEWPORT_CENTER_MARGIN },
    transition: { duration: 0.5, delay },
  };
}
