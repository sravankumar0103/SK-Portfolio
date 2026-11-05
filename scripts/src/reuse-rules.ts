export interface ReuseRule {
  id: string;
  audit: string;
  pattern: RegExp;
  allowIn?: readonly string[];
  message: string;
}

export const RULES: ReuseRule[] = [
  {
    id: 'no-text-reveal',
    audit: 'C8',
    pattern: /text-reveal/,
    message: 'The .text-reveal* classes and their observer are dead; do not reintroduce them.',
  },
  {
    id: 'no-dead-css-classes',
    audit: 'C9',
    pattern: /\.(glow-primary|mask-up|rule-divider)\b/,
    message: 'These globals.css classes have no consumer; delete them rather than keep them.',
  },
  {
    id: 'no-index-css',
    audit: 'C10',
    pattern: /src\/index\.css/,
    message: 'index.css was dead and is deleted; point tooling at src/globals.css.',
  },
  {
    id: 'no-dark-class',
    audit: 'C12',
    pattern: /classList\.add\('dark'\)|^\.dark \{|@custom-variant dark/,
    message: 'The site has a single dark theme in :root; there is no .dark variant.',
  },
  {
    id: 'no-dead-tokens',
    audit: 'C12',
    pattern: /--(color-)?(sidebar|chart)\b/,
    message: 'Sidebar and chart tokens have no consumer; do not add them back.',
  },
  {
    id: 'no-window-lenis',
    audit: 'C5',
    pattern: /__lenis/,
    message: 'The Lenis instance lives in src/lib/lenis.ts; nothing may read or write window.__lenis.',
  },
  {
    id: 'lenis-easing-once',
    audit: 'C15',
    pattern: /1\.001 - Math\.pow/,
    allowIn: ['src/lib/lenis.ts'],
    message: 'The Lenis easing curve is defined once, as scrollEasing in src/lib/lenis.ts; import it.',
  },
  {
    id: 'native-scroll-in-lenis',
    audit: 'C7',
    pattern: /window\.scroll(To|By)\(/,
    allowIn: ['src/lib/lenis.ts'],
    message: 'Scroll through scrollToY or scrollToElement in src/lib/lenis.ts; they carry the native fallback.',
  },
  {
    id: 'no-any',
    audit: 'C6',
    pattern: /:\s*any\b|\bas any\b|\bany\[\]/,
    message: 'Use the real type: the Sanity interfaces in sanityQueries.ts, Portable Text types, or MotionValue.',
  },
  {
    id: 'fallback-in-hooks',
    audit: 'C2',
    pattern: /\.length\s*\?\s*[\w.?]+\s*:/,
    allowIn: ['src/lib/sanityQueries.ts'],
    message: 'Fallbacks are applied by the hooks and by orFallback in src/lib/sanityQueries.ts; do not write `x.length ? x : fallback` in a component.',
  },
];
