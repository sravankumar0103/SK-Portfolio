import { motion } from 'framer-motion';
import { SectionHeading } from '../ui/SectionHeading';

const skills = [
  {
    category: "Languages",
    items: ["Python", "Java", "SQL", "JavaScript", "HTML5", "CSS3"]
  },
  {
    category: "Frameworks & Libraries",
    items: ["Next.js", "React", "TensorFlow", "OpenCV", "Bootstrap", "Tailwind CSS"]
  },
  {
    category: "Tools & Infrastructure",
    items: ["Git", "Supabase", "PostgreSQL", "Tableau", "Raspberry Pi", "Vercel"]
  }
];

export function Skills() {
  return (
    <section id="skills" className="py-24 md:py-32 relative">
      <div className="container mx-auto px-6 md:px-12">
        <SectionHeading num="03" title="Capabilities" />
        
        <div className="mt-16 max-w-4xl flex flex-col gap-12">
          {skills.map((group, idx) => (
            <motion.div
              key={group.category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="flex flex-col md:flex-row gap-6 md:gap-12 md:items-baseline border-b border-white/5 pb-12 last:border-0"
            >
              <h3 className="w-full md:w-1/3 text-sm font-sans text-muted-foreground uppercase tracking-[0.2em] pt-2">
                {group.category}
              </h3>
              
              <div className="w-full md:w-2/3 flex flex-wrap gap-3">
                {group.items.map((skill) => (
                  <span
                    key={skill}
                    className="px-4 py-2 text-sm font-sans text-foreground bg-white/[0.03] border border-white/[0.1] hover:border-primary/50 hover:text-primary transition-all duration-300 rounded-full cursor-default hover:shadow-[0_0_15px_rgba(201,169,110,0.15)]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
