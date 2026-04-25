import { useState, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

const navItems = [
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
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 w-full z-40 transition-all duration-500 ${isScrolled ? 'py-4' : 'py-6'
          }`}
        style={{
          background: isScrolled ? 'rgba(8, 8, 8, 0.65)' : 'transparent',
          backdropFilter: isScrolled ? 'blur(16px) saturate(180%)' : 'none',
          WebkitBackdropFilter: isScrolled ? 'blur(16px) saturate(180%)' : 'none',
          boxShadow: isScrolled ? '0 10px 30px -10px rgba(0, 0, 0, 0.5)' : 'none',
        }}
      >
        <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
          <a href="#home" onClick={(e) => handleClick(e, '#home')} className="text-xl font-display font-medium text-foreground tracking-wide hover:text-primary transition-colors">
            DSK
          </a>

          <nav className="hidden md:flex gap-8 items-center">
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
        </div>
      </header>
    </>
  );
}
