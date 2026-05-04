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

    // Cancel any existing scroll loop
    if ((window as any)._scrollFrame) {
      cancelAnimationFrame((window as any)._scrollFrame);
    }
    
    // Remove old interrupt listeners if they exist
    if ((window as any)._cancelScroll) {
      (window as any)._cancelScroll();
    }

    let isScrolling = true;

    // Listen for actual user interactions to interrupt the smooth scroll
    const interrupt = () => { isScrolling = false; };
    window.addEventListener('wheel', interrupt, { passive: true, once: true });
    window.addEventListener('touchstart', interrupt, { passive: true, once: true });
    
    (window as any)._cancelScroll = () => {
      isScrolling = false;
      window.removeEventListener('wheel', interrupt);
      window.removeEventListener('touchstart', interrupt);
    };

    const smoothScroll = () => {
      if (!isScrolling) return;

      const rect = target.getBoundingClientRect();
      const targetY = rect.top - SCROLL_MARGIN_TOP;
      
      // Stop condition: very close to target OR hit the absolute bottom of the page
      if (Math.abs(targetY) < 2 || (window.innerHeight + window.scrollY >= document.body.offsetHeight - 2 && targetY > 0)) {
        window.scrollBy(0, targetY);
        (window as any)._cancelScroll();
        return;
      }
      
      // Adaptive step: move 12% of the remaining distance per frame.
      const step = targetY * 0.12;
      const move = targetY > 0 ? Math.max(step, 1) : Math.min(step, -1);
      
      window.scrollBy(0, move);
      
      (window as any)._scrollFrame = requestAnimationFrame(smoothScroll);
    };

    (window as any)._scrollFrame = requestAnimationFrame(smoothScroll);
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
