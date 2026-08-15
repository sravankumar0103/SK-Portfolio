import { useEffect } from 'react';
import { Hero } from '@/components/sections/Hero';
import { Navbar } from '@/components/layout/Navbar';
import { About } from '@/components/sections/About';
import { Experience } from '@/components/sections/Experience';
import { Skills } from '@/components/sections/Skills';
import { Projects } from '@/components/sections/Projects';
import { Certifications } from '@/components/sections/Certifications';
import { Contact } from '@/components/sections/Contact';

export default function Home() {
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  // When arriving with a hash (e.g. returning from a project page via
  // "/#projects"), jump straight to that section instead of the top.
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (!id) return;

    let active = true;
    const jump = () => {
      if (!active) return;
      const el = document.getElementById(id);
      if (!el) return;
      // Absolute document position — reliable regardless of transformed
      // ancestors (passing the element to Lenis uses offsetTop, which is off).
      const top = el.getBoundingClientRect().top + window.scrollY - 100;
      const lenis = (window as any).__lenis;
      if (lenis) {
        // Lenis caches the scroll limit; refresh it first, otherwise the jump
        // clamps to a stale (shorter) page height and stops short.
        lenis.resize?.();
        lenis.scrollTo(top, { immediate: true });
      } else {
        window.scrollTo({ top });
      }
    };

    // The hero renders a 3D canvas and CMS content loads late, so the target's
    // position keeps shifting for up to ~2s. Re-assert on every layout change
    // (ResizeObserver) plus a few timers, and stop the moment the user scrolls
    // so we never yank them back.
    const stop = () => {
      active = false;
      cleanup();
    };
    const ro = new ResizeObserver(() => jump());
    ro.observe(document.body);
    const timers = [40, 150, 320, 550, 850, 1300, 1900].map((t) => setTimeout(jump, t));
    const hardStop = window.setTimeout(stop, 2300);
    window.addEventListener('wheel', stop, { passive: true });
    window.addEventListener('touchstart', stop, { passive: true });
    window.addEventListener('keydown', stop);
    window.addEventListener('load', jump);

    function cleanup() {
      ro.disconnect();
      timers.forEach(clearTimeout);
      clearTimeout(hardStop);
      window.removeEventListener('wheel', stop);
      window.removeEventListener('touchstart', stop);
      window.removeEventListener('keydown', stop);
      window.removeEventListener('load', jump);
    }
    return cleanup;
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary/30 selection:text-primary">
      <Navbar />
      <Hero />
      <About />
      <Experience />
      <Skills />
      <Projects />
      <Certifications />
      <Contact />
    </div>
  );
}
