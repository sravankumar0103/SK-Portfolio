import { motion } from 'framer-motion';
import { SectionHeading } from '../ui/SectionHeading';
import { SiPython, SiOpenjdk, SiHtml5, SiCss, SiJavascript, SiNextdotjs, SiBootstrap, SiGit, SiSupabase, SiPostgresql, SiTensorflow, SiOpencv } from 'react-icons/si';
import { Code2, BarChart3, Database } from 'lucide-react';

const skills = [
  {
    category: "Languages",
    items: [
      { name: "Python", icon: SiPython, color: "#3776AB" },
      { name: "Java", icon: SiOpenjdk, color: "#007396" },
      { name: "SQL", icon: SiPostgresql, color: "#336791" },
    ]
  },
  {
    category: "Web Technologies",
    items: [
      { name: "Next.js", icon: SiNextdotjs, color: "#ffffff" },
      { name: "JavaScript", icon: SiJavascript, color: "#F7DF1E" },
      { name: "HTML5", icon: SiHtml5, color: "#E34F26" },
      { name: "CSS3", icon: SiCss, color: "#1572B6" },
      { name: "Bootstrap", icon: SiBootstrap, color: "#7952B3" },
    ]
  },
  {
    category: "AI & Tools",
    items: [
      { name: "TensorFlow", icon: SiTensorflow, color: "#FF6F00" },
      { name: "OpenCV", icon: SiOpencv, color: "#5C3EE8" },
      { name: "Git", icon: SiGit, color: "#F05032" },
      { name: "Supabase", icon: SiSupabase, color: "#3ECF8E" },
      { name: "Tableau", icon: BarChart3, color: "#E97627" },
      { name: "PostgreSQL", icon: SiPostgresql, color: "#336791" },
    ]
  }
];

export function Skills() {
  return (
    <section id="skills" className="py-24 md:py-32 relative">
      <div className="container mx-auto px-4 md:px-6">
        <SectionHeading title="Arsenal" subtitle="Technical capabilities" align="center" />
        
        <div className="grid md:grid-cols-3 gap-8 mt-16 max-w-6xl mx-auto">
          {skills.map((group, idx) => (
            <motion.div
              key={group.category}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
              className="glass-card p-6 rounded-xl border border-white/5 relative overflow-hidden group"
            >
              <div className="absolute -inset-1 bg-gradient-to-b from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity blur-md" />
              
              <h3 className="text-xl font-bold font-display uppercase tracking-widest text-foreground mb-8 text-center border-b border-white/10 pb-4">
                {group.category}
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                {group.items.map((skill) => (
                  <motion.div
                    key={skill.name}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="flex flex-col items-center justify-center p-4 bg-background/50 rounded-lg border border-white/5 hover:border-primary/30 transition-colors"
                  >
                    <skill.icon size={32} className="mb-3 opacity-80 group-hover:opacity-100 transition-opacity" style={{ color: skill.color }} />
                    <span className="text-xs font-mono text-muted-foreground text-center">{skill.name}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
