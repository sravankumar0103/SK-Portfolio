import type { ReactNode } from 'react';

/** The full-height dark page wrapper shared by Home and ProjectDetail. */
export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary/30 selection:text-primary">
      {children}
    </div>
  );
}
