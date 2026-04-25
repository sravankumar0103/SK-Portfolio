import { motion } from 'framer-motion';
import { SectionHeading } from '../ui/SectionHeading';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export function Contact() {
  return (
    <section id="contact" className="py-24 md:py-32 relative">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-primary/10 blur-[150px] pointer-events-none rounded-full" />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <SectionHeading title="Initialize Contact" subtitle="Open a comm channel" align="center" />
        
        <div className="max-w-3xl mx-auto mt-12 glass-card p-8 md:p-12 rounded-2xl border border-white/10 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20" />
          
          <h3 className="text-3xl font-display font-bold text-foreground mb-6 relative z-10">
            Ready to build something <span className="text-primary glow-text">extraordinary?</span>
          </h3>
          
          <p className="text-muted-foreground mb-10 max-w-xl mx-auto relative z-10">
            Currently open for new opportunities. Whether you have a question or just want to say hi, my inbox is always open.
          </p>
          
          <motion.a
            href="mailto:sravankumar0103@gmail.com"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-bold uppercase tracking-widest rounded-lg hover:shadow-[0_0_30px_rgba(0,255,255,0.5)] transition-shadow relative z-10"
          >
            <Send className="w-5 h-5" />
            Send Message
          </motion.a>
          
          <div className="grid md:grid-cols-3 gap-8 mt-16 pt-12 border-t border-white/10 relative z-10">
            <div className="flex flex-col items-center gap-3">
              <div className="p-3 bg-background/50 rounded-full text-secondary">
                <Mail className="w-6 h-6" />
              </div>
              <span className="text-sm text-foreground">sravankumar0103@gmail.com</span>
            </div>
            
            <div className="flex flex-col items-center gap-3">
              <div className="p-3 bg-background/50 rounded-full text-secondary">
                <Phone className="w-6 h-6" />
              </div>
              <span className="text-sm text-foreground">+91 8389898977</span>
            </div>
            
            <div className="flex flex-col items-center gap-3">
              <div className="p-3 bg-background/50 rounded-full text-secondary">
                <MapPin className="w-6 h-6" />
              </div>
              <span className="text-sm text-foreground">Hyderabad, India</span>
            </div>
          </div>
        </div>
      </div>
      
      <footer className="mt-32 border-t border-white/5 py-8 text-center text-sm font-mono text-muted-foreground">
        <p>Built with React, Three.js & Framer Motion</p>
        <p className="mt-2">© {new Date().getFullYear()} Diddi Sravan Kumar. All systems operational.</p>
      </footer>
    </section>
  );
}
