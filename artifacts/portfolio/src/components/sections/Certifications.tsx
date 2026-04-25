import { motion } from 'framer-motion';
import { SectionHeading } from '../ui/SectionHeading';
import { Award, Shield, Cloud, BrainCircuit } from 'lucide-react';

const certs = [
  {
    name: "Google Cybersecurity",
    issuer: "Coursera",
    icon: Shield,
    color: "text-blue-400",
    borderClass: "group-hover:border-blue-400"
  },
  {
    name: "Machine Learning & Artificial Intelligence",
    issuer: "IBM",
    icon: BrainCircuit,
    color: "text-primary",
    borderClass: "group-hover:border-primary"
  },
  {
    name: "Machine Learning, Data Engineering, Cloud Architecting",
    issuer: "AWS Academy",
    icon: Cloud,
    color: "text-orange-400",
    borderClass: "group-hover:border-orange-400"
  }
];

export function Certifications() {
  return (
    <section id="certifications" className="py-24 md:py-32 relative">
      <div className="container mx-auto px-4 md:px-6">
        <SectionHeading title="Credentials" subtitle="Verified expertise" align="center" />
        
        <div className="grid md:grid-cols-3 gap-6 mt-16 max-w-5xl mx-auto">
          {certs.map((cert, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              whileHover={{ y: -5 }}
              className={`glass-card p-6 rounded-xl border border-white/5 transition-all duration-300 relative overflow-hidden group ${cert.borderClass}`}
            >
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Award className="w-24 h-24" />
              </div>
              
              <div className="relative z-10">
                <cert.icon className={`w-8 h-8 mb-4 ${cert.color}`} />
                <h3 className="text-lg font-bold text-foreground mb-2 leading-tight">
                  {cert.name}
                </h3>
                <p className="text-sm font-mono text-muted-foreground uppercase tracking-widest">
                  {cert.issuer}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
