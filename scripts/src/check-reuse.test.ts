import { afterEach, beforeEach, test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { listFiles, scan } from './check-reuse.js';
import { RULES } from './reuse-rules.js';
import type { ReuseRule } from './reuse-rules.js';

let root: string;

beforeEach(() => {
  root = fs.mkdtempSync(path.join(os.tmpdir(), 'reuse-'));
});

afterEach(() => {
  fs.rmSync(root, { recursive: true, force: true });
});

function plant(rel: string, content: string): void {
  const full = path.join(root, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content);
}

function rule(over: Partial<ReuseRule> = {}): ReuseRule {
  return { id: 't', audit: 'T1', pattern: /__lenis/, message: 'no', ...over };
}

test('reports a matching line with its root-relative path and 1-based line', () => {
  plant('src/a.tsx', 'ok\nwindow.__lenis = x');
  assert.deepEqual(scan(root, [rule()]), [
    { rule: 't', file: 'src/a.tsx', line: 2, text: 'window.__lenis = x' },
  ]);
});

test('ignores a match in an allowIn file', () => {
  plant('src/lib/lenis.ts', 'ok\nwindow.__lenis = x');
  assert.deepEqual(scan(root, [rule({ allowIn: ['src/lib/lenis.ts'] })]), []);
});

test('scans components.json and index.html but not node_modules or dist', () => {
  plant('components.json', '__lenis');
  plant('index.html', '__lenis');
  plant('src/node_modules/x/a.ts', '__lenis');
  plant('src/dist/a.ts', '__lenis');
  const files = scan(root, [rule()]).map((v) => v.file).sort();
  assert.deepEqual(files, ['components.json', 'index.html']);
});

test('ignores files outside the scanned extensions', () => {
  plant('src/a.md', '__lenis');
  assert.deepEqual(scan(root, [rule()]), []);
});

test('reports one violation per rule per line', () => {
  plant('src/a.ts', '__lenis __lenis');
  assert.equal(scan(root, [rule()]).length, 1);
});

test('returns an empty list for a clean tree', () => {
  plant('src/a.ts', 'const a = 1;\r\nconst b = 2;\r\n');
  assert.deepEqual(scan(root, [rule()]), []);
  assert.deepEqual(listFiles(root), ['src/a.ts']);
});

test('no-dark-class catches a double-quoted classList.add("dark")', () => {
  plant('src/a.ts', 'document.documentElement.classList.add("dark");');
  assert.deepEqual(scan(root, RULES).map((v) => v.rule), ['no-dark-class']);
});

test('primary-literal catches the CSS space syntax hsl(11 81% 57%)', () => {
  plant('src/a.css', 'color: hsl(11 81% 57%);');
  assert.deepEqual(scan(root, RULES).map((v) => v.rule), ['primary-literal']);
});

test('exits 2 when the root has no scannable files', () => {
  // The CLI exits 2 when listFiles finds nothing, so a wrong root can never pass silently.
  plant('src/a.md', 'not scanned');
  assert.deepEqual(listFiles(root), []);
});
