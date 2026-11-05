import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Section } from '../layout/Section';
import { SectionHeading } from '../ui/SectionHeading';
import { ScrollRevealText } from '../ui/ScrollRevealText';
import { useSanityExperience, type SanityExperience } from '../../lib/sanityQueries';
import { VIEWPORT_CENTER_MARGIN, rowEnter, expandOnView } from '../../lib/motion';

export function Experience() {
  const experiences = useSanityExperience();

  return (
    <Section id="experience">
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
    </Section>
  );
}

function ExperienceItem({ data, index }: { data: SanityExperience, index: number }) {
  const isEven = index % 2 === 0;
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: VIEWPORT_CENTER_MARGIN });

  return (
    <motion.div
      ref={ref}
      {...rowEnter}
      className={`relative flex flex-col md:flex-row gap-8 md:gap-16 group ${isEven ? 'md:flex-row-reverse' : ''}`}
    >
      {/* Timeline dot */}
      <div className="absolute -left-[1px] md:left-1/2 md:-ml-[5px] top-2 w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_10px_hsl(var(--primary)/0.5)] z-10" />

      {/* Date */}
      <div className={`hidden md:flex w-1/2 flex-col pt-1 ${isEven ? 'items-start text-left' : 'items-end text-right'}`}>
        <span className="text-xs font-sans text-muted-foreground uppercase tracking-widest">{data.date}</span>
      </div>

      {/* Content Card */}
      <div className={`w-full md:w-1/2 pl-6 md:pl-0 ${isEven ? 'md:text-right' : 'md:text-left'}`}>
        <div className="group-hover:translate-x-1 transition-transform duration-300">
          <h3 className="text-xl sm:text-2xl md:text-4xl font-display font-bold text-foreground mb-1 tracking-tighter">
            <ScrollRevealText text={data.company} isActive={isInView} />
          </h3>
          <div className="text-base font-sans font-medium text-foreground/80 mb-2">{data.role}</div>
          <span className="md:hidden block text-xs font-sans text-muted-foreground uppercase tracking-widest mb-4">{data.date}</span>

          <motion.div className="overflow-hidden" {...expandOnView}>
            <p className="text-sm font-sans text-muted-foreground leading-relaxed pt-2">
              {data.description}
            </p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
