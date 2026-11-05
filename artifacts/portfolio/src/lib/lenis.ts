import type Lenis from 'lenis';

export const SCROLL_DURATION = 1.2;

export const scrollEasing = (t: number): number => Math.min(1, 1.001 - Math.pow(2, -10 * t));

// Lenis runs the site's only requestAnimationFrame loop (SmoothScroll). Callers
// must not run their own: they scroll through the functions below, which hand
// the animation to Lenis, or to the browser when no instance is mounted.
let instance: Lenis | null = null;

export function setLenis(next: Lenis | null): void {
  instance = next;
}

function getLenis(): Lenis | null {
  return instance;
}

export function scrollToY(top: number, options: { immediate?: boolean } = {}): void {
  const lenis = getLenis();
  if (options.immediate) {
    if (lenis) {
      // Lenis caches the scroll limit; refresh it first, otherwise the jump
      // clamps to a stale (shorter) page height and stops short. `force`
      // scrolls even when Lenis is stopped.
      lenis.resize();
      lenis.scrollTo(top, { immediate: true, force: true });
    } else {
      window.scrollTo({ top });
    }
    return;
  }
  if (lenis) {
    lenis.scrollTo(top, { duration: SCROLL_DURATION, easing: scrollEasing });
  } else {
    window.scrollTo({ top, behavior: 'smooth' });
  }
}

export function scrollToElement(target: HTMLElement, offsetTop: number): void {
  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(target, { offset: -offsetTop, duration: SCROLL_DURATION, easing: scrollEasing });
  } else {
    window.scrollBy({ top: target.getBoundingClientRect().top - offsetTop, behavior: 'smooth' });
  }
}

/** Runs `fn` at each delay. The returned function cancels every one still pending. */
export function reassert(fn: () => void, delaysMs: readonly number[]): () => void {
  const timers = delaysMs.map((delay) => setTimeout(fn, delay));
  return () => timers.forEach(clearTimeout);
}
