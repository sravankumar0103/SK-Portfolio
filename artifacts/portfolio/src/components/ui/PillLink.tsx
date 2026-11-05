import type { ReactNode } from 'react';

const PILL =
  'flex items-center gap-2 px-2.5 py-1 text-muted-foreground hover:text-primary transition-all duration-300 hover:bg-white/[0.03] rounded-full border border-white/5 hover:border-primary/20 group/pill [&>svg]:w-3.5 [&>svg]:h-3.5';

/**
 * The small Code / Live / View chip. With an href it is an external link that
 * keeps the click from reaching a parent link; without one it is a plain span,
 * for use inside a row that is already an anchor (no nested anchors).
 */
export function PillLink({ label, icon, href }: { label: string; icon: ReactNode; href?: string }) {
  const content = (
    <>
      <span className="text-[9px] font-sans font-semibold uppercase tracking-widest opacity-70 group-hover/pill:opacity-100 transition-opacity">
        {label}
      </span>
      {icon}
    </>
  );

  if (!href) return <span className={PILL}>{content}</span>;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={PILL}
      onClick={(e) => e.stopPropagation()}
    >
      {content}
    </a>
  );
}
