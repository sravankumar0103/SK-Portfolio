import { PortableText, type PortableTextComponents } from '@portabletext/react';
import { imageUrl } from '../../lib/sanity';

// Renders Sanity Portable Text with styling that matches the portfolio's
// dark, editorial theme. Used for the project detail (blog) body.
const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="text-[15px] md:text-base font-sans text-muted-foreground leading-[1.9] my-5">
        {children}
      </p>
    ),
    h2: ({ children }) => (
      <h2 className="text-2xl md:text-3xl font-display font-medium text-foreground mt-14 mb-4">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl md:text-2xl font-display font-medium text-foreground mt-10 mb-3">
        {children}
      </h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-2 border-primary pl-5 my-6 italic text-foreground/80">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc pl-5 my-5 space-y-2 text-muted-foreground marker:text-primary">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal pl-5 my-5 space-y-2 text-muted-foreground marker:text-primary">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => (
      <li className="text-[15px] md:text-base font-sans leading-relaxed">{children}</li>
    ),
    number: ({ children }) => (
      <li className="text-[15px] md:text-base font-sans leading-relaxed">{children}</li>
    ),
  },
  marks: {
    strong: ({ children }) => <strong className="text-foreground font-semibold">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    code: ({ children }) => (
      <code className="px-1.5 py-0.5 rounded bg-white/[0.06] border border-white/10 text-primary text-[0.85em] font-mono">
        {children}
      </code>
    ),
    link: ({ children, value }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary underline underline-offset-4 decoration-primary/40 hover:decoration-primary transition-colors"
      >
        {children}
      </a>
    ),
  },
  types: {
    image: ({ value }: { value: { url?: string; caption?: string } }) => {
      const src = imageUrl(value?.url, 1400);
      if (!src) return null;
      return (
        <figure className="my-8">
          <img
            src={src}
            alt={value?.caption || ''}
            loading="lazy"
            className="w-full rounded-xl border border-white/10"
          />
          {value?.caption && (
            <figcaption className="mt-2 text-xs text-muted-foreground text-center italic">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
  },
};

export function PortableBody({ value }: { value: any[] }) {
  return <PortableText value={value} components={components} />;
}
