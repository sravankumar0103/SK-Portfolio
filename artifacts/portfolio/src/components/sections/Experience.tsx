import { motion } from 'framer-motion';
import { SectionHeading } from '../ui/SectionHeading';
import { ScrollRevealText } from '../ui/ScrollRevealText';

const experiences = [
  {
    role: "Python Programming Intern",
    company: "MotionCut",
    date: "Jan 2025 – Feb 2025",
    description: "Automated real-world tasks with Python resulting in a 30% effort reduction. Solved 10+ problem statements."
  },
  {
    role: "Web Development Intern",
    company: "Prodigy InfoTech",
    date: "Jun 2024 – Jul 2024",
    description: "Built 3+ responsive web apps with HTML/CSS/JS. Collaborated effectively within a 5+ member team."
  }
];

export function Experience() {
  return (
    <section id="experience" className="py-12 md:py-20 relative">
      <div className="container mx-auto px-6 md:px-12">
        <SectionHeading num="02" title="Experience" />
        
        <div className="relative max-w-4xl mt-16 pl-6 md:pl-0">
          {/* Timeline central line */}
          <div className="absolute left-[3px] md:left-1/2 top-0 bottom-0 w-[1px] bg-primary/20" />
          
          <div className="space-y-16">
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
      initial={{ opacity: 1, y: 0, scale: 0.95 }}
      whileInView={{ 
        opacity: 1, 
        y: 0, 
        scale: 1,
        transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] }
      }}
      viewport={{ once: false, margin: "-30% 0px -30% 0px" }}
      className={`relative flex flex-col md:flex-row gap-8 md:gap-16 group ${isEven ? 'md:flex-row-reverse' : ''}`}
    >
      {/* Timeline dot */}
      <div className="absolute -left-[1px] md:left-1/2 md:-ml-[5px] top-2 w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_10px_hsla(11,81%,57%,0.5)] z-10" />
      
      {/* Date */}
      <div className={`hidden md:flex w-1/2 flex-col pt-1 ${isEven ? 'items-start text-left' : 'items-end text-right'}`}>
        <span className="text-xs font-sans text-muted-foreground uppercase tracking-widest">{data.date}</span>
      </div>
      
      {/* Content Card */}
      <div className={`w-full md:w-1/2 pl-6 md:pl-0 ${isEven ? 'md:text-right' : 'md:text-left'}`}>
        <div className="group-hover:translate-x-1 transition-transform duration-300">
          <h3 className="text-xl sm:text-2xl md:text-4xl font-display font-bold text-foreground mb-1 tracking-tighter">
            <ScrollRevealText text={data.company} />
          </h3>
          <div className="text-base font-sans font-medium text-foreground/80 mb-2">{data.role}</div>
          <span className="md:hidden block text-xs font-sans text-muted-foreground uppercase tracking-widest mb-4">{data.date}</span>
          
          <motion.div 
            className="overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            whileInView={{ height: "auto", opacity: 1 }}
            viewport={{ once: false, margin: "-30% 0px -30% 0px" }}
            transition={{ 
              height: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
              opacity: { duration: 0.5, delay: 0.2 }
            }}
          >
            <p className="text-sm font-sans text-muted-foreground leading-relaxed pt-2">
              {data.description}
            </p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
