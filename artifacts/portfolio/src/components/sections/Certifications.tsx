import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { SectionHeading } from '../ui/SectionHeading';

const certs = [
  {
    name: "Google Cybersecurity",
    issuer: "Google / Coursera",
    date: "2024",
    link: "https://www.coursera.org/account/accomplishments/professional-cert/HZXL29HPYAK2"
  },
  {
    name: "Machine Learning & Artificial Intelligence",
    issuer: "IBM",
    date: "2023"
  },
  {
    name: "Machine Learning, Data Engineering, Cloud Architecting",
    issuer: "AWS Academy",
    date: "2023"
  }
];

export function Certifications() {
  return (
    <section id="certifications" className="py-12 md:py-20 relative">
      <div className="container mx-auto px-6 md:px-12">
        <SectionHeading num="05" title="Certifications" />

        <div className="mt-16 max-w-4xl">
          {certs.map((cert, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group border-b border-white/5 relative"
            >
              <a
                href={cert.link || '#'}
                target={cert.link ? "_blank" : undefined}
                rel={cert.link ? "noopener noreferrer" : undefined}
                className={`flex flex-col md:flex-row md:items-center justify-between py-8 w-full ${cert.link ? 'cursor-pointer' : 'cursor-default'}`}
              >
                <div className="absolute bottom-0 left-0 h-[1px] w-0 bg-primary group-hover:w-full transition-all duration-500 ease-out" />

                <div className="flex-1 pr-4">
                  <h3 className="text-lg md:text-xl font-sans font-medium text-foreground group-hover:text-primary transition-colors leading-tight">
                    {cert.name}
                  </h3>
                  <p className="text-sm font-sans text-muted-foreground mt-1.5">
                    {cert.issuer}
                  </p>
                  
                  <div className="flex items-center justify-between mt-4">
                    <div className="text-sm font-sans text-muted-foreground uppercase tracking-widest">
                      {cert.date}
                    </div>
                    
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: false, margin: "-30% 0px -30% 0px" }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                      className="shrink-0"
                    >
                      {cert.link && (
                        <div className="flex items-center gap-2 px-2.5 py-1 text-muted-foreground hover:text-primary bg-white/[0.03] rounded-full border border-white/5 hover:border-primary/20 transition-all duration-300">
                          <span className="text-[9px] font-sans font-semibold uppercase tracking-widest">View</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </motion.div>
                  </div>
                </div>
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
