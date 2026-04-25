import { motion } from 'framer-motion';
import { SectionHeading } from '../ui/SectionHeading';
import { ArrowRight, Github, ExternalLink } from 'lucide-react';

const projects = [
  {
    title: "Hexapod Robotic Arm",
    description: "Integrated a robotic arm into a 16-DOF hexapod robot for real-time object manipulation and automated task execution. Utilized AI, ML, and Computer Vision for adaptive autonomous behavior. Included an AR-based interface for real-time visualization.",
    tech: ["Python", "OpenCV", "TensorFlow", "Raspberry Pi 5"],
    github: "https://github.com/sravankumar0103",
    live: "#"
  },
  {
    title: "VaultIX",
    description: "Secure Bookmark & Knowledge Management platform designed for efficient information storage and retrieval. Features real-time synchronization, advanced search filtering, integrated analytics, and automated notification systems.",
    tech: ["Next.js", "React", "Supabase", "PostgreSQL"],
    github: "https://github.com/sravankumar0103/VaultIX",
    live: "https://vaultix-sk.vercel.app/"
  },
  {
    title: "Web App Suite",
    description: "A collection of interactive web applications built during virtual internship, including a responsive landing page, Tic-Tac-Toe game, and a Stopwatch tool.",
    tech: ["HTML5", "CSS3", "JavaScript"],
    github: "https://github.com/sravankumar0103",
    live: "#"
  },
  {
    title: "Python Utilities",
    description: "Suite of Python utility applications focusing on logic and automation: Word Counter, Expense Tracker, and a Username Generator.",
    tech: ["Python", "Automation Scripts"],
    github: "https://github.com/sravankumar0103",
    live: "#"
  }
];

export function Projects() {
  return (
    <section id="projects" className="py-12 md:py-20 relative">
      <div className="container mx-auto px-6 md:px-12">
        <SectionHeading num="04" title="Selected Works" />

        <div className="flex flex-col mt-16 max-w-5xl">
          {projects.map((project, idx) => (
            <ProjectRow key={project.title} project={project} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectRow({ project, index }: { project: any, index: number }) {
  const num = (index + 1).toString().padStart(2, '0');

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
      className="group relative border-b border-white/5 py-6 md:py-8 px-4 md:px-6 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden cursor-pointer"
    >
      {/* Cinematic Background Hover */}
      <div className="absolute inset-0 bg-white/[0.01] translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]" />
      <div className="absolute inset-y-0 left-0 w-1 bg-primary scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-bottom" />

      <div className="relative z-10 flex flex-col md:flex-row gap-4 md:gap-12 md:items-start">
        {/* Project Number */}
        <div className="text-xs font-sans font-medium text-primary/40 group-hover:text-primary transition-colors pt-1.5">
          {num}
        </div>

        <div className="flex-1">
          <div className="flex flex-col gap-3">
            <h3 className="text-2xl sm:text-3xl md:text-5xl font-display font-medium text-foreground/90 group-hover:text-foreground transition-all duration-500 group-hover:tracking-tight">
              {project.title}
            </h3>

            <div className="flex flex-wrap gap-2">
              {project.tech.map((t: string) => (
                <span key={t} className="text-[9px] font-sans text-muted-foreground uppercase tracking-[0.2em] px-2.5 py-0.5 bg-white/[0.03] border border-white/5 rounded-full group-hover:border-primary/20 transition-colors">
                  {t}
                </span>
              ))}
            </div>
          </div>

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
            <p className="text-sm font-sans text-muted-foreground leading-relaxed pt-6 max-w-2xl">
              {project.description}
            </p>
          </motion.div>
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-4 self-end md:self-start pt-1.5">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, margin: "-30% 0px -30% 0px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center gap-2"
          >
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-110"
                onClick={(e) => e.stopPropagation()}
              >
                <Github className="w-4 h-4" />
              </a>
            )}
            {project.live && project.live !== '#' && (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-110"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </motion.div>
          <div className="hidden md:flex w-10 h-10 rounded-full border border-white/10 items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-background group-hover:border-primary transition-all duration-500">
            <ArrowRight className="w-4 h-4 -rotate-45 group-hover:rotate-0 transition-transform duration-500" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
