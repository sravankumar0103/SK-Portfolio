import { motion } from 'framer-motion';
import { SectionHeading } from '../ui/SectionHeading';
import { ScrollRevealText } from '../ui/ScrollRevealText';

export function About() {
  return (
    <section id="about" className="py-12 md:py-20 relative">
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <SectionHeading num="01" title="About" />

        <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-start mt-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="prose prose-invert max-w-none font-sans text-foreground leading-relaxed"
          >
            <p className="text-lg md:text-xl font-light mb-6">
              I am an <span className="text-foreground font-medium italic">AI & Full-Stack Developer</span> focused on building smart, high-quality applications. I combine the power of Artificial Intelligence with full-stack development to create tools that actually solve problems. <ScrollRevealText
                text="I don't just write code; I build solutions that work."
                className="font-medium inline-block"
                from="#1a1918"
                to="#c5c1b0"
              />
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Based in Hyderabad, I have a B.Tech in Artificial Intelligence from <span className="text-foreground/80 font-medium">Vidya Jyothi Institute of Technology</span>. My work includes everything from smart computer vision and robotics to secure websites and automated apps. <span className="italic">I focus on writing clean, reliable code for projects that are built to perform well and grow easily.</span>
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-2 gap-4 sm:gap-8 md:gap-x-8 md:gap-y-12 mt-8 md:mt-0"
          >
            <Stat label="CGPA" value="7.45" />
            <Stat label="Projects" value="4+" />
            <Stat label="Certifications" value="3" />
            <Stat label="Experience" value="1 yr" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-start border-l border-white/10 pl-6">
      <div className="text-4xl md:text-5xl font-display font-semibold gold-text mb-2 tracking-tight">
        {value}
      </div>
      <div className="text-sm font-sans text-muted-foreground uppercase tracking-widest">
        {label}
      </div>
    </div>
  );
}
