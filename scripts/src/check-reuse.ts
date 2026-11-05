import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { RULES, type ReuseRule } from './reuse-rules.js';

export interface Violation {
  rule: string;
  file: string;
  line: number;
  text: string;
}

const SCANNED_EXTENSIONS = new Set(['.ts', '.tsx', '.css']);
const ROOT_FILES = ['components.json', 'index.html'];
const SKIPPED_DIRS = new Set(['node_modules', 'dist']);

function collect(dir: string, rel: string, out: string[]): void {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!SKIPPED_DIRS.has(entry.name)) {
        collect(path.join(dir, entry.name), `${rel}/${entry.name}`, out);
      }
    } else if (entry.isFile() && SCANNED_EXTENSIONS.has(path.extname(entry.name))) {
      out.push(`${rel}/${entry.name}`);
    }
  }
}

/** Root-relative, `/`-separated paths of every file the guard scans. */
export function listFiles(root: string): string[] {
  const files = ROOT_FILES.filter((f) => fs.existsSync(path.join(root, f)));
  const srcDir = path.join(root, 'src');
  if (fs.existsSync(srcDir)) collect(srcDir, 'src', files);
  return files;
}

export function scan(root: string, rules: readonly ReuseRule[]): Violation[] {
  const violations: Violation[] = [];
  for (const file of listFiles(root)) {
    const lines = fs.readFileSync(path.join(root, file), 'utf8').split(/\r?\n/);
    for (const rule of rules) {
      if (rule.allowIn?.includes(file)) continue;
      lines.forEach((text, i) => {
        if (rule.pattern.test(text)) {
          violations.push({ rule: rule.id, file, line: i + 1, text });
        }
      });
    }
  }
  return violations;
}

export function format(violations: readonly Violation[]): string {
  const byId = new Map(RULES.map((r) => [r.id, r]));
  const rows = violations.map((v) => {
    const rule = byId.get(v.rule);
    const detail = rule ? `${rule.message} (AUDIT ${rule.audit})` : '';
    return `${v.file}:${v.line}  [${v.rule}] ${detail}`.trimEnd();
  });
  rows.push(`${violations.length} violation${violations.length === 1 ? '' : 's'}`);
  return rows.join('\n');
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const root = path.resolve(
    process.argv[2] ??
      path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../artifacts/portfolio'),
  );
  if (!fs.existsSync(root) || listFiles(root).length === 0) {
    console.error(`check-reuse: no scannable files under ${root}`);
    process.exit(2);
  }
  const violations = scan(root, RULES);
  console.log(format(violations));
  process.exit(violations.length > 0 ? 1 : 0);
}
