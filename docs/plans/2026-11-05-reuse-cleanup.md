# Reuse cleanup Implementation Plan

**Status:** Written 5 Nov 2026. Reviewed against the code and corrected 6 Nov 2026 (baselines re-derived, regex-escaping, reduced-motion and hero-pause fixes). Not started. Nothing in this plan is implemented.

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **Execution:** paste the prompt in [Execution prompt](#execution-prompt) into a fresh session at `/model sonnet`, `/effort high`. `CLAUDE.md`: pass an explicit `model` on every dispatch.

**Goal:** Every duplicate and every piece of dead code listed in `AUDIT_REPORT.md` Track C, plus the six more found while writing this plan (C12–C17), is removed. A CI guard stops them coming back. The site looks and behaves the same for a visitor, except for the two changes the owner approves in Questions 4 and 5.

**Architecture:** First a small, dependency-free guard script (`scripts/src/check-reuse.ts`, run in CI) bans each duplicated literal outside the one file that owns it. Each later task follows the same test-first cycle. It adds its rule, watches the guard fail with the exact baseline count below, moves the literal into one owner (`lib/lenis.ts`, `lib/motion.ts`, `lib/fallbackContent.ts`, `Section`, `PageShell`, `PillLink`, or a `globals.css` token), and watches the guard pass. Behaviour is pinned by `tsc`, the production build and the guard, and by owner browser checks for the parts a script cannot see.

**Tech Stack:** React 19, Vite 7, Tailwind v4, Framer Motion 12, Lenis 1.3, TanStack Query 5, TypeScript 5.9, pnpm 10 workspaces, Node 24. Tests use the built-in `node:test` through `tsx` (already in the catalog). No new dependency, no new top-level folder.

**Spec:** [`docs/AUDIT_REPORT.md`](../AUDIT_REPORT.md) Track C (C1–C10) and its duplicate-file section, plus [Findings beyond the audit](#findings-beyond-the-audit) below (C12–C17), which Task 10 writes into the audit. The rules come from [`CLAUDE.md`](../../CLAUDE.md), especially "Reuse before you write. No duplicates." and "Traps". Read [`docs/specs/DESIGN_UPGRADE.md`](../specs/DESIGN_UPGRADE.md) §1 (motion table) and §6 (Lenis ↔ GSAP, accessibility) before Tasks 4, 7 and 9.

**Branch:** `reuse-cleanup`, cut from `main` in the current checkout (no worktree), one PR into `main`. Pushing `main` deploys `sravankumar.online`, so nothing in this plan is pushed. The owner opens the PR.

---

## Questions for the owner

Each has a default, so the run can proceed. None blocks Tasks 1, 2, 4–8 or 10.

1. **Branch (default: branch + PR).** Run on `reuse-cleanup` and open a PR into `main`, so CI runs before anything deploys. If you say "commit on main", the run commits straight to `main` and never pushes.
2. **Uncommitted docs (default: you commit them first).** `CLAUDE.md` (new), `.gitignore` (local tooling ignored), and the new `docs/` folder (`AUDIT_REPORT.md` moved and modified, `DESIGN_UPGRADE.md` moved, this plan) are uncommitted. Commit them on `main` before the run starts (`Add CLAUDE.md rules, move docs into docs/ and refresh audit`), so the branch diff is only this plan's work. If not, Task 10 stops at its Step 0 and asks, because agents cannot stage partial files.
3. **Dead dependencies (default: remove all five).** `gsap`, `@gsap/react`, `date-fns`, `next-themes` and `react-icons` are declared in `artifacts/portfolio/package.json` and imported nowhere (C13). `DESIGN_UPGRADE.md` §6 plans to use GSAP later. Removing it now costs one `pnpm add` when that work starts. Say "keep gsap" and Task 3 removes three, while Task 10 lists `gsap`/`@gsap/react` in CLAUDE.md Traps as unused on purpose.
4. **Certifications chip look (default: yes).** The "View" chip in Certifications and the "Code"/"Live" chips in Projects are near-copies. They differ in two ways: Certifications keeps a faint `bg-white/[0.03]` at rest where Projects shows it only on hover, and the Projects label sits at `opacity-70` until hover where the Certifications "View" label is always full strength. Merging them into one `PillLink` (C4) gives the Certifications chip both Projects behaviours — no resting background **and** a dimmer label until you hover it. That is the only visual change in Tasks 1–8. Say "no" and `PillLink` takes a `filled` prop that restores both.
5. **Reduced motion (default: in this plan).** The site has no `prefers-reduced-motion` handling (C17). `CLAUDE.md` and `DESIGN_UPGRADE.md` §6 call that non-negotiable. Task 9 adds it. Visitors without the OS setting see no change. Visitors who have it get native scrolling, a still hero and no slide-ins. Say "later" and Task 9 is dropped and logged as open.
6. **`mockup-sandbox` (default: leave it; not in this plan).** Its six files still duplicate the portfolio's. The options are leaving it, deleting the package, or extracting `lib/ui`. That decision only affects a package that is never deployed.

## Plan-level decisions

1. **The guard is the test runner.** The portfolio has no test suite, and adding Vitest would be a dependency change. Instead `scripts/src/check-reuse.ts` holds a list of rules. A rule is a regex plus the one file allowed to contain it. A task's "failing test" is its new rule, and the exact baseline count in the [rule table](#guard-rule-table) is the expected failure. The guard itself is unit-tested with `node:test`.
2. **Behaviour-preserving by default.** Constants keep today's values, even where `DESIGN_UPGRADE.md` §1 proposes new ones. This plan only gives each value one home, so §1 later becomes an edit to a single line. The deliberate behaviour changes are Q4, Q5 and decision 5.
3. **Lenis lives in a module, not on `window`.** `lib/lenis.ts` keeps the instance in a module-scoped variable (`setLenis` is exported; the getter stays private), which deletes `window.__lenis` and all its `as any` casts. Nothing outside the bundle reads it. Callers never touch Lenis directly. They call `scrollToY`/`scrollToElement`, which carry the native fallback. This survives `DESIGN_UPGRADE.md` §6, where GSAP's ticker takes over the RAF: only `SmoothScroll` changes then.
4. **Exact duplicates become named things; one-offs import the constants.** A motion block that appears identically twice becomes a named preset in `lib/motion.ts` (`rowEnter`, `expandOnView`, `slideInFromRight`). A block that appears once stays inline but imports `EASE_*` and `VIEWPORT_CENTER_MARGIN`. A tech chip that differs by design (Projects 9px versus ProjectDetail 10px) is left alone: it has two occurrences, not three (CLAUDE.md "the second occurrence is the warning").
5. **Unified scroll-jump semantics.** `scrollToY(top, { immediate: true })` always calls `lenis.resize()` and then `scrollTo(top, { immediate: true, force: true })`. Today Home does the `resize()` and ProjectDetail does the `force`, and each is harmless for the other. This is the only behaviour merge in Task 4, and it is Review Focus item 1.
6. **Colours that framer-motion interpolates stay concrete.** `useTransform`/`animate` cannot interpolate `hsl(var(--primary))`, so `ScrollRevealText`'s three tones keep literal colour strings, in one map inside that component, behind a `tone` prop that replaces `from`/`to`. Everything rendered by CSS uses the token: `hsl(var(--primary) / <alpha>)`.
7. **One easing token in CSS.** A plain (non-`inline`) `@theme { --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1); }` in `globals.css` gives both `var(--ease-out-expo)` for custom CSS and the `ease-out-expo` Tailwind utility. Use `@theme`, not `@theme inline`: the inline form does not emit the variable, so `var()` would resolve to nothing. No `--ease-out-quint` CSS token, because no CSS uses that curve (YAGNI).
8. **Fallbacks are wired in the hook, so a component cannot forget one.** The list hooks return `T[]` (never `undefined`) through a private `useSanityList`. Small fallback content moves to `lib/fallbackContent.ts`, and project fallbacks stay in `lib/projectsData.ts`. CLAUDE.md is updated to name both files (Task 10).
9. **Commit messages follow CLAUDE.md, not the anthill convention.** Use plain sentence case, matching `git log` (`Remove unused UI components and orphaned dependencies, clean up docs`). No `type(scope):` prefix, no `Co-Authored-By`, no "Generated with", no AI attribution. This overrides any harness default trailer.

## Findings beyond the audit

Found while writing this plan (5 Nov 2026), verified by grep and diff. Task 10 adds them to `AUDIT_REPORT.md` Track C.

| ID | Finding | Owner task |
|---|---|---|
| C12 | `.dark { … }` in `globals.css` redefines 29 tokens with the same values `:root` already has. No component uses a `dark:` variant, so `@custom-variant dark` and both `document.documentElement.classList.add('dark')` effects (Home, ProjectDetail) do nothing. 31 `--sidebar`/`--chart-*` token lines remain in `globals.css` (plus 26 in the dead `index.css`) from components deleted on 2 Nov. | 2 |
| C13 | Five declared dependencies have no import anywhere: `gsap`, `@gsap/react`, `date-fns`, `next-themes`, `react-icons`. The CLAUDE.md trap "two icon libraries coexist knowingly" is therefore wrong: only `lucide-react` is used. | 3 |
| C14 | The project-link rules are written twice: "hexapod has no code link" (`NO_CODE_SLUGS` in Projects, `slug !== 'hexapod-robotic-arm'` in ProjectDetail), and "a `live` of `'#'` means none" (`!== '#'` in both). | 8 |
| C15 | The Lenis easing function is typed out 3× (SmoothScroll, Navbar, Contact). `BackToTop`, which is kept for `DESIGN_UPGRADE.md` §5, scrolls with `window.scrollTo`, so it would fight Lenis the day it is wired up. | 4 |
| C16 | Colour literals sit in components: `hsl(11, 81%, 57%)` ×3, `hsla(11,81%,57%,…)` shadows ×2, reveal colours `#c5c1b0`/`#1a1918`/`rgba(255,255,255,0.1)` ×9. `globals.css` also has 7 primary literals where `hsl(var(--primary) / a)` would do. About renders the same `ScrollRevealText` twice, once in each branch of its fallback. | 7 |
| C17 | There is no `prefers-reduced-motion` handling anywhere (no `MotionConfig`, no `useReducedMotion`, no media query). This contradicts `CLAUDE.md` Working rules and `DESIGN_UPGRADE.md` §6. | 9 |
| — | `Home` and `ProjectDetail` share the same page shell (`min-h-screen bg-background text-foreground overflow-x-hidden selection:…`). | 8 |

Checked and **not** a problem, so leave these alone. The two `@theme inline` blocks in `globals.css` are different: block 1 is an inlined copy of `tw-animate-css` that the toast and tooltip animations need, and block 2 holds the colour tokens. `@types/three` and `@types/*` have no import because they are type packages.

## Global Constraints

- **pnpm only.** `npm`/`yarn` are blocked by the root `preinstall`. Never run a dev server; ask the owner.
- **The gate after every task:** `pnpm run typecheck && pnpm --filter portfolio run build && pnpm run check:reuse` (the last command exists from Task 1 on), all clean.
- **Bundle budget.** Baseline (5 Nov 2026): JS `1,603.55 kB` (gzip `470.06 kB`), CSS `75.37 kB` (gzip `12.84 kB`). No task may grow JS by more than 2 kB minified. CSS must end smaller than the baseline. Record both numbers in every task report.
- **No new dependency, no new top-level folder** (`CLAUDE.md`). Task 3 removes dependencies and adds none. Never touch `minimumReleaseAge`.
- **Never edit** `artifacts/mockup-sandbox`, `studio/`, the dormant backend (`artifacts/api-server`, `lib/*`), or `src/lib/utils.ts` (it is byte-identical with the sandbox copy, and editing one side creates a near-copy).
- **Keep** `BackToTop`, `CustomCursor`, the HeroScene off-screen pause, the single Lenis RAF loop, desktop-only nav, every Sanity fallback, and the inlined `tw-animate-css` block in `globals.css`.
- **No `any`**, and no new `as` cast except `as const`.
- **Commits:** plain sentence case, no prefix, no `Co-Authored-By`, no "Generated with", no AI attribution. Stage files by name, never `git add -A`. Do not push.

## Review Focus

1. **Hash return from a project page.** Go to a project, click "See more projects", and you should land on that project's row (`/#project-<slug>`), not the top and not short of it, even while the hero canvas and CMS content are still loading. This exercises the merged `scrollToY(…, { immediate: true })` (decision 5) and `reassert`. *Pinned by:* Task 4 Step 6, owner check.
2. **Sanity unreachable or empty.** With the network to `*.api.sanity.io` blocked, every section still renders its fallback: projects, experience, skills, certifications, socials and email. A project page still renders from `fallbackProjectDetails`, with `tech` from the fallback taking precedence (the reversed order in `resolveDetail` must survive). *Pinned by:* Task 6 Step 6, owner check.
3. **Scroll position across client-side navigation.** A project page opens at the top even when you arrive from far down the home page. Nav clicks land 100px above the section heading. Contact's back-to-top button scrolls smoothly to the top. *Pinned by:* Task 4 Step 6.
4. **Pixel parity of refactored sections.** About, Experience, Skills, Projects and Certifications look the same at 1440px and 390px before and after Tasks 7–8, including the scroll-linked title colour sweep and the row scale-in. *Pinned by:* Task 8 Step 7.
5. **Reduced motion is off by default.** A visitor without the OS setting sees exactly today's motion. With it on, the page is still fully usable: nav jumps, the hash return works through the native fallback, and the hero shows a still frame rather than a blank canvas. *Pinned by:* Task 9 Step 5.

## File structure

All paths are under `artifacts/portfolio/` unless they start with `scripts/`, `.github/` or a root file name.

- **Create:** `scripts/src/check-reuse.ts`, `scripts/src/reuse-rules.ts`, `scripts/src/check-reuse.test.ts`; `src/lib/lenis.ts`, `src/lib/motion.ts`, `src/lib/fallbackContent.ts`; `src/components/layout/Section.tsx`, `src/components/layout/PageShell.tsx`; `src/components/ui/PillLink.tsx`.
- **Delete:** `src/index.css`, `scripts/src/hello.ts`.
- **Modify:** `src/main.tsx`, `src/globals.css`, `components.json`, `package.json` (portfolio); `src/App.tsx`; `src/components/ui/{SmoothScroll,BackToTop,ScrollRevealText,PortableBody}.tsx`; `src/components/layout/Navbar.tsx`; `src/components/3d/HeroScene.tsx`; `src/components/sections/{About,Experience,Skills,Projects,Certifications,Contact,Hero}.tsx`; `src/pages/{Home,ProjectDetail}.tsx`; `src/lib/{sanityQueries,projectsData}.ts`; `scripts/package.json`; root `package.json`; `pnpm-workspace.yaml`; `pnpm-lock.yaml`; `.github/workflows/ci.yml`; and docs in Task 10.

## Guard rule table

Each rule is added by its task's first step. "Baseline" is the violation count on 5 Nov 2026 (`main` at `b34a1f3`), which is the expected failure when the rule is added. `allowIn` paths are relative to `artifacts/portfolio`.

**Copy each pattern from this block, never from the table below.** A markdown table cell cannot
hold a bare `|`, and `\|` in a JS regex matches a literal pipe character — a rule written that way
matches nothing and reports 0. No pattern carries the `g` or `y` flag either: `RegExp.test` is
stateful with those and would skip every second match on a line.

```ts
// scripts/src/reuse-rules.ts — each rule's `pattern`, by id
'no-text-reveal':         /text-reveal/,
'no-dead-css-classes':    /\.(glow-primary|mask-up|rule-divider)\b/,
'no-index-css':           /src\/index\.css/,
'no-dark-class':          /classList\.add\('dark'\)|^\.dark \{|@custom-variant dark/,
'no-dead-tokens':         /--(color-)?(sidebar|chart)\b/,
'no-window-lenis':        /__lenis/,
'lenis-easing-once':      /1\.001 - Math\.pow/,
'native-scroll-in-lenis': /window\.scroll(To|By)\(/,
'no-any':                 /:\s*any\b|\bas any\b|\bany\[\]/,
'fallback-in-hooks':      /\.length\s*\?\s*[\w.?]+\s*:/,
'ease-constants':         /0\.22,\s*1,\s*0\.36,\s*1|0\.16,\s*1,\s*0\.3,\s*1/,
'viewport-constants':     /-30% 0px -30% 0px/,
'primary-literal':        /hsla?\(11,\s*81%,\s*57%/,
'reveal-colours':         /#c5c1b0|#1a1918|rgba\(255,\s*255,\s*255,\s*0\.1\)/,
'container-shell':        /container mx-auto (max-w-\w+ )?px-6 md:px-12/,
'page-shell':             /min-h-screen bg-background text-foreground overflow-x-hidden/,
'pill-chip':              /gap-2 px-2\.5 py-1 /,
'project-link-rules':     /hexapod-robotic-arm|!==\s*'#'/,
```

Baselines below were re-derived on 6 Nov 2026 by running these exact patterns over the scan set,
with `allowIn` applied — an allowed file's matches are **not** counted.

| Rule id | allowIn | Baseline | Task |
|---|---|---|---|
| `no-text-reveal` | — | 10 (globals.css 9, main.tsx 1) | 2 |
| `no-dead-css-classes` | — | 4 (globals.css) | 2 |
| `no-index-css` | — | 1 (components.json) | 2 |
| `no-dark-class` | — | 6 | 2 |
| `no-dead-tokens` | — | 57 (globals.css 31, index.css 26) | 2 |
| `no-window-lenis` | — | 6 | 4 |
| `lenis-easing-once` | `src/lib/lenis.ts` | 3 | 4 |
| `native-scroll-in-lenis` | `src/lib/lenis.ts` | 5 | 4 |
| `no-any` | — | 11 (6 removed by Task 4) | 5 |
| `fallback-in-hooks` | `src/lib/sanityQueries.ts` | 7 | 6 |
| `ease-constants` | `src/lib/motion.ts`, `src/globals.css` | 10 (globals.css's 6 are allowed, so not counted) | 7 |
| `viewport-constants` | `src/lib/motion.ts` | 8 | 7 |
| `primary-literal` | `src/components/ui/ScrollRevealText.tsx` | 12 (globals.css 7; Task 2 deletes 2 of them, so expect 10 at Task 7) | 7 |
| `reveal-colours` | `src/components/ui/ScrollRevealText.tsx` | 7 (its own 2 are allowed) | 7 |
| `container-shell` | `src/components/layout/Section.tsx` | 11 (7 sections + ProjectDetail 4, which use `max-w-7xl`/`max-w-3xl`) | 8 |
| `page-shell` | `src/components/layout/PageShell.tsx` | 2 | 8 |
| `pill-chip` | `src/components/ui/PillLink.tsx` | 3 | 8 |
| `project-link-rules` | `src/lib/projectsData.ts` | 4 outside projectsData.ts | 8 |

Earlier tasks can change a later task's baseline (the table notes where). The implementer reports the actual count at the failing step and explains any difference before going on.

---

### Task 1: The reuse guard

**Files:**
- Create: `scripts/src/check-reuse.ts`, `scripts/src/reuse-rules.ts`, `scripts/src/check-reuse.test.ts`
- Delete: `scripts/src/hello.ts` and the `hello` script (dead, CLAUDE.md "never leave dead code"; in scope because this task edits the package)
- Modify: `scripts/package.json`, root `package.json`, `.github/workflows/ci.yml`

**Interfaces:**
- Consumes: nothing.
- Produces:
  - `reuse-rules.ts`: `export interface ReuseRule { id: string; audit: string; pattern: RegExp; allowIn?: readonly string[]; message: string }` and `export const RULES: ReuseRule[] = []`. Later tasks append to this array and change nothing else in the guard.
  - `check-reuse.ts`: `export interface Violation { rule: string; file: string; line: number; text: string }`, `export function scan(root: string, rules: readonly ReuseRule[]): Violation[]`, `export function format(violations: readonly Violation[]): string`. CLI: `tsx src/check-reuse.ts [root]`. The default root is `path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../artifacts/portfolio')` — the script lives in `scripts/src/`, so it has to climb two levels, and `../artifacts/portfolio` would resolve to the non-existent `scripts/artifacts/portfolio`. Exit `2` with an error if the root does not exist or zero files were scanned, so a silent wrong-root pass is impossible. The CLI block runs **only** under `if (import.meta.url === pathToFileURL(process.argv[1]).href)`: without that guard the test file's `import { scan }` would run the CLI and `process.exit` mid-test. It prints `file:line  [rule-id] message (AUDIT id)` per violation and a count, then exits `1` on any violation and `0` on none.
  - Scan set: `src/**/*.{ts,tsx,css}` plus `components.json` and `index.html` at the root. It skips `node_modules` and `dist`. `file` is root-relative with `/` separators. `allowIn` is exact path equality. A line gets one violation per rule however many times it matches. Lines are 1-based.
  - Commands: `pnpm run check:reuse` (root) → `pnpm --filter @workspace/scripts run check:reuse`; `pnpm --filter @workspace/scripts run test` → `tsx --test ./src/*.test.ts`.

- [ ] **Step 1: Write the failing tests** in `check-reuse.test.ts` (`node:test`, `node:assert/strict`, a temp tree from `fs.mkdtempSync(path.join(os.tmpdir(), 'reuse-'))`):
  - `reports a matching line with its root-relative path and 1-based line` → `src/a.tsx` containing `ok\nwindow.__lenis = x` gives `[{ rule: 't', file: 'src/a.tsx', line: 2, text: 'window.__lenis = x' }]` for a rule `/__lenis/`
  - `ignores a match in an allowIn file` → the same content in `src/lib/lenis.ts` with `allowIn: ['src/lib/lenis.ts']` gives `[]`
  - `scans components.json and index.html but not node_modules or dist` → matches planted in `components.json` and `index.html` are reported; the same planted in `src/node_modules/x/a.ts` and `src/dist/a.ts` are not. Plant them **inside** `src/`: at the tree root those two paths are outside the scan set anyway, so the test would pass without the skip logic existing
  - `ignores files outside the scanned extensions` → a match in `src/a.md` gives `[]`
  - `reports one violation per rule per line` → a line with two matches gives one violation
  - `returns an empty list for a clean tree`
  - `exits 2 when the root has no scannable files` → `scan` on an empty temp dir, asserting the CLI's guard condition (zero files scanned) rather than returning `[]` silently
- [ ] **Step 2: Run, expect FAIL** (module missing): `pnpm --filter @workspace/scripts run test`
- [ ] **Step 3: Implement** `scan` and `format` with `fs.readdirSync(…, { withFileTypes: true })` recursion and `split(/\r?\n/)` (the repo has CRLF working copies). Use only Node built-ins. Add `"check:reuse": "tsx ./src/check-reuse.ts"` and `"test": "tsx --test ./src/*.test.ts"` to `scripts/package.json` and remove `"hello"`. Add `"check:reuse": "pnpm --filter @workspace/scripts run check:reuse"` to the root `package.json`. Add a CI step after "Typecheck": `- name: Reuse guard` / `run: pnpm run check:reuse && pnpm --filter @workspace/scripts run test`.
- [ ] **Step 4: Run, expect PASS:** `pnpm --filter @workspace/scripts run test` (7 pass), `pnpm run check:reuse` (exit 0, "0 violations", since `RULES` is empty), then the gate.
- [ ] **Step 5: Commit** `Add a reuse guard that bans duplicated literals outside their owning file` (the three new files, the deleted `hello.ts`, both `package.json` files, `ci.yml`).

---

### Task 2: Delete dead code and dead tokens (C8, C9, C10, C12)

**Files:**
- Delete: `src/index.css`
- Modify: `src/main.tsx` (delete the `revealObserver`, `observeTextReveals`, `mutationObserver` and `DOMContentLoaded` block, lines 5–26), `src/globals.css` (the `.text-reveal*` rules; `.glow-primary`, `.mask-up`, `.rule-divider`; the `.dark { … }` block; `@custom-variant dark`; every `--sidebar`, `--sidebar-*`, `--color-sidebar`, `--color-sidebar-*`, `--chart-*` and `--color-chart-*` line — the bare `--sidebar:` and `--color-sidebar:` base tokens count too, which is why the rule ends in `\b` rather than `-`), `components.json` (`"css": "src/index.css"` → `"src/globals.css"`), `src/pages/Home.tsx` and `src/pages/ProjectDetail.tsx` (delete the `classList.add('dark')` effect; ProjectDetail keeps the rest of its effect), `pnpm-workspace.yaml` (drop the `lib/integrations/*` glob; change both "Must be this exact version because expo requires it" comments to "Pinned: the portfolio declares this exact version"), `scripts/src/reuse-rules.ts`

**Interfaces:**
- Consumes: Task 1's `RULES`.
- Produces: none. After this task `globals.css` holds no class or token that no component reads, except the inlined `tw-animate-css` block, which is kept on purpose.

- [ ] **Step 1: Add the five Task 2 rules** from the [rule table](#guard-rule-table), each with `audit` set (`C8`, `C9`, `C10`, `C12`, `C12`).
- [ ] **Step 2: Run, expect FAIL:** `pnpm run check:reuse` reports **78** violations: `no-text-reveal` 10, `no-dead-css-classes` 4, `no-index-css` 1, `no-dark-class` 6, `no-dead-tokens` 57. They span `globals.css`, `index.css`, `main.tsx`, `components.json`, `Home.tsx` and `ProjectDetail.tsx`.
- [ ] **Step 3: Delete** everything listed under Files. Before deleting a `globals.css` rule, grep its class or token name across `src` and confirm it has 0 uses. Leave `gold-text`, `hover-lift`, `premium-card`, `premium-card-hover`, `glow-hover`, `premium-gradient-text` and `lenis` (all live).
- [ ] **Step 4: Run** `pnpm install --frozen-lockfile` (proves the workspace edit changed no resolution), then the gate. Expect PASS, JS within 0.5 kB of baseline (only the observer goes), and CSS below `75.37 kB`. Run `npx impeccable detect artifacts/portfolio/src`: expect 4 findings, down from 5, because the Space Grotesk import in `index.css` is gone.
- [ ] **Step 5: Commit** `Remove the unused reveal observer, dead CSS, the duplicate dark theme and the orphaned index.css`.

---

### Task 3: Remove unused dependencies (C13)

**Files:**
- Modify: `artifacts/portfolio/package.json`, `pnpm-lock.yaml`

**Interfaces:** none.

- [ ] **Step 1: Prove each is unused** (this is the failing-test equivalent; it must print nothing): `grep -rnE "from ['\"](gsap|@gsap/react|date-fns|next-themes|react-icons)" artifacts/portfolio/src artifacts/portfolio/vite.config.ts`. If anything prints, stop and report.
- [ ] **Step 2: Remove** with `pnpm --filter portfolio remove gsap @gsap/react date-fns next-themes react-icons`. If the owner said "keep gsap" (Q3), drop the first two from the command.
- [ ] **Step 3: Run the gate.** Expect JS and CSS byte-identical to Task 2's numbers (nothing imported them).
- [ ] **Step 4: Commit** `Remove five dependencies nothing imports` (the portfolio `package.json` and `pnpm-lock.yaml` only).

---

### Task 4: One Lenis module (C5, C7, C15)

**Files:**
- Create: `src/lib/lenis.ts`
- Modify: `src/components/ui/SmoothScroll.tsx`, `src/components/layout/Navbar.tsx` (`handleClick`), `src/components/sections/Contact.tsx` (the back-to-top `onClick`), `src/pages/Home.tsx` (`jump` and its timer array), `src/pages/ProjectDetail.tsx` (`toTop` and its timers), `src/components/ui/BackToTop.tsx` (`scrollToTop`), `scripts/src/reuse-rules.ts`

**Interfaces:**
- Consumes: `import type Lenis from 'lenis'`.
- Produces (all in `src/lib/lenis.ts`):
  - `export const SCROLL_DURATION = 1.2`
  - `export const scrollEasing = (t: number): number => Math.min(1, 1.001 - Math.pow(2, -10 * t))`
  - `export function setLenis(instance: Lenis | null): void`, backed by a module-scoped variable (decision 3). The matching `getLenis(): Lenis | null` stays **module-private**: by decision 3 no caller outside `lenis.ts` touches the instance, so exporting it would only invite one to.
  - `export function scrollToY(top: number, options?: { immediate?: boolean }): void`. Smooth: `lenis.scrollTo(top, { duration: SCROLL_DURATION, easing: scrollEasing })`, else `window.scrollTo({ top, behavior: 'smooth' })`. Immediate: `lenis.resize(); lenis.scrollTo(top, { immediate: true, force: true })`, else `window.scrollTo({ top })` (decision 5).
  - `export function scrollToElement(target: HTMLElement, offsetTop: number): void`. With Lenis: `lenis.scrollTo(target, { offset: -offsetTop, duration: SCROLL_DURATION, easing: scrollEasing })`. Without: `window.scrollBy({ top: target.getBoundingClientRect().top - offsetTop, behavior: 'smooth' })`.
  - `export function reassert(fn: () => void, delaysMs: readonly number[]): () => void` schedules `fn` at each delay and returns a cancel that clears them all.

- [ ] **Step 1: Add** `no-window-lenis`, `lenis-easing-once` and `native-scroll-in-lenis` (audit `C5`, `C15`, `C7`).
- [ ] **Step 2: Run, expect FAIL** with 14 violations (6 + 3 + 5).
- [ ] **Step 3: Write `src/lib/lenis.ts`.** If `resize` is not on the `Lenis` type in `node_modules/lenis/dist/lenis.d.ts`, keep `lenis.resize?.()` and say so. Never cast.
- [ ] **Step 4: Rewire the call sites.**
  - `SmoothScroll` builds Lenis with `duration: SCROLL_DURATION, easing: scrollEasing`, calls `setLenis(lenis)`, and on cleanup calls `setLenis(null)` and `lenis.destroy()`. **Also keep the id returned by `requestAnimationFrame` and `cancelAnimationFrame` it in that cleanup** (`SmoothScroll.tsx:32-37` never does today). The effect's `[]` makes that harmless now, but Task 9 gives it a dependency, and an un-cancelled loop would then run beside the new one — the second RAF loop CLAUDE.md forbids. In dev it already double-fires under StrictMode.
  - `Navbar` calls `scrollToElement(target, SCROLL_MARGIN_TOP)`.
  - `Contact` and `BackToTop` call `scrollToY(0)`.
  - `Home.jump` calls `scrollToY(top, { immediate: true })` and uses `reassert(jump, [40, 150, 320, 550, 850, 1300, 1900])` in place of its `timers` array. Keep its `ResizeObserver`, the stop listeners and the 2300 ms hard stop.
  - `ProjectDetail` calls `toTop()` once, then `reassert(toTop, [0, 60, 160])`, where `toTop = () => scrollToY(0, { immediate: true })`.
  - Delete the moved comments, and keep one line in `lenis.ts` explaining why callers must not run their own RAF.
- [ ] **Step 5: Run the gate, expect PASS.** `grep -rn "__lenis" artifacts/portfolio/src` prints nothing.
- [ ] **Step 6: Owner browser check** (the orchestrator hands this back; never starts a server). With `pnpm --filter portfolio run dev` at 1440px:
  1. Each nav link lands with the heading about 100px below the bar.
  2. Open a project from far down the page: it opens at the top.
  3. "See more projects" lands on that project's row (Review Focus 1).
  4. Contact's arrow scrolls smoothly to the top.
  5. Wheel and touch scrolling feel unchanged.
- [ ] **Step 7: Commit** `Move all Lenis access into one module with a native fallback`.

**Reviewer looks hardest at:** decision 5 (resize plus force on both immediate paths); that `Home`'s cleanup still cancels everything `reassert` scheduled; that `SmoothScroll` remains the only RAF loop.

---

### Task 5: Type the props (C6)

**Files:**
- Modify: `src/components/sections/Experience.tsx` (`ExperienceItem`), `src/components/sections/Projects.tsx` (`ProjectRow`), `src/components/ui/PortableBody.tsx`, `src/components/ui/ScrollRevealText.tsx` (`Character.progress`), `src/lib/sanityQueries.ts` (`SanityProjectDetail.body`), `src/lib/projectsData.ts` (the `p`/`h2`/`h3`/`bullets` builders), `scripts/src/reuse-rules.ts`

**Interfaces:**
- Consumes: `SanityExperience`, `SanityProject` (existing, `sanityQueries.ts`); `import type { PortableTextBlock } from '@portabletext/react'`. Import only from `@portabletext/react`. `@portabletext/types` is not declared, and importing it is the phantom-dependency bug CLAUDE.md forbids. Also `import type { MotionValue } from 'framer-motion'`.
- Produces: `ExperienceItem({ data, index }: { data: SanityExperience; index: number })`; `ProjectRow({ project, index }: { project: SanityProject; index: number })`; `export interface SanityBodyImage { _type: 'image'; _key?: string; url?: string; caption?: string }` in `sanityQueries.ts`, because the GROQ projection (`sanityQueries.ts:66-69`) returns image members as `{ _type: 'image', url, caption }` with no `children` — `PortableTextBlock[]` alone mistypes them, and `tsc` cannot catch it because `sanityFetch<T>` is unchecked; `SanityProjectDetail.body?: Array<PortableTextBlock | SanityBodyImage>`; `PortableBody({ value }: { value: NonNullable<SanityProjectDetail['body']> })` (PortableText's generic accepts the union, and `PortableBody.tsx:72-91` already renders those image members); the builders return `PortableTextBlock` (or `PortableTextBlock[]` for `bullets`).

- [ ] **Step 1: Add** `no-any` (audit `C6`).
- [ ] **Step 2: Run, expect FAIL** with 5 violations (11 at baseline, minus the 6 `__lenis` casts Task 4 removed).
- [ ] **Step 3: Replace each `any`** with the type above. Fix what `tsc` reports in the builders by annotating return types, not by casting (`_type: 'block'` widens to `string` without the annotation). Drop `(t: string)` in `ProjectRow`'s `tech.map`, since it is now inferred.
- [ ] **Step 4: Run the gate, expect PASS.** Expect JS byte-identical (types only).
- [ ] **Step 5: Commit** `Type section props and Portable Text bodies against the Sanity interfaces`.

---

### Task 6: Fallbacks live in the hooks (C2)

**Files:**
- Create: `src/lib/fallbackContent.ts` (moved from the sections: `fallbackSkills`, `fallbackCertifications` (renamed from `fallbackCerts`), `fallbackExperience` (from `fallbackExperiences`), `fallbackSocials`, `FALLBACK_EMAIL`)
- Modify: `src/lib/sanityQueries.ts`, `src/components/sections/{Skills,Certifications,Experience,Projects,Contact}.tsx`, `src/pages/ProjectDetail.tsx` (`resolveDetail`), `scripts/src/reuse-rules.ts`

**Interfaces:**
- Consumes: `fallbackProjects` from `lib/projectsData.ts` (a value import into `sanityQueries.ts`; `projectsData.ts` already imports only *types* back, so there is no runtime cycle).
- Produces (in `sanityQueries.ts`):
  - `export function orFallback<T>(primary: T[] | null | undefined, fallback: T[]): T[]` plus the overload `(primary, fallback: T[] | undefined): T[] | undefined`. Returns `primary` when it has at least one item, else `fallback`.
  - `useSanityProjects(): SanityProject[]`, `useSanityExperience(): SanityExperience[]`, `useSanitySkills(): SanitySkillGroup[]`, `useSanityCertifications(): SanityCertification[]`, each through a private `useSanityList<T>(key: string, query: string, fallback: T[]): T[]` that keeps today's `queryKey`, `staleTime` and `retry: 1`.
  - `useSanityProject` and `useSanitySiteSettings` are unchanged (single documents, read field by field).

- [ ] **Step 1: Add** `fallback-in-hooks` (audit `C2`).
- [ ] **Step 2: Run, expect FAIL** with 7 violations: 5 sections, plus 2 in `ProjectDetail.resolveDetail`.
- [ ] **Step 3: Implement** `orFallback`, `useSanityList` and the four hooks. Move the fallback arrays to `fallbackContent.ts` and **annotate** each one (`const fallbackSkills: SanitySkillGroup[] = [...]`, and so on). They are untyped literals today (`Experience.tsx:8`, `Certifications.tsx:7`, `Contact.tsx:13`), so there is no existing type to carry over — annotating is what makes a fallback that drifts from its Sanity interface a typecheck failure.
- [ ] **Step 4: Update the call sites.**
  - Sections become `const skills = useSanitySkills();` (no destructuring).
  - `Contact` uses `orFallback(settings?.socials, fallbackSocials)` and `settings?.contactEmail || FALLBACK_EMAIL`.
  - In `resolveDetail`, gallery becomes `orFallback(sanity.gallery, fallback.gallery)` and tech becomes `orFallback(fallback.tech, sanity.tech)`. The argument order is deliberately reversed, because the bundled write-up's tech list wins today (Review Focus 2).
- [ ] **Step 5: Run the gate, expect PASS.**
- [ ] **Step 6: Owner browser check.** In DevTools → Network → Request blocking, block `*.api.sanity.io` and reload `/` and `/projects/arogyalens`. Every section, the socials row and the email render the fallback content. Unblock and reload: the Sanity content shows.
- [ ] **Step 7: Commit** `Apply Sanity fallbacks inside the query hooks so no section can skip one`.

**Reviewer looks hardest at:** the reversed `tech` precedence; that loading still shows the fallback (as before, `data` is `undefined` while loading); that nothing still reads `.data` from the four list hooks (grep the callers).

---

### Task 7: Motion constants and colour tokens (C3, C16)

**Files:**
- Create: `src/lib/motion.ts`
- Modify: `src/components/sections/{Experience,Projects,Certifications,Hero,About,Contact,Skills}.tsx`, `src/components/layout/Navbar.tsx`, `src/pages/ProjectDetail.tsx` (delete its local `EASE`), `src/components/ui/ScrollRevealText.tsx`, `src/globals.css`, `scripts/src/reuse-rules.ts`

**Interfaces:**
- Consumes: `import type { MotionProps } from 'framer-motion'`.
- Produces (in `src/lib/motion.ts`; values copied from today's code, decision 2):
  - `export const EASE_OUT_QUINT = [0.22, 1, 0.36, 1] as const` (`DESIGN_UPGRADE.md` §1 "Hover / micro")
  - `export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const` (§1 "Reveals on scroll")
  - `export const VIEWPORT_CENTER_MARGIN = '-30% 0px -30% 0px'`
  - `export const rowEnter` (`satisfies MotionProps`): `initial { opacity: 1, y: 0, scale: 0.95 }`, `whileInView { opacity: 1, y: 0, scale: 1, transition: { duration: 0.9, ease: EASE_OUT_QUINT } }`, `viewport { once: false, margin: VIEWPORT_CENTER_MARGIN }`. Today this is identical in Experience and Projects.
  - `export const expandOnView` (`satisfies MotionProps`): `initial { height: 0, opacity: 0 }`, `whileInView { height: 'auto', opacity: 1 }`, `viewport` as above, `transition { height: { duration: 0.8, ease: EASE_OUT_QUINT }, opacity: { duration: 0.5, delay: 0.2 } }`. Identical in Experience and Projects.
  - `export function slideInFromRight(delay: number): MotionProps`: `initial { opacity: 0, x: 20 }`, `whileInView { opacity: 1, x: 0 }`, `viewport` as above, `transition { duration: 0.5, delay }`. Certifications uses `0.1` and Projects uses `0.2`.
  - `ScrollRevealText` gets `tone?: 'default' | 'primary' | 'muted'` (default `'default'`) in place of `from`/`to`. Its private `TONES` map holds `default { from: 'rgba(255, 255, 255, 0.1)', to: '#c5c1b0' }`, `primary { from: 'rgba(255, 255, 255, 0.1)', to: 'hsl(11, 81%, 57%)' }` and `muted { from: '#1a1918', to: '#c5c1b0' }`, with a one-line comment that framer-motion cannot interpolate CSS variables (decision 6).
  - `globals.css` gains `@theme { --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1); }` (decision 7).

- [ ] **Step 1: Add** `ease-constants`, `viewport-constants`, `primary-literal` and `reveal-colours` (audit `C3`, `C3`, `C16`, `C16`).
- [ ] **Step 2: Run, expect FAIL** with **35** violations: `ease-constants` 10, `viewport-constants` 8, `primary-literal` 10 (12 at baseline, minus the 2 Task 2 deleted with `.glow-primary` and `.rule-divider`), `reveal-colours` 7.
- [ ] **Step 3: Write `src/lib/motion.ts`** and the `ScrollRevealText` tone map.
- [ ] **Step 4: Rewire the motion call sites.**
  - Experience and Projects: `{...rowEnter}` and `{...expandOnView}`, and `useInView(ref, { margin: VIEWPORT_CENTER_MARGIN })`.
  - Certifications and Projects chips: `{...slideInFromRight(0.1)}` and `{...slideInFromRight(0.2)}`.
  - Hero, Navbar and ProjectDetail: import the `EASE_*` constants.
  - Projects' two `ease-[cubic-bezier(0.16,1,0.3,1)]` classes become `ease-out-expo`.
- [ ] **Step 5: Rewire the colours.**
  - Projects and Contact use `tone="primary"`.
  - About uses `tone="muted"` and renders `ScrollRevealText` once, with `settings?.aboutHighlight || "I don't just write code; I build solutions that work."` (removing the C16 copy). **Check this against `About.tsx:34-39` first.** Today the two branches differ: the no-`aboutPara1` branch shows the hardcoded sentence, not `aboutHighlight`. Collapsing them makes Sanity's `aboutHighlight` appear in that branch where it does not today. If `aboutHighlight` is set in Sanity, that is a visible content change — report it and keep the hardcoded text in the fallback branch unless the owner says otherwise.
  - The Skills and Experience shadows use `hsl(var(--primary)/0.18)` and `hsl(var(--primary)/0.5)` inside the same `shadow-[…]` arbitrary values.
  - In `globals.css`, each `hsla(11, 81%, 57%, a)` becomes `hsl(var(--primary) / a)` and each `hsl(11, 81%, 57%)` becomes `hsl(var(--primary))`. Leave the `65%`/`45%` gradient stops; they are not tokens and are `DESIGN_UPGRADE.md` §1's to change.
  - The remaining `cubic-bezier(0.16, 1, 0.3, 1)` uses become `var(--ease-out-expo)`.
- [ ] **Step 6: Run the gate, expect PASS.** Then prove the CSS still resolves: `grep -o "ease-out-expo[^}]*" artifacts/portfolio/dist/assets/*.css | head -3` shows the utility, and `grep -o "var(--primary)" artifacts/portfolio/dist/assets/*.css | wc -l` is higher than the value you recorded before Step 3 (it is **53** on today's `dist`). Use `grep -o … | wc -l`, not `grep -c`: the built CSS is a single line, so `grep -c` prints `1` before and after and can never show the increase. If an arbitrary shadow did not compile (a `/` inside brackets misparsed), the class is missing from the built CSS: fix that before continuing.
- [ ] **Step 7: Commit** `Centralise easing, viewport and reveal colours; use the primary token in CSS`.

**Reviewer looks hardest at:** that every spread preset equals the inline props it replaced, value for value (`once: false` in particular); that About renders the same text in both the Sanity and fallback cases; the built-CSS proof in Step 6.

---

### Task 8: Shared layout, chips and project-link rules (C1, C4, C14, page shell)

**Files:**
- Create: `src/components/layout/Section.tsx`, `src/components/layout/PageShell.tsx`, `src/components/ui/PillLink.tsx`
- Modify: `src/components/sections/{About,Experience,Skills,Projects,Certifications,Contact,Hero}.tsx`, `src/pages/{Home,ProjectDetail}.tsx`, `src/lib/projectsData.ts`, `scripts/src/reuse-rules.ts`

**Interfaces:**
- Consumes: `cn` from `@/lib/utils` (read only); `slideInFromRight` from Task 7.
- Produces:
  - `Section.tsx`: `export const CONTAINER = 'container mx-auto px-6 md:px-12'` and `export function Section({ id, className, containerClassName, children }: { id: string; className?: string; containerClassName?: string; children: ReactNode })`. It renders `<section id={id} className={cn('py-12 md:py-20 relative', className)}><div className={cn(CONTAINER, containerClassName)}>{children}</div></section>`. This is the one line `DESIGN_UPGRADE.md` §1's spacing change will edit.
  - `PageShell.tsx`: `export function PageShell({ children }: { children: ReactNode })`, the shared `min-h-screen … selection:text-primary` wrapper.
  - `PillLink.tsx`: `export function PillLink({ label, icon, href }: { label: string; icon: ReactNode; href?: string })`. With `href` it renders an `<a target="_blank" rel="noopener noreferrer">` that stops click propagation. Without one it renders a `<span>`, because Certifications' chip already sits inside an `<a>` and nested anchors are invalid. Classes are Projects' current chip classes, with the group renamed `group/pill`. If Q4 is "no", add `filled?: boolean` to switch to Certifications' resting background.
  - `projectsData.ts`: `export function codeUrl(project: { github?: string }, slug?: string): string | undefined` returns `undefined` when there is no `github` or the slug is in the module-private `NO_CODE_SLUGS` (moved from Projects). `export function liveUrl(project: { live?: string }): string | undefined` returns `undefined` when `live` is missing or `'#'`.

- [ ] **Step 1: Add** `container-shell`, `page-shell`, `pill-chip` and `project-link-rules` (audit `C1`, `—`, `C4`, `C14`).
- [ ] **Step 2: Run, expect FAIL** with 20 violations (`container-shell` 11 + `page-shell` 2 + `pill-chip` 3 + `project-link-rules` 4).
- [ ] **Step 3: Write the three components and the two `projectsData.ts` helpers.**
- [ ] **Step 4: Rewire.**
  - About, Experience, Skills, Projects and Certifications use `<Section id=…>`. About passes `containerClassName="relative z-10"`.
  - Hero, Contact and ProjectDetail have their own section shells, so they keep them and use `cn(CONTAINER, '…')`. ProjectDetail has **four** such containers (lines 124, 181, 200, 285), three at `max-w-7xl` and one at `max-w-3xl`: they become `cn(CONTAINER, 'max-w-7xl', …)` and `cn(CONTAINER, 'max-w-3xl', …)`. The `container-shell` rule's `(max-w-\w+ )?` group is what makes these four count, so none can be quietly skipped.
  - Home and ProjectDetail use `<PageShell>`.
  - The Projects Code/Live chips and the Certifications View chip use `<PillLink>`.
  - Projects and ProjectDetail use `codeUrl`/`liveUrl`. ProjectDetail's larger "View Code"/"Live Demo" buttons are a different design and stay as they are.
- [ ] **Step 5: Run the gate, expect PASS.**
- [ ] **Step 6: Run** `npx impeccable detect artifacts/portfolio/src`. Expect the same findings as after Task 2 and none new.
- [ ] **Step 7: Owner browser check** (Review Focus 4) at 1440px and 390px:
  1. Section spacing is unchanged.
  2. The Projects chips work and don't open the detail page.
  3. The Certifications chip has the Projects look (Q4).
  4. The hexapod row and page have no Code button; the CRM row (`live: '#'`) has no Live button.
- [ ] **Step 8: Commit** `Extract Section, PageShell and PillLink; keep project link rules in one place`.

**Reviewer looks hardest at:** that `cn`/`tailwind-merge` drops no class from About's container; that `<span>`/`<a>` is chosen correctly in Certifications; that the Projects row's `onClick` propagation behaviour is unchanged.

---

### Task 9: Respect reduced motion (C17), if the owner agrees (Q5)

**Files:**
- Modify: `src/App.tsx`, `src/components/ui/SmoothScroll.tsx`, `src/components/3d/HeroScene.tsx`, `src/lib/lenis.ts`, `src/globals.css`

**Interfaces:**
- Consumes: framer-motion's `MotionConfig` and `useReducedMotion` (reuse the library's mechanism; don't hand-roll a `matchMedia` hook); Task 4's `setLenis`, `scrollToY` and `scrollToElement`.
- Produces: `lib/lenis.ts` gains a private `prefersReducedMotion(): boolean` (`window.matchMedia('(prefers-reduced-motion: reduce)').matches`). The native fallbacks use `behavior: prefersReducedMotion() ? 'auto' : 'smooth'`.

- [ ] **Step 1: Write the failing check.** It must print `0`: `grep -rcE "MotionConfig|useReducedMotion|prefers-reduced-motion" artifacts/portfolio/src | awk -F: '{s+=$2} END {print s}'`.
- [ ] **Step 2: Implement.**
  - `App` wraps everything in `<MotionConfig reducedMotion="user">`.
  - `SmoothScroll` reads `useReducedMotion()`. When it is true, it creates no Lenis and calls `setLenis(null)`, so every scroll goes native through Task 4's fallback. The effect depends on that value. **The preference is read at mount only.** framer-motion 12's `useReducedMotion` returns `useState(prefersReducedMotion.current)` and does not subscribe to media-query changes (its source carries a "TODO See if people miss automatically updating"), so a visitor who flips the OS setting mid-session sees it apply on reload. Do not claim live switching, and do not hand-roll a `matchMedia` listener to get it — that is a second mechanism beside the library's.
  - `HeroScene` uses `frameloop={!isVisible ? 'never' : reduce ? 'demand' : 'always'}`. **Off-screen stays `'never'` for everyone** — that is CLAUDE.md's hero pause guard, and `isVisible && !reduce ? 'always' : 'demand'` would quietly change the off-screen state to `'demand'` for every visitor, which is not a no-op. `'demand'` applies only while the hero is on screen and the visitor asked for reduced motion: it renders a still first frame rather than the blank canvas `'never'` gives from mount. This deliberately departs from `DESIGN_UPGRADE.md` §6's `frameloop="never"` line, for that reason; say so in the report.
  - `globals.css` gains one `@media (prefers-reduced-motion: reduce)` block that sets `animation-duration`, `animation-iteration-count: 1` and `transition-duration` to `0.01ms !important` on `*, ::before, ::after`, and `scroll-behavior: auto`.
  - `ScrollRevealText`'s colour sweep stays: colour is not motion.
- [ ] **Step 3: Run** the Step 1 command, now non-zero, and the gate. Expect JS growth of 1 kB or less.
- [ ] **Step 4: Owner browser check with the setting off.** Everything matches Task 8's check (Review Focus 5, first half).
- [ ] **Step 5: Owner browser check with the setting on.** Turn on DevTools → Rendering → "Emulate CSS prefers-reduced-motion: reduce" and reload.
  1. Wheel scrolling is native.
  2. The hero shows a still scene.
  3. Sections appear without sliding.
  4. Nav clicks jump.
  5. "See more projects" still lands on the row.
- [ ] **Step 6: Commit** `Respect prefers-reduced-motion across Lenis, Framer Motion, the hero and CSS`.

**Reviewer looks hardest at:** that `getLenis()` returns `null` while reduced, so no caller holds a stale instance; that the off-screen hero frameloop is still `'never'` for a visitor without the preference; that `SmoothScroll`'s effect cancels its RAF and destroys Lenis on cleanup, since the effect now has a dependency and can re-run.

---

### Task 10: Docs

**Files:**
- Modify: `docs/AUDIT_REPORT.md`, `CLAUDE.md`, `WORKSPACE_GUIDE.md`, `docs/specs/DESIGN_UPGRADE.md` (two factual lines only), this plan's `Status` line

- [ ] **Step 0: Check the docs are clean before editing.** Run `git status --short docs CLAUDE.md WORKSPACE_GUIDE.md .gitignore`. Expected: no output. If anything is listed (Q2 was declined), stop and ask the owner to commit it first. `git add -p` is interactive and not available to agents, so the docs commit must be whole files.
- [ ] **Step 1: `AUDIT_REPORT.md`.**
  - Move C1, C2, C4–C10 and the new C12–C17 to "Resolved", one line each with the date. **C3 moves only in part** — the easing, viewport margin and reveal colours are resolved; its entry-variant bullet stays open (see "Not in this plan"). C11 stays open.
  - Also fix these, which this branch makes wrong: the Repo hygiene lines about `pnpm-workspace.yaml` and `hello.ts` (both resolved by Tasks 2 and 1), the Track A item 1 line that lists `gsap` among the bundled libraries, and the "see C7" cross-reference.
  - Correct the "Two icon libraries" skip line (C13: only `lucide-react` remains).
  - Replace the build-state numbers with the final ones, and note the Space Grotesk `impeccable detect` finding as gone.
  - Bump "Last updated".
  - Add one line naming the guard: "`pnpm run check:reuse` (CI) keeps Track C closed; add a rule when you remove a duplicate."
- [ ] **Step 2: `CLAUDE.md`.**
  - Commands: add `pnpm run check:reuse` and `pnpm --filter @workspace/scripts run test`.
  - Traps: delete the now-false traps (dead `index.css`, `tw-animate-css` import, the `main.tsx` observer, the three dead classes, "two icon libraries"). Add one trap: "`globals.css` ~4–590 is an inlined `tw-animate-css` — except the Lenis base styles at ~230–250, which are ours; the toast and tooltip animations need the rest."
  - Fix three more lines this branch makes wrong: "**`scripts`** — one `hello.ts`" (Task 1 replaces it with the guard), the Sanity rule "`data ?? fallback`" (Task 6 moves the fallback into the hooks), and the no-code-splitting trap that lists `three`, `gsap` and `framer-motion` (gsap was never imported and Task 3 removes it). Also rewrite the stale comment at `sanityQueries.ts:3` that tells readers components use `data ?? fallback` — that one belongs to Task 6 Step 3.
  - Reuse section: name `lib/lenis.ts`, `lib/motion.ts`, `Section`/`CONTAINER`, `PageShell`, `PillLink`, `orFallback`, and the fallback files `lib/fallbackContent.ts` and `lib/projectsData.ts` (replacing "next to their query").
  - Design tooling: drop "Do not run `npx shadcn add` yet" now that `components.json` points at `globals.css`; keep the dependency-approval line, and add the caution that `shadcn add` writes tokens in its own format, which must be converted to this repo's raw HSL triplets.
  - If Q3 kept gsap, add it to Traps as unused on purpose.
- [ ] **Step 3: `WORKSPACE_GUIDE.md`.** Add the two guard commands under Key Commands.
- [ ] **Step 4: `DESIGN_UPGRADE.md`.** Make two factual corrections:
  - §1 Motion: "currently inconsistent" → "now centralised in `src/lib/motion.ts`; change the values there".
  - §1 Spacing: name `Section.tsx` as the one place to change the padding.
  - Change nothing else; it is the owner's spec. Under the Q3 default two further lines go stale — "you're on 3.15" and "GSAP already bundled" (§6) — and §6's `frameloop="never"` now differs from what Task 9 ships. **Name all three in your report instead of editing them**; they are the owner's to decide.
- [ ] **Step 5: Commit** `Update the audit, rules and guides for the reuse cleanup`. It is the last commit of the run.

---

## Task dispatch

All tasks run **in order, one at a time**. Tasks 4–8 share `Projects.tsx`, `Contact.tsx` and `ProjectDetail.tsx`, so parallel dispatch would conflict. The agent type is `general-purpose` with an explicit `model` (CLAUDE.md).

| Task | Marker | Implementer | Reviewer |
|---|---|---|---|
| 1. Reuse guard | `design` (rule format all later tasks use) | `general-purpose` / sonnet | none (its own `node:test` suite) |
| 2. Dead code | `mechanical` (exact lists, guard proves it) | `general-purpose` / sonnet (the 900-line CSS needs care with block bounds) | none |
| 3. Dead deps | `mechanical` | `general-purpose` / haiku | none |
| 4. Lenis module | `integration` (scroll behaviour) | `general-purpose` / sonnet | `general-purpose` / sonnet |
| 5. Types | `mechanical` (`tsc` proves it) | `general-purpose` / haiku, escalate to sonnet if `tsc` fights the builders | none |
| 6. Fallback hooks | `integration` | `general-purpose` / sonnet | `general-purpose` / sonnet |
| 7. Motion and colour | `integration` | `general-purpose` / sonnet | `general-purpose` / sonnet |
| 8. Layout and chips | `integration` | `general-purpose` / sonnet | `general-purpose` / sonnet |
| 9. Reduced motion | `design` (a11y behaviour) | `general-purpose` / sonnet | `general-purpose` / sonnet |
| 10. Docs | `mechanical` | `general-purpose` / sonnet | none (the orchestrator reads the diff) |
| Whole-branch review | — | — | `general-purpose` / **opus** |

**Escalation:** if an implementer fails the same task twice, or a reviewer reports a design-level problem, re-dispatch that task on `opus` and say so in the report.

**Passes after Task 9, before Task 10:**
- **Simplify:** invoke the `simplify` skill on `git diff main...HEAD`, re-run the gate, and commit its changes alone as `Simplify <what>`.
- **UI critique:** skipped by design, because this branch aims for no visual change and a critique would propose redesigns that are out of scope. `impeccable detect` (Tasks 2 and 8) and the owner checks cover regressions.
- **Security:** skipped. No new input handling, no secrets, no auth. The only config change is a CI step that runs a repo script.
- **Whole-branch review (opus):** give it the diff without docs (`git diff main...HEAD -- artifacts scripts .github package.json pnpm-workspace.yaml`), Review Focus, Global Constraints and the ledger's `Ruling:` lines. Tell it to report correctness findings only (behaviour changes beyond Q4/Q5, missed callers of a changed hook or signature, a guard rule that can never fire) and to skip cleanup suggestions, since Simplify has run. Send confirmed findings to one `sonnet` fixer, then one scoped re-review.

## Done when

- `pnpm --filter @workspace/scripts run test` passes, and `pnpm run check:reuse` passes with all 18 rules in `RULES`.
- `pnpm run typecheck` and `pnpm --filter portfolio run build` are clean. JS is within +2 kB of `1,603.55 kB`, CSS is below `75.37 kB`, and both numbers are in the report.
- `npx impeccable detect artifacts/portfolio/src` shows no finding that was not there at baseline.
- The owner's browser checks in Tasks 4, 6, 8 and 9 have passed.
- No `any`, no `__lenis`, no dead class, token or dependency remains in `artifacts/portfolio`.
- `AUDIT_REPORT.md`, `CLAUDE.md`, `WORKSPACE_GUIDE.md` and `DESIGN_UPGRADE.md` are updated in one final docs commit. Nothing is pushed.

## Not in this plan

- **Code splitting** (Track A item 1). It belongs to the hero rework, per `DESIGN_UPGRADE.md` §6.
- **Web3Forms replacement** (item 3), pending the owner's choice. **Tableau** (item 4) is a Sanity content call.
- **Fonts** (C11) and **gradient text** (the remaining `impeccable detect` findings) belong to `DESIGN_UPGRADE.md` §1.
- **`mockup-sandbox` duplicates** (Q6) and the **dormant backend** (Track B) wait on owner decisions.
- **`siteSettings` per-field fallbacks** in Hero, About and Contact (`settings?.x || '…'`). They are single values and partly JSX, so a different shape from the list fallbacks. Revisit when the About copy moves fully to Sanity.
- **Tech chips** (Projects versus ProjectDetail): two occurrences that differ by design (decision 4).
- **C3's entry variant** — the audit's third C3 bullet, `initial { opacity: 0, y: 20 }` with `viewport { once: true, margin: '-100px' }`. It appears 9× (`initial={{ opacity: 0, y: 20 }}`) and `-100px` appears 4× (About ×2, SectionHeading ×2), but the durations and delays differ per site, so a single preset would change timings. `DESIGN_UPGRADE.md` §1 redefines this variant anyway. Task 7 centralises the easing, viewport-centre margin and reveal colours only; **C3 stays open for the entry variant**, and no guard rule covers it.

---

## Execution prompt

Paste into a fresh session in `D:\Project\SK-Portfolio` after `/model sonnet` and `/effort high`.

```
# Goal
Every item in the plan's Task list is shipped on branch `reuse-cleanup`, the plan's "Done when" list is true, and nothing is pushed.

# Inputs
- Plan: @docs/plans/2026-11-05-reuse-cleanup.md. Read all of it first. Its "Task dispatch" table is the schedule, and its "Questions for the owner" carry defaults.
- Spec: @docs/AUDIT_REPORT.md Track C, plus the plan's "Findings beyond the audit".
- Project rules: @CLAUDE.md applies as written. The three that matter most here: no new dependency or top-level folder; no AI attribution in commits; never push (pushing main deploys the live site).

# Setup
1. Show me the plan's six questions with their defaults, and wait for my answers or "defaults".
2. Run `git status --short docs CLAUDE.md WORKSPACE_GUIDE.md .gitignore`. If anything is listed, stop and tell me: Task 10 rewrites whole doc files and agents cannot stage partial ones, so uncommitted doc edits must be committed before the run, not after nine tasks.
3. `git checkout -b reuse-cleanup` from the current `main` (or stay on `main` if I answered Q1 that way). Carry my uncommitted files untouched and never stage them.
4. `pnpm install --frozen-lockfile`, then the gate: `pnpm run typecheck && pnpm --filter portfolio run build`. Record the JS and CSS sizes as the run's baseline.

# Procedure
Use the superpowers:subagent-driven-development skill. For each task, in order:
1. Dispatch the implementer from the dispatch table with `subagent_type: "general-purpose"` and the explicit `model`. Give it the task text, Global Constraints, the plan-level decisions the task cites, the guard rule table rows for that task, and the Interfaces blocks of the tasks it consumes. Nothing else.
2. When it reports, run the task's commands yourself: its guard rule failing with the stated count (Step 2), then the gate passing. Read the output. If either is wrong, send the output back to the implementer; do not fix it yourself.
3. If the task names an owner browser check, stop and hand me the exact checklist. Never start a dev server. Continue when I reply.
4. If the table names a reviewer, dispatch it with the task text, the task diff and the task's "Reviewer looks hardest at" line. A finding goes back to the implementer, followed by one scoped re-review.
5. Mark a task done only when its guard rule passes, the gate is clean, and the bundle is inside budget.

After Task 9: run the Simplify pass and the opus whole-branch review exactly as the plan's "Passes" list says. Then run Task 10 last.

Where the skill and this prompt differ, this prompt wins. Escalation is the plan's rule. Any other conflict is a ruling (`Ruling: <what> — <why> — <cost if wrong>` in your notes), and you keep going. Skip the skill's finish step.

# Stop and ask
Stop and ask me, instead of improvising, when:
- a file has changed so a task cannot be applied as written;
- a guard baseline differs from the plan and the difference is not explained by an earlier task;
- a step would add a dependency, push, or touch `studio/`, `mockup-sandbox` or the backend;
- a task names an owner browser check.

# Report
1. Each task: shipped / escalated / stopped, one line each.
2. Every command run, with its result line, and the JS/CSS sizes after each task.
3. Owner-check outcomes, then what Simplify changed and the whole-branch review's findings (fixed and uncertain).
4. Doc edits by file, the docs commit, and any doc left partly unstaged and why.
5. Every `Ruling:` line.
6. A PR title (under 70 chars, plain sentence) and body (What / Why / How it was tested / Not in this PR / Watch for) in one fenced block, with no AI attribution.
```
