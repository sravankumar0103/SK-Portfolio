import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

interface ScrollRevealTextProps {
  text: string;
  className?: string;
  from?: string;
  to?: string;
}

export function ScrollRevealText({ 
  text, 
  className, 
  from = "#1a1918", 
  to = "#c5c1b0" 
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
        const start = i / characters.length;
        const end = start + 1 / characters.length;
        return (
          <Character key={i} progress={scrollYProgress} range={[start, end]} from={from} to={to}>
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
  to 
}: { 
  children: string; 
  progress: any; 
  range: [number, number];
  from: string;
  to: string;
}) {
  const color = useTransform(progress, range, [from, to]);
  return (
    <motion.span style={{ color }}>{children}</motion.span>
  );
}
