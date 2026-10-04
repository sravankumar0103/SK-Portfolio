import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

type NavItem = {
  name: string;
  href: string;
  isButton?: boolean;
};

const navItems: NavItem[] = [
  { name: 'About', href: '#about' },
  { name: 'Experience', href: '#experience' },
  { name: 'Skills', href: '#skills' },
  { name: 'Projects', href: '#projects' },
  { name: 'Certifications', href: '#certifications' },
  { name: 'Contact', href: '#contact' },
];

// Must match the scroll-margin-top set in globals.css
const SCROLL_MARGIN_TOP = 100;

const ALL_SECTION_IDS = ['home', 'about', 'experience', 'skills', 'projects', 'certifications', 'contact'];

export function Navbar() {
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const updateActive = () => {
      // getBoundingClientRect always works relative to the viewport,
      // regardless of which DOM element is actually scrolling.
      const buffer = SCROLL_MARGIN_TOP + 10;

      // Walk sections in reverse — the last one whose top edge is above
      // the detection line is the "current" section.
      for (let i = ALL_SECTION_IDS.length - 1; i >= 0; i--) {
        const el = document.getElementById(ALL_SECTION_IDS[i]);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= buffer) {
          setActiveSection(ALL_SECTION_IDS[i]);
          return;
        }
      }
      setActiveSection('home');
    };

    window.addEventListener('scroll', updateActive, { passive: true });
    // Also listen on any element that might be the actual scroll container
    document.addEventListener('scroll', updateActive, { passive: true, capture: true });
    updateActive();

    return () => {
      window.removeEventListener('scroll', updateActive);
      document.removeEventListener('scroll', updateActive, { capture: true });
    };
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.substring(1);
    const target = document.getElementById(targetId);
    if (!target) return;

    // Delegate the scroll-to-target animation to Lenis's own RAF loop
    // (already running in SmoothScroll.tsx) instead of a second, competing
    // RAF loop here. Lenis auto-interrupts on real user wheel/touch input.
    const lenis = (window as any).__lenis;
    if (lenis) {
      lenis.scrollTo(target, {
        offset: -SCROLL_MARGIN_TOP,
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    } else {
      const rect = target.getBoundingClientRect();
      window.scrollBy({ top: rect.top - SCROLL_MARGIN_TOP, behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-2.5 left-0 w-full z-50 px-6 hidden md:flex justify-center pointer-events-none">
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-center px-6 py-2 rounded-full border border-white/5 bg-black/30 backdrop-blur-md shadow-[0_8px_32px_0_rgba(0,0,0,0.8)] pointer-events-auto"
      >
        <nav className="flex gap-5 md:gap-7 items-center">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              onClick={(e) => !item.isButton && handleClick(e, item.href)}
              className={`text-sm font-sans transition-all duration-200 ${
                item.isButton
                  ? 'px-4 py-2 border border-primary/50 rounded-full text-primary hover:bg-primary hover:text-background'
                  : activeSection === item.href.substring(1)
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-primary'
              }`}
              style={{ letterSpacing: '0.02em' }}
              target={item.isButton ? '_blank' : undefined}
              rel={item.isButton ? 'noopener noreferrer' : undefined}
            >
              {item.name}
            </a>
          ))}
        </nav>
      </motion.div>
    </header>
  );
}
