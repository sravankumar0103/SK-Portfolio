import React from 'react';
import { motion } from 'framer-motion';
import { HeroScene } from '../3d/HeroScene';
import { Github, Linkedin, Mail, ArrowRight } from 'lucide-react';
import { Magnetic } from '../ui/Magnetic';

export function Hero() {
  return (
    <section id="home" className="relative h-screen w-full flex items-center overflow-hidden">
      <div className="absolute inset-0 w-full md:w-1/2 md:right-0 md:left-auto right-0 z-0">
        <HeroScene />
      </div>

      <div className="relative z-10 w-full container mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center mt-32">
        <div className="w-full md:w-3/5 md:pr-12 pt-24 md:pt-0">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="flex flex-col items-start"
          >
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-display font-medium text-foreground leading-[0.9] tracking-tight mb-8">
              <div className="overflow-hidden">
                <motion.span 
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                  className="block whitespace-nowrap"
                >
                  Sravan Kumar
                </motion.span>
              </div>
              <div className="overflow-hidden mt-2">
                <motion.span 
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                  className="block"
                >
                  Diddi
                </motion.span>
              </div>
            </h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col items-start w-full"
            >
              <div className="w-24 h-[1px] bg-gradient-to-r from-primary/60 to-transparent mb-8" />

              <h2 className="text-xl md:text-2xl font-sans font-medium gold-text uppercase tracking-[0.2em] mb-8">
                AI & Full - Stack Developer
              </h2>

              <p className="text-muted-foreground font-sans text-lg font-light mb-12">
                Hyderabad, India · Open to opportunities
              </p>
            </motion.div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8 mb-12">
              <Magnetic>
                <a
                  href="#about"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="bg-primary text-background px-8 py-4 rounded-full font-sans text-sm uppercase tracking-widest hover:bg-white transition-colors flex items-center gap-2 group"
                >
                  Explore work
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </a>
              </Magnetic>

              <Magnetic>
                <a
                  href="https://drive.google.com/file/d/14N9CnZETI_vo2GAS003vhxhAx6PYNKXE/view?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-foreground transition-colors font-sans text-sm uppercase tracking-widest flex items-center gap-2 group relative pb-1"
                >
                  Resume
                  <span className="absolute bottom-0 left-0 w-full h-[1px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                </a>
              </Magnetic>
            </div>

            <div className="flex items-center gap-6">
              <SocialLink href="https://github.com/sravankumar0103" icon={<Github className="w-5 h-5" />} label="GitHub" />
              <SocialLink href="https://linkedin.com/in/diddi-sravan-kumar" icon={<Linkedin className="w-5 h-5" />} label="LinkedIn" />
              <SocialLink href="mailto:sravankumar0103@gmail.com" icon={<Mail className="w-5 h-5" />} label="Email" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center"
      >
        <div className="w-5 h-8 border-2 border-primary/20 rounded-full flex justify-center p-1.5">
          <motion.div 
            animate={{ 
              y: [0, 10, 0],
              opacity: [1, 0, 1]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="w-0.5 h-1 bg-primary/60 rounded-full" 
          />
        </div>
      </motion.div>
    </section>
  );
}

function SocialLink({ href, icon, label }: { href: string, icon: React.ReactNode, label: string }) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
      whileHover={{ y: -2 }}
    >
      {icon}
      <span className="text-sm font-sans sr-only md:not-sr-only md:inline-block">{label}</span>
    </motion.a>
  );
}
