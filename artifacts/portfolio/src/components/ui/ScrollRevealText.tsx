import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

interface ScrollRevealTextProps {
  text: string;
  className?: string;
  from?: string;
  to?: string;
  characterClassName?: string;
  isActive?: boolean;
}

export function ScrollRevealText({ 
  text, 
  className, 
  from = "rgba(255, 255, 255, 0.1)", 
  to = "#c5c1b0",
  characterClassName = "",
  isActive
}: ScrollRevealTextProps) {
  const targetRef = useRef<HTMLSpanElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start 0.9", "end 0.6"]
  });

  const characters = text.split("");

  return (
    <span ref={targetRef} className={className}>
      {characters.map((char, i) => {
        if (isActive !== undefined) {
          return (
            <motion.span
              key={i}
              initial={{ color: from }}
              animate={{ color: isActive ? to : from }}
              transition={{ 
                duration: 0.5, 
                delay: isActive ? i * 0.03 : (characters.length - i) * 0.01,
                ease: "easeOut"
              }}
              className={characterClassName}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          );
        }

        const start = i / characters.length;
        const end = start + 1 / characters.length;
        return (
          <Character 
            key={i} 
            progress={scrollYProgress} 
            range={[start, end]} 
            from={from} 
            to={to}
            className={`transition-colors duration-500 ${characterClassName}`}
          >
            {char}
          </Character>
        );
      })}
    </span>
  );
}

function Character({ 
  children, 
  progress, 
  range, 
  from, 
  to,
  className
}: { 
  children: string; 
  progress: any; 
  range: [number, number];
  from: string;
  to: string;
  className?: string;
}) {
  const color = useTransform(progress, range, [from, to]);
  return (
    <motion.span style={{ color }} className={className}>{children}</motion.span>
  );
}
