import { motion } from 'framer-motion';
import { SectionHeading } from '../ui/SectionHeading';

export function About() {
  return (
    <section id="about" className="py-24 md:py-32 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <SectionHeading title="Identity" subtitle="Who am I?" />
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="glass-card p-8 rounded-xl border-l-2 border-l-primary relative overflow-hidden group"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="font-mono text-sm space-y-4 text-muted-foreground">
              <p><span className="text-primary">const</span> <span className="text-foreground">developer</span> = {'{'}</p>
              <div className="pl-4 space-y-2 border-l border-white/5 ml-2">
                <p><span className="text-secondary">name:</span> <span className="text-green-400">"Diddi Sravan Kumar"</span>,</p>
                <p><span className="text-secondary">role:</span> <span className="text-green-400">["AI/ML Engineer", "Full-Stack Developer"]</span>,</p>
                <p><span className="text-secondary">location:</span> <span className="text-green-400">"Hyderabad, India"</span>,</p>
                <p><span className="text-secondary">education:</span> {'{'}</p>
                <div className="pl-4 space-y-2 border-l border-white/5 ml-2">
                  <p><span className="text-secondary">degree:</span> <span className="text-green-400">"B.Tech in AI"</span>,</p>
                  <p><span className="text-secondary">university:</span> <span className="text-green-400">"Vidya Jyothi Institute of Technology"</span>,</p>
                  <p><span className="text-secondary">minor:</span> <span className="text-green-400">"Electric Vehicles"</span></p>
                </div>
                <p>{'},'}</p>
                <p><span className="text-secondary">passion:</span> <span className="text-green-400">"Building intelligent systems that bridge the gap between software and hardware."</span></p>
              </div>
              <p>{'};'}</p>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative h-[400px] w-full hidden md:block"
          >
            <div className="absolute inset-0 border border-primary/30 rounded-full animate-[spin_10s_linear_infinite] border-t-primary border-b-secondary" />
            <div className="absolute inset-4 border border-secondary/30 rounded-full animate-[spin_15s_linear_infinite_reverse] border-r-primary border-l-secondary" />
            <div className="absolute inset-8 border border-white/10 rounded-full animate-[spin_20s_linear_infinite] border-t-white" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 bg-primary/20 blur-xl rounded-full absolute" />
              <svg className="w-24 h-24 text-primary relative z-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
