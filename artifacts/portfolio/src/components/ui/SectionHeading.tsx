import { motion } from 'framer-motion';

interface SectionHeadingProps {
  num: string;
  title: string;
}

export function SectionHeading({ num, title }: SectionHeadingProps) {
  return (
    <div className="flex flex-col mb-12 w-full max-w-4xl">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7 }}
        className="flex items-baseline gap-6"
      >
        <span className="text-sm md:text-lg font-sans font-light text-muted-foreground uppercase tracking-widest">{num} —</span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-foreground tracking-tight">
          {title}
        </h2>
      </motion.div>
      
      <motion.div 
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="h-[1px] w-full bg-white/10 mt-8 origin-left"
      />
    </div>
  );
}
