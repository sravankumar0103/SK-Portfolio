import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { Section } from '../layout/Section';
import { SectionHeading } from '../ui/SectionHeading';
import { PillLink } from '../ui/PillLink';
import { useSanityCertifications } from '../../lib/sanityQueries';
import { slideInFromRight } from '../../lib/motion';

export function Certifications() {
  const certs = useSanityCertifications();

  return (
    <Section id="certifications">
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
                  
                  <motion.div {...slideInFromRight(0.1)} className="shrink-0">
                    {cert.link && <PillLink label="View" icon={<ExternalLink />} />}
                  </motion.div>
                </div>
              </div>
            </a>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
