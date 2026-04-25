import React from 'react';
import { motion } from 'framer-motion';
import { HeroScene } from '../3d/HeroScene';
import { Github, Linkedin, Mail, ArrowRight } from 'lucide-react';
import { Magnetic } from '../ui/Magnetic';

export function Hero() {
  return (
    <section id="home" className="relative h-screen w-full flex flex-col md:flex-row items-center overflow-hidden">
      {/* 3D Scene Container - Repositioned for Mobile */}
      <div className="absolute top-[-5%] right-[-10%] w-[120%] h-[60%] md:top-0 md:right-0 md:w-1/2 md:h-full z-0 opacity-80 md:opacity-100">
        <HeroScene />
      </div>

      <div className="relative z-10 w-full container mx-auto px-6 md:px-12 flex flex-col justify-end md:justify-center h-full pb-[15vh] md:pt-20 md:pb-0">
        <div className="w-full md:w-3/5 md:pr-12">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="flex flex-col items-start"
          >
            <h1 className="text-[clamp(44px,10vw,120px)] font-outfit font-semibold leading-[1.05] md:leading-[0.9] tracking-[-0.03em] mb-4 md:mb-6">
              <div className="overflow-hidden">
                <motion.span
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                  className="block whitespace-nowrap premium-gradient-text"
                >
                  Sravan Kumar
                </motion.span>
              </div>
              <div className="overflow-hidden">
                <motion.span
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                  className="block premium-gradient-text"
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
              <div className="w-24 h-[1px] bg-gradient-to-r from-primary/60 to-transparent mb-6" />

              <h2 className="text-lg md:text-2xl font-sans font-medium gold-text uppercase tracking-[0.2em] mb-3 md:mb-4">
                AI & Full - Stack Developer
              </h2>

              <p className="text-muted-foreground font-sans text-base md:text-lg font-light mb-6 md:mb-8">
                Hyderabad, India · Open to opportunities
              </p>
            </motion.div>

            <div className="flex flex-row items-center gap-6 md:gap-8 mb-8">
              <Magnetic>
                <a
                  href="#about"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="bg-primary text-background px-[clamp(20px,4vw,32px)] py-[clamp(12px,2vw,16px)] rounded-full font-sans text-sm uppercase tracking-widest hover:bg-white transition-colors flex items-center gap-2 group"
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
