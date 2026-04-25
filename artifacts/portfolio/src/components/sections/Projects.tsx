import { motion } from 'framer-motion';
import { SectionHeading } from '../ui/SectionHeading';
import { ExternalLink, Github, Cpu, Layout, Code2 } from 'lucide-react';

const projects = [
  {
    title: "Hexapod Robotic Arm",
    type: "Robotics / AI",
    icon: Cpu,
    description: "Integrated a robotic arm into a 16-DOF hexapod robot. Utilized AI, ML, and Computer Vision for adaptive autonomous execution. Included an AR-based interface for real-time visualization.",
    tech: ["Python", "OpenCV", "TensorFlow", "Raspberry Pi 5"],
    color: "from-primary to-blue-600",
    glow: "rgba(0, 255, 255, 0.4)"
  },
  {
    title: "VaultIX",
    type: "Full-Stack Web App",
    icon: Layout,
    description: "Secure Bookmark & Knowledge Management Web App. Features authentication, real-time sync, CRUD operations, advanced search/filtering, analytics, and automated email notifications.",
    tech: ["Next.js", "React", "Tailwind", "Supabase", "PostgreSQL"],
    color: "from-secondary to-purple-800",
    glow: "rgba(138, 43, 226, 0.4)"
  },
  {
    title: "Web App Suite",
    type: "Frontend Projects",
    icon: Code2,
    description: "A collection of interactive web applications built during virtual internship, including a responsive landing page, Tic-Tac-Toe game, and a Stopwatch tool.",
    tech: ["HTML5", "CSS3", "JavaScript"],
    color: "from-green-400 to-emerald-700",
    glow: "rgba(74, 222, 128, 0.4)"
  },
  {
    title: "Python Utilities",
    type: "Backend Scripts",
    icon: Code2,
    description: "Suite of Python utility applications focusing on logic and automation: Word Counter, Expense Tracker, and a Username Generator.",
    tech: ["Python", "Automation"],
    color: "from-orange-400 to-red-600",
    glow: "rgba(251, 146, 60, 0.4)"
  }
];

export function Projects() {
  return (
    <section id="projects" className="py-24 md:py-32 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <SectionHeading title="Databases" subtitle="Project catalog" />
        
        <div className="grid md:grid-cols-2 gap-8 mt-12 max-w-5xl mx-auto">
          {projects.map((project, idx) => (
            <ProjectCard key={project.title} project={project} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project, index }: { project: any, index: number }) {
  const Icon = project.icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -10 }}
      className="group perspective"
    >
      <div className="relative h-full glass-card p-8 rounded-xl border border-white/5 hover:border-white/20 transition-colors overflow-hidden transform-style-3d preserve-3d transition-transform duration-500">
        {/* Glow effect on hover */}
        <div 
          className="absolute -inset-2 bg-gradient-to-br opacity-0 group-hover:opacity-20 transition-opacity blur-xl z-0"
          style={{ backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))`, '--tw-gradient-from': project.color.split(' ')[0].replace('from-', ''), '--tw-gradient-to': project.color.split(' ')[1].replace('to-', '') } as any}
        />
        
        <div className="relative z-10 h-full flex flex-col">
          <div className="flex justify-between items-start mb-6">
            <div className={`p-3 rounded-lg bg-gradient-to-br ${project.color} bg-opacity-20 flex items-center justify-center shadow-lg`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            
            <div className="flex gap-2">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors p-2 bg-background/50 rounded-full border border-white/5">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors p-2 bg-background/50 rounded-full border border-white/5">
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
          
          <h3 className="text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
            {project.title}
          </h3>
          
          <div className="text-xs font-mono text-secondary mb-4 uppercase tracking-wider">
            {project.type}
          </div>
          
          <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-grow">
            {project.description}
          </p>
          
          <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-white/5">
            {project.tech.map((t: string) => (
              <span key={t} className="text-xs font-mono text-foreground/70">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
