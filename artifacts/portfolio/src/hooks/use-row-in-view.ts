import { useRef } from 'react';
import { useInView } from 'framer-motion';
import { VIEWPORT_CENTER_MARGIN } from '../lib/motion';

/** A ref for a list row, and whether the row has reached the viewport centre (stays true once it has). */
export function useRowInView() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { margin: VIEWPORT_CENTER_MARGIN, once: true });
  return { ref, isInView };
}
