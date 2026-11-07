import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

// The page gutter. Custom section shells (Hero, Contact, ProjectDetail) compose it with cn().
export const CONTAINER = 'container mx-auto px-6 md:px-12';

/** A page section: its vertical rhythm and the centred, gutter-padded container. */
export function Section({
  id,
  className,
  containerClassName,
  children,
}: {
  id: string;
  className?: string;
  containerClassName?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className={cn('py-12 md:py-20 relative', className)}>
      <div className={cn(CONTAINER, containerClassName)}>{children}</div>
    </section>
  );
}
