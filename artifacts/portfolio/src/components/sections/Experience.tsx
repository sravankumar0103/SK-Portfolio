import { motion } from 'framer-motion';
import { SectionHeading } from '../ui/SectionHeading';
import { Calendar, Building2, ChevronRight } from 'lucide-react';

const experiences = [
  {
    role: "Python Programming Intern",
    company: "MotionCut",
    date: "Jan 2025 – Feb 2025",
    description: "Automated real-world tasks with Python resulting in a 30% effort reduction. Solved 10+ problem statements.",
    tech: ["Python", "Automation", "Problem Solving"]
  },
  {
    role: "Web Development Intern",
    company: "Prodigy InfoTech",
    date: "Jun 2024 – Jul 2024",
    description: "Built 3+ responsive web apps with HTML/CSS/JS. Collaborated effectively within a 5+ member team.",
    tech: ["HTML5", "CSS3", "JavaScript", "Team Collaboration"]
  }
];

export function Experience() {
  return (
    <section id="experience" className="py-24 md:py-32 relative">
      <div className="container mx-auto px-4 md:px-6">
        <SectionHeading title="Experience" subtitle="Career trajectory" align="right" />
        
        <div className="relative max-w-4xl mx-auto mt-16">
          {/* Timeline central line */}
          <div className="absolute left-[20px] md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-secondary to-transparent opacity-30 rounded-full" />
          
          <div className="space-y-12">
            {experiences.map((exp, index) => (
              <ExperienceItem key={index} data={exp} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ExperienceItem({ data, index }: { data: any, index: number }) {
  const isEven = index % 2 === 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      className={`relative flex flex-col md:flex-row gap-8 ${isEven ? 'md:flex-row-reverse' : ''} group`}
    >
      {/* Timeline dot */}
      <div className="absolute left-[20px] md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-background border-2 border-primary z-10 group-hover:bg-primary group-hover:shadow-[0_0_15px_rgba(0,255,255,0.8)] transition-all duration-300" />
      
      {/* Date (Desktop only) */}
      <div className={`hidden md:flex w-1/2 flex-col justify-center ${isEven ? 'items-start pl-12' : 'items-end pr-12'}`}>
        <div className="text-primary font-mono text-sm glow-text flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          {data.date}
        </div>
      </div>
      
      {/* Content Card */}
      <div className={`w-full md:w-1/2 pl-12 md:pl-0 ${isEven ? 'md:pr-12' : 'md:pl-12'}`}>
        <div className="glass-card p-6 rounded-xl hover:bg-white/[0.02] transition-colors border border-white/5 group-hover:border-primary/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <h3 className="text-xl font-bold text-foreground mb-1">{data.role}</h3>
          
          <div className="flex items-center gap-2 text-muted-foreground mb-4">
            <Building2 className="w-4 h-4 text-secondary" />
            <span>{data.company}</span>
            <span className="md:hidden ml-auto text-primary text-sm font-mono">{data.date}</span>
          </div>
          
          <p className="text-sm text-foreground/70 mb-6 leading-relaxed">
            {data.description}
          </p>
          
          <div className="flex flex-wrap gap-2">
            {data.tech.map((t: string) => (
              <span key={t} className="px-3 py-1 text-xs font-mono bg-primary/10 text-primary rounded-full border border-primary/20">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
