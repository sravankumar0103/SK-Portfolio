import { motion } from 'framer-motion';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center' | 'right';
}

export function SectionHeading({ title, subtitle, align = 'left' }: SectionHeadingProps) {
  const alignClass = align === 'center' ? 'text-center items-center' : align === 'right' ? 'text-right items-end' : 'text-left items-start';
  
  return (
    <div className={`flex flex-col mb-12 md:mb-20 w-full ${alignClass}`}>
      <motion.div
        initial={{ opacity: 0, x: align === 'right' ? 20 : align === 'left' ? -20 : 0, y: align === 'center' ? 20 : 0 }}
        whileInView={{ opacity: 1, x: 0, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7 }}
        className="relative"
      >
        <h2 className="text-3xl md:text-5xl font-black uppercase tracking-wider text-foreground">
          {title}
        </h2>
        <div className="absolute -inset-2 bg-primary/20 blur-xl z-[-1] rounded-full opacity-50" />
      </motion.div>
      
      {subtitle && (
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-primary font-mono text-sm md:text-base mt-4 uppercase tracking-widest glow-text"
        >
          {`// ${subtitle}`}
        </motion.p>
      )}
    </div>
  );
}
