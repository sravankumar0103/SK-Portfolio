import React from 'react';
import { motion } from 'framer-motion';
import { HeroScene } from '../3d/HeroScene';
import { Github, Linkedin, Mail, ChevronDown } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      <HeroScene />
      
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-primary font-mono mb-4 tracking-widest uppercase glow-text">Initialization Sequence Complete</p>
          <h1 
            className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 text-foreground glitch-text"
            data-text="SRAVAN KUMAR"
          >
            SRAVAN KUMAR
          </h1>
          <h2 className="text-xl md:text-2xl text-muted-foreground font-light mb-8">
            <span className="text-primary">&gt;</span> AI Engineer <span className="mx-2 text-secondary">·</span> Full-Stack Developer <span className="mx-2 text-secondary">·</span> Robotics Enthusiast <span className="animate-pulse">_</span>
          </h2>
          
          <div className="flex items-center justify-center gap-6 mb-12">
            <SocialLink href="https://github.com/sravankumar0103" icon={<Github className="w-6 h-6" />} />
            <SocialLink href="https://linkedin.com/in/diddi-sravan-kumar" icon={<Linkedin className="w-6 h-6" />} />
            <SocialLink href="mailto:sravankumar0103@gmail.com" icon={<Mail className="w-6 h-6" />} />
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-transparent border border-primary text-primary font-mono uppercase tracking-wider relative overflow-hidden group hover:bg-primary/10 transition-colors"
            onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <span className="relative z-10 glow-text">Begin Exploration</span>
          </motion.button>
        </motion.div>
      </div>
      
      <motion.div 
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-muted-foreground"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <ChevronDown className="w-8 h-8 opacity-50" />
      </motion.div>
    </section>
  );
}

function SocialLink({ href, icon }: { href: string, icon: React.ReactNode }) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="p-3 glass-card rounded-full text-foreground hover:text-primary hover:border-primary transition-colors neon-border"
      whileHover={{ y: -5 }}
    >
      {icon}
    </motion.a>
  );
}
