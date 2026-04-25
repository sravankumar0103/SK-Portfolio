import { useState, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

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

export function Navbar() {
  const [activeSection, setActiveSection] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      const sections = navItems.map(item => item.href.substring(1));
      let current = '';

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element && window.scrollY >= element.offsetTop - 300) {
          current = section;
        }
      }

      if (current && current !== activeSection) {
        setActiveSection(current);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeSection]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
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
                className={`text-sm font-sans transition-all ${item.isButton
                  ? 'px-4 py-2 border border-primary/50 rounded-full text-primary hover:bg-primary hover:text-background'
                  : (activeSection === item.href.substring(1)
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-primary')
                  }`}
                style={{ letterSpacing: '0.02em' }}
                target={item.isButton ? "_blank" : undefined}
                rel={item.isButton ? "noopener noreferrer" : undefined}
              >
                {item.name}
              </a>
            ))}
          </nav>
        </motion.div>
      </header>
    </>
  );
}
