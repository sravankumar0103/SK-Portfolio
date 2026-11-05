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
];
