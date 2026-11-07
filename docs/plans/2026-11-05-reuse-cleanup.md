# Reuse cleanup Implementation Plan

**Status:** Executed 6 Nov 2026 on reuse-cleanup (10 commits, HEAD 9425b85); docs updated, unstaged for the owner.

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **How to run:** the owner says **"go"** in a Claude Code session in this repo, and the main session runs `/run-plan docs/plans/2026-11-05-reuse-cleanup.md` (`.claude/commands/run-plan.md`). In a new session the owner can type that command instead. There is nothing to paste: the procedure lives in the command, and everything specific to this run lives in this plan.
>
> **Project-owner overrides (see "Owner decisions"):** exactly 10 commits, one per code task, each a single short line with no body and no `Co-Authored-By` or any AI attribution (CLAUDE.md, Git). Review fixes amend the task's own commit. Doc edits stay unstaged for the owner. Never push. The owner is away during the run, so every browser check is agent-run — no owner pauses.

**Goal:** Every duplicate and every piece of dead code in `docs/AUDIT_REPORT.md` Track C, plus the findings added while planning (C12–C17) and the Impeccable audit's bugs (C18–C26), is removed or fixed. A CI guard stops the duplicates coming back. The site looks and behaves the same for a visitor, except for the changes the owner approved in D4, D5 and D7.

**Architecture:** First a small, dependency-free guard script (`scripts/src/check-reuse.ts`, run in CI) bans each duplicated literal outside the one file that owns it. Each later task follows the same test-first cycle. It adds its rule, watches the guard fail with the exact baseline count below, moves the literal into one owner (`lib/lenis.ts`, `lib/motion.ts`, `lib/fallbackContent.ts`, `Section`, `PageShell`, `PillLink`, or a `globals.css` token), and watches the guard pass. Behaviour is pinned by `tsc`, the production build and the guard, and by browser checks the agents run themselves through the Chrome DevTools MCP for the parts the guard cannot see.

**Tech Stack:** React 19, Vite 7, Tailwind v4, Framer Motion 12, Lenis 1.3, TanStack Query 5, TypeScript 5.9, pnpm 10 workspaces, Node 24. Tests use the built-in `node:test` through `tsx` (already in the catalog). No new dependency, no new top-level folder.

**Spec:** [`docs/AUDIT_REPORT.md`](../AUDIT_REPORT.md) Track C (C1–C10) and its duplicate-file section, plus [Findings beyond the audit](#findings-beyond-the-audit) (C12–C17) and the [Impeccable audit](#impeccable-audit-6-nov-2026) (C18–C26), which Task 10 writes into the audit. [`CLAUDE.md`](../../CLAUDE.md) is the second authority, especially "Reuse before you write. No duplicates." and "Traps": where they meet, CLAUDE.md wins on *how*, the audit on *what*. Read [`docs/specs/DESIGN_UPGRADE.md`](../specs/DESIGN_UPGRADE.md) §1 (motion table) and §6 (Lenis ↔ GSAP, accessibility) before Tasks 4, 7 and 9.

**Branch:** `reuse-cleanup`, cut from `main` in the current checkout (no worktree), one PR into `main`. Pushing `main` deploys `sravankumar.online`, so nothing in this plan is pushed. The owner opens the PR.

---

## Owner decisions

All answered by the owner on 6 Nov 2026. The run does not ask them again; D9 starts it.

| # | Question | Decision | Task |
|---|---|---|---|
| D1 | Branch or straight to `main`? | **Branch + PR.** `reuse-cleanup` exists, cut from `main` at `cb14209`. The owner opens the PR, so CI runs before anything deploys | all |
| D2 | Where do this plan's own uncommitted setup files go? | **Into Task 1's commit.** That is this plan's 6 Nov revisions, the `/.superpowers/` line in `.gitignore`, the `/run-plan` command and the four `portfolio-*` agent files. No separate commit | 1 |
| D3 | Remove all five unused dependencies? | **Keep `gsap` and `@gsap/react`** for `DESIGN_UPGRADE.md` §6. Remove `date-fns`, `next-themes`, `react-icons` and the unused `@radix-ui/react-tooltip`. Task 10 lists gsap in CLAUDE.md Traps as unused on purpose | 3, 10 |
| D4 | Does the Certifications "View" chip take the Projects chip's look? | **Yes.** Merging the near-copies into one `PillLink` (C4) means no resting `bg-white/[0.03]` and an `opacity-70` label until hover. The only visual change in Tasks 1–8. `PillLink` has no `filled` prop | 8 |
| D5 | Add `prefers-reduced-motion` support (C17)? | **Yes, Task 9.** Visitors without the setting see no change; with it: native scrolling, a still hero, no slide-ins | 9 |
| D6 | What happens to `mockup-sandbox`'s duplicate files? | **Leave it.** Not in this plan; stays logged in the audit (five shared files after Task 2 deletes `tooltip.tsx`) | — |
| D7 | Fix the Impeccable audit's bugs (C18–C26)? | **Yes, all nine — Task 11.** Six are invisible: link names, keyboard access, a fake link, a GPU leak, a scroll that bypasses Lenis, form autofill hints. Three change what a visitor sees: titles **stay revealed** instead of fading back to ~1.28:1 contrast; long project titles **wrap** on phones instead of being cut off; the hero's scroll hint **blinks twice, then stops** | 11 |
| D8 | Who does the browser checks? | **The agents**, through the Chrome DevTools MCP against a local production preview. The owner is away and is never paused for a check. Anything a check cannot classify goes on a "Needs owner eyes" list for the PR | 2, 4, 6, 7, 8, 9, 11 |
| D9 | Execution | **Starts on the owner's "go"**, with the models in "Execution" below | — |

## Execution: models, stages and commits

The owner's standing rule: build with Sonnet, review with Opus, fix with Sonnet xhigh and escalate to Opus, and give the final whole-branch review to Opus at high effort. No Haiku in this run.

| Stage | Who | Model, effort | Purpose |
|---|---|---|---|
| Plan and plan reviews (done) | Main session, one independent reviewer, the Impeccable audit | Opus | Write the plan, check it against the code, add the gaps |
| Setup and browser baseline | Main session; `portfolio-opus-review` for the baseline | Opus | Branch, clean-tree check, gate, MCP check, baseline evidence |
| Build: Tasks 1–9, then 11 | One fresh implementer per task | Sonnet, high or xhigh (table below) | The code changes, each ending in one commit |
| Per-task review and browser check | `portfolio-opus-review` | Opus | Code review of the task's commit plus its browser check, in one pass |
| Fixes | `portfolio-sonnet-xhigh`, escalating to `portfolio-opus-high` | Sonnet xhigh → Opus high | Close a finding or failed check by amending the task's commit |
| Simplify pass | Main session, `simplify` skill | — | Cleanups on the branch diff, amended into the last commit |
| Final whole-branch review | `portfolio-opus-high` | Opus, high | Correctness across tasks: callers, shared files, Review Focus |
| Docs: Task 10 | `portfolio-sonnet-high` | Sonnet, high | Bring the audit, CLAUDE.md and guides up to date; left unstaged |
| Coordination, ledger, report | Main session (the orchestrator) | Opus | Dispatch, verify, ledger, report. Never edits code itself |

Progress goes in the SDD ledger (`.superpowers/sdd/2026-11-05-reuse-cleanup/progress.md`, gitignored), so a stopped run resumes where it left off.

### Setup

1. `git switch reuse-cleanup`.
2. `git status --short --untracked-files=all` lists exactly these, the run's own setup files (D2), and nothing else: ` M .gitignore`, ` M docs/plans/2026-11-05-reuse-cleanup.md`, `?? .claude/commands/run-plan.md`, and `?? .claude/agents/portfolio-{sonnet-high,sonnet-xhigh,opus-review,opus-high}.md`. Anything else: stop and report.
3. `pnpm install --frozen-lockfile`, then the gate: `pnpm run typecheck && pnpm --filter portfolio run build`. Record the JS and CSS sizes.
4. `chrome-devtools` MCP `list_pages` answers. If not, stop — the reinstall command is in [Browser checks](#browser-checks-agent-run).
5. Capture the browser baseline as [Browser checks → Baseline](#browser-checks-agent-run) describes, then confirm `.impeccable/review/reuse-cleanup/baseline/` holds the screenshots, `metrics.json`, `detect.txt` and `console.txt`.

### Task dispatch (agentic run)

All tasks run **in order, one at a time**: 1–9, then 11, then the passes, then 10. Tasks 4–8 and 11 share `Projects.tsx`, `Contact.tsx` and `ProjectDetail.tsx`, so parallel dispatch would conflict. Every dispatch passes `subagent_type`, an explicit `model` and the effort shown (CLAUDE.md).

| Task | Implementer (`subagent_type` / model, effort) | Reviewer | Reviewer looks hardest at |
|---|---|---|---|
| 1 Reuse guard | `portfolio-sonnet-high` / sonnet, high | none — its own `node:test` suite | — |
| 2 Dead code | `portfolio-sonnet-high` / sonnet, high | `portfolio-opus-review` / opus — browser only | `globals.css` block bounds; toast still animates; 0 px spacing drift |
| 3 Dead deps | `portfolio-sonnet-high` / sonnet, high | none — byte-identical bundle proves it | — |
| 4 Lenis module | `portfolio-sonnet-xhigh` / sonnet, xhigh | `portfolio-opus-review` / opus — code + browser | Decision 5; Home's cleanup cancels every `reassert` timer; RAF cancelled; one RAF loop |
| 5 Types | `portfolio-sonnet-high` / sonnet, high | none — `tsc` proves it | — |
| 6 Fallback hooks | `portfolio-sonnet-xhigh` / sonnet, xhigh | `portfolio-opus-review` / opus — code + browser | Reversed tech precedence in `resolveDetail`; every section falls back with Sanity blocked |
| 7 Motion and colour | `portfolio-sonnet-xhigh` / sonnet, xhigh | `portfolio-opus-review` / opus — code + browser | Presets equal the inline props value for value; About's two branches; built-CSS proof |
| 8 Layout and chips | `portfolio-sonnet-xhigh` / sonnet, xhigh | `portfolio-opus-review` / opus — code + browser | `tailwind-merge` drops no class; `<span>`/`<a>` in Certifications; row click propagation |
| 9 Reduced motion | `portfolio-sonnet-xhigh` / sonnet, xhigh | `portfolio-opus-review` / opus — code + browser | No Lenis while reduced; off-screen hero still `'never'`; RAF cancelled on cleanup |
| 11 UI audit fixes | `portfolio-sonnet-xhigh` / sonnet, xhigh | `portfolio-opus-review` / opus — code + browser | Button holds phrasing content only; no fake link, no cast; "Explore work" landing; hero pause untouched |
| 10 Docs | `portfolio-sonnet-high` / sonnet, high | none — the orchestrator reads the diff | Each doc line matches the code it names |
| Simplify pass | Main session | — | Behaviour unchanged; gate re-run |
| Whole-branch review | — | `portfolio-opus-high` / opus, high | Review Focus; callers of every changed signature; files two tasks touched |

**Fixing a finding** (a review finding or a failed browser check): re-dispatch `portfolio-sonnet-xhigh` / sonnet, xhigh, which amends the task's commit, then one scoped re-review. If the same finding survives, or the reviewer calls it design-level, escalate to `portfolio-opus-high` / opus, high. If it still fails, stop the run and report — later tasks build on this one.

**Run rules.** Each implementer gets its task text, the Global Constraints, Review Focus, the plan decisions the task cites, the guard-rule rows for its task and the Interfaces of the tasks it consumes — nothing else. The orchestrator runs each task's commands itself and never fixes code. No push, no `finishing-a-development-branch`.

**Commits: exactly 10 — one per Task 1–9 and Task 11.** Nothing else in the run produces a commit:
- A finding is fixed by **amending** the task's own commit. Tasks run strictly in order and each review finishes before the next task starts, so that commit is always `HEAD` — no rebase needed.
- The **Simplify pass** amends into the last commit (Task 11's).
- The **whole-branch review** runs after all ten exist; a confirmed finding there also amends into the last commit, even when it concerns an earlier task's code. Agents cannot use `git rebase -i`, so an earlier, non-`HEAD` commit cannot be amended. The report names each such finding's true task.
- **Task 10 (docs) makes no commit.** Its edits stay unstaged for the owner (CLAUDE.md, "Doc edits stay unstaged for review").

**Passes after Task 11, before Task 10:**
- **Simplify:** invoke the `simplify` skill on `git diff main...HEAD`, re-run the gate, and amend its changes into the last commit.
- **UI audit:** done at planning time (see [Impeccable audit](#impeccable-audit-6-nov-2026)); its fixes are Task 11. A full `/impeccable critique` stays out of this branch: it proposes redesigns, and those belong to `DESIGN_UPGRADE.md`.
- **Security:** skipped. No new input handling, no secrets, no auth. The only config change is a CI step that runs a repo script.
- **Whole-branch review (`portfolio-opus-high`, opus, high):** give it the diff without docs (`git diff main...HEAD -- artifacts scripts .github package.json pnpm-workspace.yaml`), Review Focus, Global Constraints and the ledger's `Ruling:` lines. It reports correctness findings only — behaviour changes beyond D4, D5, D7 and decision 5, missed callers of a changed hook or signature, a guard rule that can never fire — and skips cleanups, since Simplify has run. Confirmed findings go to one fixer in one brief, then one scoped re-review, amended into the last commit.

## Plan-level decisions

1. **The guard is the test runner.** The portfolio has no test suite, and adding Vitest would be a dependency change. Instead `scripts/src/check-reuse.ts` holds a list of rules. A rule is a regex plus the one file allowed to contain it. A task's "failing test" is its new rule, and the exact baseline count in the [rule table](#guard-rule-table) is the expected failure. The guard itself is unit-tested with `node:test`.
2. **Behaviour-preserving by default.** Constants keep today's values, even where `DESIGN_UPGRADE.md` §1 proposes new ones. This plan only gives each value one home, so §1 later becomes an edit to a single line. The deliberate behaviour changes are D4, D5, D7 and decision 5.
3. **Lenis lives in a module, not on `window`.** `lib/lenis.ts` keeps the instance in a module-scoped variable (`setLenis` is exported; the getter stays private), which deletes `window.__lenis` and all its `as any` casts. Nothing outside the bundle reads it. Callers never touch Lenis directly. They call `scrollToY`/`scrollToElement`, which carry the native fallback. This survives `DESIGN_UPGRADE.md` §6, where GSAP's ticker takes over the RAF: only `SmoothScroll` changes then.
4. **Exact duplicates become named things; one-offs import the constants.** A motion block that appears identically twice becomes a named preset in `lib/motion.ts` (`rowEnter`, `expandOnView`, `slideInFromRight`). A block that appears once stays inline but imports `EASE_*` and `VIEWPORT_CENTER_MARGIN`. A tech chip that differs by design (Projects 9px versus ProjectDetail 10px) is left alone: it has two occurrences, not three (CLAUDE.md "the second occurrence is the warning").
5. **Unified scroll-jump semantics.** `scrollToY(top, { immediate: true })` always calls `lenis.resize()` and then `scrollTo(top, { immediate: true, force: true })`. Today Home does the `resize()` and ProjectDetail does the `force`, and each is harmless for the other. This is the only behaviour merge in Task 4, and it is Review Focus item 1.
6. **Colours that framer-motion interpolates stay concrete.** `useTransform`/`animate` cannot interpolate `hsl(var(--primary))`, so `ScrollRevealText`'s three tones keep literal colour strings, in one map inside that component, behind a `tone` prop that replaces `from`/`to`. Everything rendered by CSS uses the token: `hsl(var(--primary) / <alpha>)`.
7. **One easing token in CSS.** A plain (non-`inline`) `@theme { --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1); }` in `globals.css` gives both `var(--ease-out-expo)` for custom CSS and the `ease-out-expo` Tailwind utility. Use `@theme`, not `@theme inline`: the inline form does not emit the variable, so `var()` would resolve to nothing. No `--ease-out-quint` CSS token, because no CSS uses that curve (YAGNI).
8. **Fallbacks are wired in the hook, so a component cannot forget one.** The list hooks return `T[]` (never `undefined`) through a private `useSanityList`. Small fallback content moves to `lib/fallbackContent.ts`, and project fallbacks stay in `lib/projectsData.ts`. CLAUDE.md is updated to name both files (Task 10).
9. **Commit messages follow CLAUDE.md, not the anthill convention.** One short, plain, sentence-case line, matching `git log` (`Remove unused UI components and orphaned dependencies, clean up docs`). A body only when the line genuinely needs one. Never a task, phase or step number. No `type(scope):` prefix, no `Co-Authored-By`, no "Generated with", no AI attribution — this overrides any harness reminder that asks for a trailer.

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

Checked and **not** a problem, so leave these alone. The two `@theme inline` blocks in `globals.css` are different: block 1 is an inlined copy of `tw-animate-css` that the toast animations need, and block 2 holds the colour tokens. (This line used to say "toast and tooltip"; the Impeccable audit found no tooltip is rendered anywhere, so Task 2 deletes it.)

## Impeccable audit (6 Nov 2026)

`/impeccable audit artifacts/portfolio/src` — the technical pass (accessibility, performance, theming, responsive, implementation integrity), not a design critique. Source-level only: no dev server was run, so contrast figures are token arithmetic and tiny-text and overflow findings are estimates. Findings this plan already covered (reduced motion, dead CSS, `any`, motion literals, `__lenis`, the uncancelled RAF) were excluded. Every finding below was re-checked against the code before it was added here.

| Dimension | Score | Key finding |
|---|---|---|
| Accessibility | 2/4 | Social links have no accessible name; copy-email is mouse-only; `--muted-foreground` is 4.49:1 |
| Performance | 2/4 | ~240 per-character motion spans; the hero leaks a GPU material on every pause/resume |
| Theming | 2/4 | 47 raw `white/x`/`black/x` classes stand in for the border and surface tokens |
| Responsive | 3/4 | Project titles cannot wrap, so they are likely clipped on phones |
| Implementation integrity | 2/4 | Reveal titles fade back to near-invisible; one scroll bypasses Lenis |
| **Total** | **11/20** | **Acceptable** |

**Fixed in this plan — Task 11** (bugs, not redesigns; Task 10 logs them as resolved):

| ID | Finding | Where |
|---|---|---|
| C18 | Social icon links have no accessible name: lucide sets `aria-hidden` on the icon, so each link is empty (WCAG 1.1.1, 2.4.4, 4.1.2 — level A) | `Contact.tsx:279, 319-331` |
| C19 | "Copy email" is a `motion.div` with `onClick`: no role, no focus, unreachable by keyboard (WCAG 2.1.1 — A) | `Contact.tsx:155-175` |
| C20 | A certification without a link renders `<a href="#">`: a focusable fake link that jumps to the top (WCAG 4.1.2 — A) | `Certifications.tsx:46` |
| C21 | Project and company titles fade back to `rgba(255,255,255,0.1)` (~1.28:1) whenever their row leaves the middle 40% of the screen (WCAG 1.4.3 — AA) | `Projects.tsx:36`, `Experience.tsx:50` |
| C22 | `ScrollRevealText` turns spaces into `\u00A0`, so a title has no line-break point and is likely clipped on phones (WCAG 1.4.10 — AA) | `ScrollRevealText.tsx:45` |
| C23 | The hero's scroll-hint dot blinks forever (`repeat: Infinity`); WCAG allows at most 5 s of automatic blinking without a pause control (2.2.2 — A) | `Hero.tsx:115-126` |
| C24 | "Explore work" scrolls with native `scrollIntoView`, beside Lenis. Task 4's `native-scroll-in-lenis` rule does not match it, so it would survive the plan | `Hero.tsx:81` |
| C25 | `RotatingShapes` creates a new `MeshStandardMaterial` and re-rolls 8 random sphere positions on every render. The off-screen pause re-renders it, so each pause/resume leaks a GPU material and visibly reshuffles the spheres | `HeroScene.tsx:29-60` |
| C26 | The contact form's name and email inputs have no `autocomplete`, so browsers and password managers cannot identify them — Chrome itself flagged it during the 6 Nov smoke test (WCAG 1.3.5 — AA) | `Contact.tsx:192, 208` |
| — | `TooltipProvider` wraps the app but nothing renders a tooltip (handled in Tasks 2 and 3, not Task 11) | `App.tsx:4, 29` |

**Not fixed here — Task 10 logs these in `AUDIT_REPORT.md` as a new "Track D — UI audit" for a later pass.** Each is either a visible design change that `DESIGN_UPGRADE.md` already owns, too wide to do safely inside a cleanup branch, or inside code CLAUDE.md fences off:

- **Muted text contrast (P1).** `--muted-foreground: 0 0% 48%` is 4.49:1, just under AA; stacked `opacity-*` variants fall to 1.8–2.8:1, and the form labels sit at ~2.3:1. `DESIGN_UPGRADE.md` §1 already targets `0 0% 60%`. A site-wide visible change.
- **9–10px text in 17 places (P1/P2).** §1 already proposes an 11px metadata floor.
- **No designed focus states (P2).** Zero `focus-visible:` classes; the `--ring` token is unused.
- **Form errors not tied to their fields (P2).** No `aria-invalid`, `aria-describedby` or `required`; errors are 10px `text-red-400`.
- **No `<main>` landmark or skip link; footer inside a section (P2).**
- **Nav clicks and route changes don't move focus; no `aria-current` (P2).** Hash-scroll code is fenced by CLAUDE.md, so this needs its own navigation task.
- **Per-character spans may be read letter by letter (P2).** §6 already asks for `sr-only` text with an `aria-hidden` split.
- **Scrollbar hidden site-wide (P2).** `globals.css:760-766`.
- **`ScrollRevealText` render cost (P2).** A `transition-colors duration-500` fights the JS-driven colour on every frame.
- **Hero HDR loaded from a third-party CDN at runtime (P2).** `<Environment preset="city">` fetches from `raw.githack.com`.
- **Gallery dots 6×6px, no carousel semantics; Code/Live chips ~22px tall (P2).**
- **Token layer bypassed (P2).** 47 raw `white/x`/`black/x` classes; status colours skip `--destructive`; no `--success` token.
- **P3s:** `transition-all` ×23 and a letter-spacing hover; Navbar's scroll handler bound twice; `Magnetic` re-renders on every `mousemove`; `<div>` inside the hero `<h1>`, tagline as `<h2>`, Contact heading an `<h3>`; gold `rgba(201,169,110)` and `#080808` fog in the hero; cover image without dimensions; spinner without `role="status"`. `@types/three` and `@types/*` have no import because they are type packages.

## Coverage: every audit item and where it is fixed

| Item | What | Where |
|---|---|---|
| C1 | The section shell is copy-pasted 5× | Task 8 (`Section`, `CONTAINER`) |
| C2 | The Sanity fallback ternary is written out 4× | Task 6 |
| C3 | Motion constants are duplicated | Task 7 — easing, viewport margin and reveal colours. Its entry-variant bullet stays open (see "Not in this plan") |
| C4 | The pill/chip link is copy-pasted 3× | Task 8 (`PillLink`) |
| C5 | `window.__lenis` 6×, untyped | Task 4 |
| C6 | 11 `any` types | Task 5 (Task 4 removes 6 of them) |
| C7 | Three near-identical Lenis scroll blocks | Task 4 |
| C8 | `main.tsx`'s observer for classes nothing uses | Task 2 |
| C9 | Dead CSS classes | Task 2 |
| C10 | Dead `index.css`; `components.json` points at it | Task 2 |
| C11 | Fonts loaded three times | Not in this plan — `DESIGN_UPGRADE.md` §1 |
| C12 | `.dark` duplicates `:root`; dead sidebar/chart tokens | Task 2 |
| C13 | Unused dependencies | Task 3 (gsap kept, D3) |
| C14 | The project-link rules are written twice | Task 8 |
| C15 | The Lenis easing typed 3×; `BackToTop` scrolls natively | Task 4 |
| C16 | Colour literals in components; About renders `ScrollRevealText` twice | Task 7 |
| C17 | No `prefers-reduced-motion` handling | Task 9 |
| C18–C26 | The Impeccable audit's bugs | Task 11 |
| — | `TooltipProvider` with no tooltip | Tasks 2 and 3 |
| — | Home and ProjectDetail share a page shell | Task 8 (`PageShell`) |
| Track A, item 1 | One 1.6 MB bundle, no code splitting | Not in this plan — the hero rework |
| Track A, item 3 | Web3Forms replacement | Not in this plan — owner's choice pending |
| Track B | The dormant backend | Not in this plan |
| Track D (new) | The rest of the Impeccable audit | Not in this plan — Task 10 logs it |
| Duplicate files | `portfolio` vs `mockup-sandbox` | Not in this plan (D6); Task 2 removes the `tooltip.tsx` pair |

## Global Constraints

- **pnpm only.** `npm`/`yarn` are blocked by the root `preinstall`.
- **The run serves the site itself, for its browser checks only** (owner's decision, 6 Nov 2026 — this is the "unless asked" in CLAUDE.md's dev-server rule). Production preview on `127.0.0.1:4173`, never `0.0.0.0`, never left running. See [Browser checks](#browser-checks-agent-run).
- **The gate after every task:** `pnpm run typecheck && pnpm --filter portfolio run build && pnpm run check:reuse` (the last command exists from Task 1 on), all clean.
- **Bundle budget.** Baseline (5 Nov 2026): JS `1,603.55 kB` (gzip `470.06 kB`), CSS `75.37 kB` (gzip `12.84 kB`). No task may grow JS by more than 2 kB minified. CSS must end smaller than the baseline. Record both numbers in every task report.
- **No new dependency, no new top-level folder** (`CLAUDE.md`). Task 3 removes dependencies and adds none. Never touch `minimumReleaseAge`.
- **Never edit** `artifacts/mockup-sandbox`, `studio/`, the dormant backend (`artifacts/api-server`, `lib/*`), or `src/lib/utils.ts` (it is byte-identical with the sandbox copy, and editing one side creates a near-copy).
- **Keep** `BackToTop`, `CustomCursor`, the HeroScene off-screen pause, the single Lenis RAF loop, desktop-only nav, every Sanity fallback, and the inlined `tw-animate-css` block in `globals.css`.
- **No `any`**, and no new `as` cast except `as const`.
- **Commits:** plain sentence case, no prefix, no `Co-Authored-By`, no "Generated with", no AI attribution. Stage files by name, never `git add -A`. Do not push.

## Review Focus

1. **Hash return from a project page.** Go to a project, click "See more projects", and you should land on that project's row (`/#project-<slug>`), not the top and not short of it, even while the hero canvas and CMS content are still loading. This exercises the merged `scrollToY(…, { immediate: true })` (decision 5) and `reassert`. *Pinned by:* Task 4's browser check 3 (run under CPU and network throttling).
2. **Sanity unreachable or empty.** With the network to `*.api.sanity.io` blocked, every section still renders its fallback: projects, experience, skills, certifications, socials and email. A project page still renders from `fallbackProjectDetails`, with `tech` from the fallback taking precedence (the reversed order in `resolveDetail` must survive). *Pinned by:* Task 6's browser check (Sanity blocked with an `initScript`).
3. **Scroll position across client-side navigation.** A project page opens at the top even when you arrive from far down the home page. Nav clicks land 100px above the section heading. Contact's back-to-top button scrolls smoothly to the top. *Pinned by:* Task 4's browser checks 1, 2 and 4.
4. **Pixel parity of refactored sections.** About, Experience, Skills, Projects and Certifications look the same at 1440px and 390px before and after Tasks 7–8, including the scroll-linked title colour sweep and the row scale-in. *Pinned by:* the baseline screenshots and measurements, re-checked after Tasks 2, 7 and 8.
5. **Reduced motion is off by default.** A visitor without the OS setting sees exactly today's motion. With it on, the page is still fully usable: nav jumps, the hash return works through the native fallback, and the hero shows a still frame rather than a blank canvas. *Pinned by:* Task 9's browser checks, with the preference off and on.

## Browser checks (agent-run)

**Owner's decision (6 Nov 2026):** the owner is away during the run, so the agents run every browser check themselves through the Chrome DevTools MCP. There are no owner pauses. CI only typechecks and builds — it cannot see a scroll that lands in the wrong place or a section that shifts — so these checks are what stands between the branch and a visual regression. Nothing is pushed; the owner reviews the PR.

**The browser.** MCP server `chrome-devtools` (`chrome-devtools-mcp@1.12.0`, pinned; **user scope**; headless; an isolated throwaway profile, so the owner's real Chrome logins are never touched; usage statistics and CrUX lookups off, so no page URL leaves the machine). It is at **user scope, not local**, on purpose: VS Code-based IDEs on Windows open the repo as `d:\…` (lowercase drive), local-scope servers are stored under the exact path `D:/…`, and the mismatch makes an IDE session silently load no project servers. User scope does not depend on the path. If it is missing, reinstall from Git Bash — `MSYS_NO_PATHCONV=1` stops Git Bash rewriting `/c` into `C:/`:

```bash
MSYS_NO_PATHCONV=1 claude mcp add chrome-devtools --scope user -- cmd /c npx -y chrome-devtools-mcp@1.12.0 --isolated --headless --no-usage-statistics --no-performance-crux --viewport 1440x900
```

Tools used: `new_page`, `navigate_page` (with `initScript` to stub or block things before the app loads), `emulate` (`viewport`, `prefersReducedMotion`, `cpuThrottlingRate`, `networkConditions`), `click`, `press_key`, `wait_for`, `evaluate_script`, `take_snapshot` (the accessibility tree), `take_screenshot`, `list_console_messages`, `list_network_requests`, `lighthouse_audit`, `list_pages`/`close_page`.

**The server.** The production build, not the dev server. After the gate's build, start this with Bash `run_in_background`:

```bash
pnpm --filter portfolio exec vite preview --config vite.config.ts --host 127.0.0.1 --port 4173 --strictPort
```

The page is `http://127.0.0.1:4173`. `127.0.0.1`, never the `serve` script's `0.0.0.0`, so nothing is exposed on the network. Stop it (stop the background task) **before every build** — preview may keep serving a stale file list — and at the end of the run. No server is left running.

**Evidence stays out of git**, under `.impeccable/review/reuse-cleanup/` (`.impeccable/` is gitignored): one folder per check (`baseline/`, `task-2/`, `task-4/` …) holding `<page>-<section>-<width>.png` screenshots and a `metrics.json`.

**Viewports.** Desktop `1440x900x1`, phone `390x844x3,mobile,touch`, small phone `320x640x2,mobile,touch` (Task 11 only). Desktop-only nav means nav checks run at desktop width.

**Screenshot method** (so before and after are comparable): for each section, `window.scrollTo({ top: <section top>, behavior: 'instant' })`, wait 1500 ms for the reveals, then a viewport `take_screenshot`. The hero is not compared pixel-for-pixel: its 3D scene is always moving.

**Baseline** (Setup, before Task 1 — the branch still holds `main`'s code). Build, serve, and record into `baseline/`:
- **Screenshots** of Home's `about`, `experience`, `skills`, `projects`, `certifications`, `contact` and of `/projects/arogyalens`, at desktop and phone.
- **`metrics.json`:**
  - each `<section>`'s computed `padding-top`/`padding-bottom`, and its container's `width` and `padding-left`/`padding-right`, on Home and the project page, at desktop and phone;
  - `scrollY` 2500 ms after clicking each nav link (desktop), and after "Explore work" (desktop and phone);
  - where `#project-arogyalens` lands — its row's `getBoundingClientRect().top` — 2500 ms after "See more projects" on `/projects/arogyalens`, under `emulate { cpuThrottlingRate: 4, networkConditions: "Fast 4G" }`;
  - computed `box-shadow` of the Skills card and the Experience timeline dot that use the primary colour, and the computed `color` of a revealed Projects title character;
  - `requestAnimationFrame` calls per second at idle on Home's top, counted over 2 s with an `initScript` wrapper around `window.requestAnimationFrame`;
  - the `lighthouse_audit` accessibility score (desktop, navigation mode) and its failing audit ids.
- **`detect.txt`:** `npx impeccable detect http://127.0.0.1:4173` — the rendered scan, which runs the contrast and tiny-text rules the source scan cannot.
- **`console.txt`:** `list_console_messages` on Home and the project page, so errors that already exist are not blamed on the run.

**How a check passes or fails.**
- Measurements compare to the baseline at the tolerance each task states. A miss is a fail.
- Screenshots compare to the same baseline shot. Open both. `.claude/skills/impeccable/scripts/impeccable comp-diff --comp <baseline.png> --build <after.png> --out-dir <task folder>/diff` gives a side-by-side and a heatmap — a pointer to where to look, not a verdict. A difference the task does not explain is a fail. The only expected differences are D4's Certifications chip (Task 8) and Task 11's three visible fixes.
- No new console error compared to `console.txt`.
- **A timing-based item** (a reading at a fixed number of milliseconds, or a mid-animation screenshot) that fails is re-run once from a fresh reload before it counts as a fail. Headless Chrome renders the hero in software, so one slow frame is not a regression. Both readings go in the evidence.
- A fail goes back to the implementer like a review finding (sonnet xhigh, then opus). If it still fails after escalation, **stop the run and report** — later tasks build on this one.
- A difference the checker genuinely cannot classify (sub-pixel anti-aliasing, a font-hinting shift) goes under **"Needs owner eyes"** in the report with both screenshot paths, and the run continues. The owner sees it in the PR before anything merges.
- How wheel and touch scrolling *feel* cannot be measured. The proxy: `SCROLL_DURATION` and `scrollEasing` keep today's values, `<html>` still carries Lenis's `lenis` class, and idle `requestAnimationFrame` calls per second stay within baseline + 5% (a second RAF loop would roughly double them).

**Who runs it.** The task's Opus reviewer runs the browser check in the same pass as its code review. Task 2 has no code reviewer, so an Opus agent runs only its browser check. The orchestrator builds, starts the server, dispatches the checker, and stops the server afterwards. Each check ends with the checker's verdict per item (pass / fail / needs owner eyes) and the evidence folder path.

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
// Task 11 (UI audit). It also widens Task 4's rule in place to:
// 'native-scroll-in-lenis': /window\.scroll(To|By)\(|scrollIntoView\(/,
'no-fake-href':           /\|\|\s*['"]#['"]/,
'no-nbsp-split':          /\\u00A0/,
'no-infinite-loop':       /repeat:\s*Infinity/,
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
| `native-scroll-in-lenis` (widened) | `src/lib/lenis.ts` | 1 (`Hero.tsx`, the `scrollIntoView` Task 4's pattern misses) | 11 |
| `no-fake-href` | — | 1 (`Certifications.tsx`) | 11 |
| `no-nbsp-split` | — | 1 (`ScrollRevealText.tsx`) | 11 |
| `no-infinite-loop` | — | 1 (`Hero.tsx`) | 11 |

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

- [x] **Step 1: Write the failing tests** in `check-reuse.test.ts` (`node:test`, `node:assert/strict`, a temp tree from `fs.mkdtempSync(path.join(os.tmpdir(), 'reuse-'))`):
  - `reports a matching line with its root-relative path and 1-based line` → `src/a.tsx` containing `ok\nwindow.__lenis = x` gives `[{ rule: 't', file: 'src/a.tsx', line: 2, text: 'window.__lenis = x' }]` for a rule `/__lenis/`
  - `ignores a match in an allowIn file` → the same content in `src/lib/lenis.ts` with `allowIn: ['src/lib/lenis.ts']` gives `[]`
  - `scans components.json and index.html but not node_modules or dist` → matches planted in `components.json` and `index.html` are reported; the same planted in `src/node_modules/x/a.ts` and `src/dist/a.ts` are not. Plant them **inside** `src/`: at the tree root those two paths are outside the scan set anyway, so the test would pass without the skip logic existing
  - `ignores files outside the scanned extensions` → a match in `src/a.md` gives `[]`
  - `reports one violation per rule per line` → a line with two matches gives one violation
  - `returns an empty list for a clean tree`
  - `exits 2 when the root has no scannable files` → `scan` on an empty temp dir, asserting the CLI's guard condition (zero files scanned) rather than returning `[]` silently
- [x] **Step 2: Run, expect FAIL** (module missing): `pnpm --filter @workspace/scripts run test`
- [x] **Step 3: Implement** `scan` and `format` with `fs.readdirSync(…, { withFileTypes: true })` recursion and `split(/\r?\n/)` (the repo has CRLF working copies). Use only Node built-ins. Add `"check:reuse": "tsx ./src/check-reuse.ts"` and `"test": "tsx --test ./src/*.test.ts"` to `scripts/package.json` and remove `"hello"`. Add `"check:reuse": "pnpm --filter @workspace/scripts run check:reuse"` to the root `package.json`. Add a CI step after "Typecheck": `- name: Reuse guard` / `run: pnpm run check:reuse && pnpm --filter @workspace/scripts run test`.
- [x] **Step 4: Run, expect PASS:** `pnpm --filter @workspace/scripts run test` (7 pass), `pnpm run check:reuse` (exit 0, "0 violations", since `RULES` is empty), then the gate.
- [x] **Step 5: Commit** `Add a reuse guard for duplicated literals` (the three new files, the deleted `hello.ts`, both `package.json` files, `ci.yml`, **plus the run's own setup files** (D2): this plan, `.gitignore` (its `/.superpowers/` line), `.claude/commands/run-plan.md` and the four `.claude/agents/portfolio-*.md` files).

---

### Task 2: Delete dead code and dead tokens (C8, C9, C10, C12)

**Files:**
- Delete: `src/index.css`, `src/components/ui/tooltip.tsx` (nothing renders a tooltip — the only reference is the provider below; found by the Impeccable audit)
- Modify: `src/App.tsx` (remove the `TooltipProvider` import and unwrap its children), `src/main.tsx` (delete the `revealObserver`, `observeTextReveals`, `mutationObserver` and `DOMContentLoaded` block, lines 5–26), `src/globals.css` (the `.text-reveal*` rules; `.glow-primary`, `.mask-up`, `.rule-divider`; the `.dark { … }` block; `@custom-variant dark`; every `--sidebar`, `--sidebar-*`, `--color-sidebar`, `--color-sidebar-*`, `--chart-*` and `--color-chart-*` line — the bare `--sidebar:` and `--color-sidebar:` base tokens count too, which is why the rule ends in `\b` rather than `-`), `components.json` (`"css": "src/index.css"` → `"src/globals.css"`), `src/pages/Home.tsx` and `src/pages/ProjectDetail.tsx` (delete the `classList.add('dark')` effect; ProjectDetail keeps the rest of its effect), `pnpm-workspace.yaml` (drop the `lib/integrations/*` glob; change both "Must be this exact version because expo requires it" comments to "Pinned: the portfolio declares this exact version"), `scripts/src/reuse-rules.ts`

**Interfaces:**
- Consumes: Task 1's `RULES`.
- Produces: none. After this task `globals.css` holds no class or token that no component reads, except the inlined `tw-animate-css` block, which is kept on purpose.

- [x] **Step 1: Add the five Task 2 rules** from the [rule table](#guard-rule-table), each with `audit` set (`C8`, `C9`, `C10`, `C12`, `C12`).
- [x] **Step 2: Run, expect FAIL:** `pnpm run check:reuse` reports **78** violations: `no-text-reveal` 10, `no-dead-css-classes` 4, `no-index-css` 1, `no-dark-class` 6, `no-dead-tokens` 57. They span `globals.css`, `index.css`, `main.tsx`, `components.json`, `Home.tsx` and `ProjectDetail.tsx`.
- [x] **Step 3: Delete** everything listed under Files. Before deleting a `globals.css` rule, grep its class or token name across `src` and confirm it has 0 uses. Leave `gold-text`, `hover-lift`, `premium-card`, `premium-card-hover`, `glow-hover`, `premium-gradient-text` and `lenis` (all live).
- [x] **Step 4: Run** `pnpm install --frozen-lockfile` (proves the workspace edit changed no resolution), then the gate. Expect PASS, JS no larger than baseline + 0.5 kB — it should drop, since the observer and the Radix tooltip provider go — and CSS below `75.37 kB`. Confirm `grep -rn "tooltip" artifacts/portfolio/src` prints nothing. Run `npx impeccable detect artifacts/portfolio/src`: expect 4 findings, down from 5, because the Space Grotesk import in `index.css` is gone.
- [x] **Step 5: Browser check** (Opus, browser only — see [Browser checks](#browser-checks-agent-run)). Into `task-2/`:
  1. Every baseline screenshot, retaken at desktop and phone, matches.
  2. Every padding and container width in `metrics.json` matches exactly (0 px).
  3. The toast still animates in — it is what the kept `tw-animate-css` block exists for. Stub the clipboard with an `initScript` (`navigator.clipboard.writeText = async () => {}`), click the copy-email control, and confirm the toast appears and its element's computed `animation-name` is not `none`.
  4. No new console errors.
- [x] **Step 6: Commit** `Remove dead CSS, the reveal observer and index.css`.

---

### Task 3: Remove unused dependencies (C13)

**Files:**
- Modify: `artifacts/portfolio/package.json`, `pnpm-lock.yaml`

**Interfaces:** none.

- [x] **Step 1: Prove each is unused** (this is the failing-test equivalent; it must print nothing): `grep -rnE "from ['\"](date-fns|next-themes|react-icons|@radix-ui/react-tooltip)" artifacts/portfolio/src artifacts/portfolio/vite.config.ts`. If anything prints, stop and report. (`@radix-ui/react-tooltip` is unused only after Task 2 deletes `tooltip.tsx`.)
- [x] **Step 2: Remove** with `pnpm --filter portfolio remove date-fns next-themes react-icons @radix-ui/react-tooltip`. **Leave `gsap` and `@gsap/react` installed** — the owner is keeping them for `DESIGN_UPGRADE.md` §6 (D3).
- [x] **Step 3: Run the gate.** Expect JS and CSS byte-identical to Task 2's numbers (nothing imported them).
- [x] **Step 4: Commit** `Remove unused dependencies` (the portfolio `package.json` and `pnpm-lock.yaml` only).

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

- [x] **Step 1: Add** `no-window-lenis`, `lenis-easing-once` and `native-scroll-in-lenis` (audit `C5`, `C15`, `C7`).
- [x] **Step 2: Run, expect FAIL** with 14 violations (6 + 3 + 5).
- [x] **Step 3: Write `src/lib/lenis.ts`.** If `resize` is not on the `Lenis` type in `node_modules/lenis/dist/lenis.d.ts`, keep `lenis.resize?.()` and say so. Never cast.
- [x] **Step 4: Rewire the call sites.**
  - `SmoothScroll` builds Lenis with `duration: SCROLL_DURATION, easing: scrollEasing`, calls `setLenis(lenis)`, and on cleanup calls `setLenis(null)` and `lenis.destroy()`. **Also keep the id returned by `requestAnimationFrame` and `cancelAnimationFrame` it in that cleanup** (`SmoothScroll.tsx:32-37` never does today). The effect's `[]` makes that harmless now, but Task 9 gives it a dependency, and an un-cancelled loop would then run beside the new one — the second RAF loop CLAUDE.md forbids. In dev it already double-fires under StrictMode.
  - `Navbar` calls `scrollToElement(target, SCROLL_MARGIN_TOP)`.
  - `Contact` and `BackToTop` call `scrollToY(0)`.
  - `Home.jump` calls `scrollToY(top, { immediate: true })` and uses `reassert(jump, [40, 150, 320, 550, 850, 1300, 1900])` in place of its `timers` array. Keep its `ResizeObserver`, the stop listeners and the 2300 ms hard stop.
  - `ProjectDetail` calls `toTop()` once, then `reassert(toTop, [0, 60, 160])`, where `toTop = () => scrollToY(0, { immediate: true })`.
  - Delete the moved comments, and keep one line in `lenis.ts` explaining why callers must not run their own RAF.
- [x] **Step 5: Run the gate, expect PASS.** `grep -rn "__lenis" artifacts/portfolio/src` prints nothing.
- [x] **Step 6: Browser check** (the Opus reviewer, with the code review). Into `task-4/`, at desktop:
  1. **Nav links:** for each, `scrollY` 2500 ms after the click is within ±2 px of the baseline.
  2. **Project opens at the top:** scroll to the bottom of Home, click a project link; 500 ms after the route changes, `scrollY` is `0`.
  3. **Hash return (Review Focus 1):** under `emulate { cpuThrottlingRate: 4, networkConditions: "Fast 4G" }`, open `/projects/arogyalens` and click "See more projects". 2500 ms later the `#project-arogyalens` row's top is within ±20 px of the baseline. Clear the emulation afterwards.
  4. **Back-to-top:** from the bottom of Home, click Contact's arrow. At 300 ms `scrollY` is strictly between its start and `0` (it glides rather than jumps); at 2500 ms it is `0`.
  5. **Scroll feel, by proxy:** `<html>` has the `lenis` class; idle `requestAnimationFrame` calls per second are within baseline + 5%; `SCROLL_DURATION` is `1.2` and `scrollEasing` is today's curve.
  6. No new console errors.
- [x] **Step 7: Commit** `Move Lenis access into one module`.

**Reviewer looks hardest at:** decision 5 (resize plus force on both immediate paths); that `Home`'s cleanup still cancels everything `reassert` scheduled; that `SmoothScroll` remains the only RAF loop.

---

### Task 5: Type the props (C6)

**Files:**
- Modify: `src/components/sections/Experience.tsx` (`ExperienceItem`), `src/components/sections/Projects.tsx` (`ProjectRow`), `src/components/ui/PortableBody.tsx`, `src/components/ui/ScrollRevealText.tsx` (`Character.progress`), `src/lib/sanityQueries.ts` (`SanityProjectDetail.body`), `src/lib/projectsData.ts` (the `p`/`h2`/`h3`/`bullets` builders), `scripts/src/reuse-rules.ts`

**Interfaces:**
- Consumes: `SanityExperience`, `SanityProject` (existing, `sanityQueries.ts`); `import type { PortableTextBlock } from '@portabletext/react'`. Import only from `@portabletext/react`. `@portabletext/types` is not declared, and importing it is the phantom-dependency bug CLAUDE.md forbids. Also `import type { MotionValue } from 'framer-motion'`.
- Produces: `ExperienceItem({ data, index }: { data: SanityExperience; index: number })`; `ProjectRow({ project, index }: { project: SanityProject; index: number })`; `export interface SanityBodyImage { _type: 'image'; _key?: string; url?: string; caption?: string }` in `sanityQueries.ts`, because the GROQ projection (`sanityQueries.ts:66-69`) returns image members as `{ _type: 'image', url, caption }` with no `children` — `PortableTextBlock[]` alone mistypes them, and `tsc` cannot catch it because `sanityFetch<T>` is unchecked; `SanityProjectDetail.body?: Array<PortableTextBlock | SanityBodyImage>`; `PortableBody({ value }: { value: NonNullable<SanityProjectDetail['body']> })` (PortableText's generic accepts the union, and `PortableBody.tsx:72-91` already renders those image members); the builders return `PortableTextBlock` (or `PortableTextBlock[]` for `bullets`).

- [x] **Step 1: Add** `no-any` (audit `C6`).
- [x] **Step 2: Run, expect FAIL** with 5 violations (11 at baseline, minus the 6 `__lenis` casts Task 4 removed).
- [x] **Step 3: Replace each `any`** with the type above. Fix what `tsc` reports in the builders by annotating return types, not by casting (`_type: 'block'` widens to `string` without the annotation). Drop `(t: string)` in `ProjectRow`'s `tech.map`, since it is now inferred.
- [x] **Step 4: Run the gate, expect PASS.** Expect JS byte-identical (types only).
- [x] **Step 5: Commit** `Type section props and Portable Text bodies`.

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

- [x] **Step 1: Add** `fallback-in-hooks` (audit `C2`).
- [x] **Step 2: Run, expect FAIL** with 7 violations: 5 sections, plus 2 in `ProjectDetail.resolveDetail`.
- [x] **Step 3: Implement** `orFallback`, `useSanityList` and the four hooks. Move the fallback arrays to `fallbackContent.ts` and **annotate** each one (`const fallbackSkills: SanitySkillGroup[] = [...]`, and so on). They are untyped literals today (`Experience.tsx:8`, `Certifications.tsx:7`, `Contact.tsx:13`), so there is no existing type to carry over — annotating is what makes a fallback that drifts from its Sanity interface a typecheck failure.
- [x] **Step 4: Update the call sites.**
  - Sections become `const skills = useSanitySkills();` (no destructuring).
  - `Contact` uses `orFallback(settings?.socials, fallbackSocials)` and `settings?.contactEmail || FALLBACK_EMAIL`.
  - In `resolveDetail`, gallery becomes `orFallback(sanity.gallery, fallback.gallery)` and tech becomes `orFallback(fallback.tech, sanity.tech)`. The argument order is deliberately reversed, because the bundled write-up's tech list wins today (Review Focus 2).
- [x] **Step 5: Run the gate, expect PASS.**
- [x] **Step 6: Browser check** (the Opus reviewer, with the code review). Into `task-6/`:
  1. **Sanity blocked:** navigate to `/` with an `initScript` that makes `fetch` reject for any URL containing `api.sanity.io` (wrap `window.fetch`; leave other URLs alone). `wait_for` one literal string from each fallback in `lib/fallbackContent.ts` and `lib/projectsData.ts` — a skill group, a certification title, an experience company, a project title, and `sravankumar0103@gmail.com` — and confirm two social links render. Screenshot each section.
  2. **Project page blocked:** same `initScript`, navigate to `/projects/arogyalens`. The page renders, and its tech chips equal `fallbackProjectDetails`' tech list for that slug, in order (Review Focus 2 — the reversed precedence in `resolveDetail`).
  3. **Sanity live:** navigate again without the `initScript`. `list_network_requests` shows `api.sanity.io` requests with status 200, and the section screenshots match the baseline.
  4. No new console errors in the live run (the blocked run's own fetch errors are expected).
- [x] **Step 7: Commit** `Move Sanity fallbacks into the query hooks`.

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

- [x] **Step 1: Add** `ease-constants`, `viewport-constants`, `primary-literal` and `reveal-colours` (audit `C3`, `C3`, `C16`, `C16`).
- [x] **Step 2: Run, expect FAIL** with **35** violations: `ease-constants` 10, `viewport-constants` 8, `primary-literal` 10 (12 at baseline, minus the 2 Task 2 deleted with `.glow-primary` and `.rule-divider`), `reveal-colours` 7.
- [x] **Step 3: Write `src/lib/motion.ts`** and the `ScrollRevealText` tone map.
- [x] **Step 4: Rewire the motion call sites.**
  - Experience and Projects: `{...rowEnter}` and `{...expandOnView}`, and `useInView(ref, { margin: VIEWPORT_CENTER_MARGIN })`.
  - Certifications and Projects chips: `{...slideInFromRight(0.1)}` and `{...slideInFromRight(0.2)}`.
  - Hero, Navbar and ProjectDetail: import the `EASE_*` constants.
  - Projects' two `ease-[cubic-bezier(0.16,1,0.3,1)]` classes become `ease-out-expo`.
- [x] **Step 5: Rewire the colours.**
  - Projects and Contact use `tone="primary"`.
  - About uses `tone="muted"` and renders `ScrollRevealText` once, with `settings?.aboutHighlight || "I don't just write code; I build solutions that work."` (removing the C16 copy). **Check this against `About.tsx:34-39` first.** Today the two branches differ: the no-`aboutPara1` branch shows the hardcoded sentence, not `aboutHighlight`. Collapsing them makes Sanity's `aboutHighlight` appear in that branch where it does not today. If `aboutHighlight` is set in Sanity, that is a visible content change — report it and keep the hardcoded text in the fallback branch unless the owner says otherwise.
  - The Skills and Experience shadows use `hsl(var(--primary)/0.18)` and `hsl(var(--primary)/0.5)` inside the same `shadow-[…]` arbitrary values.
  - In `globals.css`, each `hsla(11, 81%, 57%, a)` becomes `hsl(var(--primary) / a)` and each `hsl(11, 81%, 57%)` becomes `hsl(var(--primary))`. Leave the `65%`/`45%` gradient stops; they are not tokens and are `DESIGN_UPGRADE.md` §1's to change.
  - The remaining `cubic-bezier(0.16, 1, 0.3, 1)` uses become `var(--ease-out-expo)`.
- [x] **Step 6: Run the gate, expect PASS.** Then prove the CSS still resolves: `grep -o "ease-out-expo[^}]*" artifacts/portfolio/dist/assets/*.css | head -3` shows the utility, and `grep -o "var(--primary)" artifacts/portfolio/dist/assets/*.css | wc -l` is higher than the value you recorded before Step 3 (it is **53** on today's `dist`). Use `grep -o … | wc -l`, not `grep -c`: the built CSS is a single line, so `grep -c` prints `1` before and after and can never show the increase. If an arbitrary shadow did not compile (a `/` inside brackets misparsed), the class is missing from the built CSS: fix that before continuing.
- [x] **Step 7: Browser check** (the Opus reviewer, with the code review). Into `task-7/`, at desktop and phone:
  1. Every baseline screenshot matches — `hsl(var(--primary))` must render exactly as `hsl(11, 81%, 57%)` did.
  2. The computed `box-shadow` of the Skills card and the Experience dot, and the computed `color` of a revealed Projects title character, equal the baseline strings exactly.
  3. Rows still scale in and the chips still slide in from the right (the presets replaced inline props value for value): screenshot a Projects row mid-entry at 200 ms and compare with the same moment at baseline — or, if timing makes that flaky, read the row's inline `transform` at 200 ms and confirm it is a `scale(…)` between 0.95 and 1.
  4. No new console errors.
- [x] **Step 8: Commit** `Centralise motion constants and colour tokens`.

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
  - `PillLink.tsx`: `export function PillLink({ label, icon, href }: { label: string; icon: ReactNode; href?: string })`. With `href` it renders an `<a target="_blank" rel="noopener noreferrer">` that stops click propagation. Without one it renders a `<span>`, because Certifications' chip already sits inside an `<a>` and nested anchors are invalid. Classes are Projects' current chip classes, with the group renamed `group/pill`. If D4 is "no", add `filled?: boolean` to switch to Certifications' resting background.
  - `projectsData.ts`: `export function codeUrl(project: { github?: string }, slug?: string): string | undefined` returns `undefined` when there is no `github` or the slug is in the module-private `NO_CODE_SLUGS` (moved from Projects). `export function liveUrl(project: { live?: string }): string | undefined` returns `undefined` when `live` is missing or `'#'`.

- [x] **Step 1: Add** `container-shell`, `page-shell`, `pill-chip` and `project-link-rules` (audit `C1`, `—`, `C4`, `C14`).
- [x] **Step 2: Run, expect FAIL** with 20 violations (`container-shell` 11 + `page-shell` 2 + `pill-chip` 3 + `project-link-rules` 4).
- [x] **Step 3: Write the three components and the two `projectsData.ts` helpers.**
- [x] **Step 4: Rewire.**
  - About, Experience, Skills, Projects and Certifications use `<Section id=…>`. About passes `containerClassName="relative z-10"`.
  - Hero, Contact and ProjectDetail have their own section shells, so they keep them and use `cn(CONTAINER, '…')`. ProjectDetail has **four** such containers (lines 124, 181, 200, 285), three at `max-w-7xl` and one at `max-w-3xl`: they become `cn(CONTAINER, 'max-w-7xl', …)` and `cn(CONTAINER, 'max-w-3xl', …)`. The `container-shell` rule's `(max-w-\w+ )?` group is what makes these four count, so none can be quietly skipped.
  - Home and ProjectDetail use `<PageShell>`.
  - The Projects Code/Live chips and the Certifications View chip use `<PillLink>`.
  - Projects and ProjectDetail use `codeUrl`/`liveUrl`. ProjectDetail's larger "View Code"/"Live Demo" buttons are a different design and stay as they are.
- [x] **Step 5: Run the gate, expect PASS.**
- [x] **Step 6: Run** `npx impeccable detect artifacts/portfolio/src`. Expect the same findings as after Task 2 and none new.
- [x] **Step 7: Browser check** (the Opus reviewer, with the code review; Review Focus 4). Into `task-8/`, at desktop and phone:
  1. **Spacing:** every padding and container width in `metrics.json` matches the baseline exactly (0 px), on Home and the project page.
  2. **Parity:** every baseline screenshot matches, except the Certifications chip, which now has the Projects look (D4) — no resting background, label dimmed until hover.
  3. **Chips:** click a Projects "Code" chip. The current page's URL is unchanged (the row's detail link did not fire), and `list_pages` shows a new tab on the GitHub URL. Close that tab.
  4. **Link rules:** in `take_snapshot`, the hexapod row has no "Code" link and the CRM row (`live: '#'`) has no "Live" link; `/projects/hexapod-robotic-arm` has no "View Code" link.
  5. No new console errors.
- [x] **Step 8: Commit** `Extract Section, PageShell and PillLink`.

**Reviewer looks hardest at:** that `cn`/`tailwind-merge` drops no class from About's container; that `<span>`/`<a>` is chosen correctly in Certifications; that the Projects row's `onClick` propagation behaviour is unchanged.

---

### Task 9: Respect reduced motion (C17) — D5

**Files:**
- Modify: `src/App.tsx`, `src/components/ui/SmoothScroll.tsx`, `src/components/3d/HeroScene.tsx`, `src/lib/lenis.ts`, `src/globals.css`

**Interfaces:**
- Consumes: framer-motion's `MotionConfig` and `useReducedMotion` (reuse the library's mechanism; don't hand-roll a `matchMedia` hook); Task 4's `setLenis`, `scrollToY` and `scrollToElement`.
- Produces: `lib/lenis.ts` gains a private `prefersReducedMotion(): boolean` (`window.matchMedia('(prefers-reduced-motion: reduce)').matches`). The native fallbacks use `behavior: prefersReducedMotion() ? 'auto' : 'smooth'`.

- [x] **Step 1: Write the failing check.** It must print `0`: `grep -rcE "MotionConfig|useReducedMotion|prefers-reduced-motion" artifacts/portfolio/src | awk -F: '{s+=$2} END {print s}'`.
- [x] **Step 2: Implement.**
  - `App` wraps everything in `<MotionConfig reducedMotion="user">`.
  - `SmoothScroll` reads `useReducedMotion()`. When it is true, it creates no Lenis and calls `setLenis(null)`, so every scroll goes native through Task 4's fallback. The effect depends on that value. **The preference is read at mount only.** framer-motion 12's `useReducedMotion` returns `useState(prefersReducedMotion.current)` and does not subscribe to media-query changes (its source carries a "TODO See if people miss automatically updating"), so a visitor who flips the OS setting mid-session sees it apply on reload. Do not claim live switching, and do not hand-roll a `matchMedia` listener to get it — that is a second mechanism beside the library's.
  - `HeroScene` uses `frameloop={!isVisible ? 'never' : reduce ? 'demand' : 'always'}`. **Off-screen stays `'never'` for everyone** — that is CLAUDE.md's hero pause guard, and `isVisible && !reduce ? 'always' : 'demand'` would quietly change the off-screen state to `'demand'` for every visitor, which is not a no-op. `'demand'` applies only while the hero is on screen and the visitor asked for reduced motion: it renders a still first frame rather than the blank canvas `'never'` gives from mount. This deliberately departs from `DESIGN_UPGRADE.md` §6's `frameloop="never"` line, for that reason; say so in the report.
  - `globals.css` gains one `@media (prefers-reduced-motion: reduce)` block that sets `animation-duration`, `animation-iteration-count: 1` and `transition-duration` to `0.01ms !important` on `*, ::before, ::after`, and `scroll-behavior: auto`.
  - `ScrollRevealText`'s colour sweep stays: colour is not motion.
- [x] **Step 3: Run** the Step 1 command, now non-zero, and the gate. Expect JS growth of 1 kB or less.
- [x] **Step 4: Browser check with the preference off** (the Opus reviewer). Into `task-9/off/`: re-run Task 4's checks 1–5 and Task 8's checks 1–2 — all must still pass (Review Focus 5: a visitor without the setting sees no change).
- [x] **Step 5: Browser check with the preference on.** `emulate { prefersReducedMotion: "reduce" }` and reload. Into `task-9/on/`:
  1. `<html>` has **no** `lenis` class — scrolling is native.
  2. The hero canvas is present and its screenshot is not blank; two screenshots 1 s apart are identical (a still scene).
  3. Scroll a section into view; 100 ms later no element inside it has an inline `transform` other than `none` or the identity (no slide-in).
  4. Click a nav link: within 100 ms `scrollY` is within ±2 px of the baseline landing point (it jumps).
  5. "See more projects" from `/projects/arogyalens` still lands on the row (Task 4 check 3's tolerance).
  6. Clear the emulation afterwards. No new console errors.
- [x] **Step 6: Commit** `Respect prefers-reduced-motion`.

**Reviewer looks hardest at:** that `getLenis()` returns `null` while reduced, so no caller holds a stale instance; that the off-screen hero frameloop is still `'never'` for a visitor without the preference; that `SmoothScroll`'s effect cancels its RAF and destroys Lenis on cleanup, since the effect now has a dependency and can re-run.

---

### Task 11: Accessibility fixes from the UI audit (C18–C26) — D7

**Runs after Task 9 and before the Simplify pass.** It is numbered 11 because it was added after the plan was written; it touches `Contact`, `Certifications`, `Projects`, `Experience`, `ScrollRevealText`, `Hero` and `HeroScene`, all of which Tasks 4–9 reshape first.

**Files:**
- Modify: `src/components/sections/{Contact,Certifications,Projects,Experience,Hero}.tsx`, `src/components/ui/ScrollRevealText.tsx`, `src/components/3d/HeroScene.tsx`, `scripts/src/reuse-rules.ts`

**Interfaces:**
- Consumes: `scrollToElement(target: HTMLElement, offsetTop: number)` (Task 4); `VIEWPORT_CENTER_MARGIN` (Task 7); `ScrollRevealText` with Task 7's `tone` prop.
- Produces (in `Contact.tsx`, next to `iconForPlatform`): `function labelForPlatform(platform?: string): string` — `github` → `'GitHub'`, `linkedin` → `'LinkedIn'`, `email` → `'Email'`, `twitter` → `'X (Twitter)'`, `instagram` → `'Instagram'`, otherwise `'Website'`; and `SocialIcon({ href, icon, label }: { href: string; icon: ReactNode; label: string })`.

- [x] **Step 1: Add the guard rules** (see the [rule table](#guard-rule-table)): widen `native-scroll-in-lenis` to also catch `scrollIntoView(` (audit `C24`), and add `no-fake-href` (`C20`), `no-nbsp-split` (`C22`) and `no-infinite-loop` (`C23`).
- [x] **Step 2: Run, expect FAIL** with **4** violations, one each: `Hero.tsx` (`scrollIntoView`), `Certifications.tsx` (`|| '#'`), `ScrollRevealText.tsx` (`\u00A0`), `Hero.tsx` (`repeat: Infinity`).
- [x] **Step 3: Fix the six that don't change the look.**
  - **C18:** `SocialIcon` takes `label` and sets `aria-label={`${label} (opens in a new tab)`}` on its `motion.a`. The call site passes `labelForPlatform(s.platform)`.
  - **C19:** the copy-email `motion.div` becomes `motion.button type="button"` with `aria-label={`Copy email address ${email}`}`, keeping `onClick`, `whileHover` and `whileTap`. A button may hold only phrasing content, so its inner `div` and `motion.div` become `span`/`motion.span` with the **same classes** (`flex`/`inline-flex` still lays them out identically). Add `text-left`, since browsers centre button text. The Radix toast already announces "copied" through its live region, so add no `aria-live`.
  - **C20:** when `cert.link` is missing, render the row as a `<div>` with the same `className` instead of `<a href="#">`; keep the `<a>` (with `href`, `target`, `rel`) when it is present. No cast, no `any` — choose the tag before rendering, or render two branches around shared children.
  - **C26:** add `autoComplete="name"` to the name input and `autoComplete="email"` to the email input, beside their `{...register(...)}` spreads. The message `textarea` gets none — no autofill token fits free text.
  - **C24:** "Explore work" calls `scrollToElement(target, 0)` for `#about`. *(Run ruling, 6 Nov 2026 — replaces the earlier `scrollToElement(target, parseFloat(getComputedStyle(target).scrollMarginTop) || 0)`: Lenis 1.3.23 subtracts the target's `scroll-margin-top` itself, and after Task 9's fix the native branch does too, so passing the margin again would land About 100 px lower than today.)* With offset `0`, both paths honour `scroll-margin-top` exactly as `scrollIntoView` did (100px desktop, 80px under 768px, `globals.css`), so the landing point is unchanged.
  - **C25:** in `RotatingShapes`, create the material once with `useMemo(() => new THREE.MeshStandardMaterial({ … same values … }), [])` and dispose it in a `useEffect` cleanup. Build the 8 spheres once with `useMemo(() => Array.from({ length: 8 }, () => ({ speed, position, radius })), [])` using today's exact `Math.random()` formulas, and map over that. Do not touch `isVisible`, `frameloop` or the `IntersectionObserver` — that is CLAUDE.md's hero pause guard. (Disposing and then reusing a material is safe in three.js — it recompiles on next use — so StrictMode's dev-only double mount is not a problem.)
- [x] **Step 4: Fix the three visible ones (D7).**
  - **C21:** in `Projects` and `Experience`, `useInView(ref, { margin: VIEWPORT_CENTER_MARGIN, once: true })`. `isInView` feeds only `ScrollRevealText`'s `isActive` in both files, so nothing else changes: the title reveals once and stays revealed. Leave the `rowEnter`/`expandOnView` presets at `once: false`; they don't affect text contrast.
  - **C22:** in `ScrollRevealText`'s `isActive` branch, render `{char}` instead of `{char === " " ? "\u00A0" : char}`. This is safe because the character spans are plain inline (`characterClassName` adds only a hover colour); if anything makes them `inline-block`, wrap per word instead, since an inline-block space collapses to zero width.
  - **C23:** the hero scroll-hint dot's `repeat: Infinity` becomes `repeat: 1` — two 2-second cycles, 4 s in total, under WCAG's 5 s limit. It rests on its last keyframe (`opacity: 1`, `y: 0`), so the hint stays visible as a still dot.
- [x] **Step 5: Run the gate and the guard, expect PASS.** Then confirm each fix landed:
  - `grep -n "aria-label\|motion.button" artifacts/portfolio/src/components/sections/Contact.tsx` shows the button and the `SocialIcon` label.
  - `grep -n "once: true" artifacts/portfolio/src/components/sections/{Projects,Experience}.tsx` shows both `useInView` calls (unless D7 was "no").
  - `grep -c "useMemo" artifacts/portfolio/src/components/3d/HeroScene.tsx` prints at least `2`.
  - `npx impeccable detect artifacts/portfolio/src` shows no finding that was not there after Task 2.
- [x] **Step 6: Browser check** (the Opus reviewer, with the code review). Into `task-11/`. Navigate with an `initScript` that stubs the clipboard (`navigator.clipboard.writeText = async (t) => { window.__copied = t; }`) — headless Chrome may refuse real clipboard access, which would fail the check for the wrong reason.
  1. **C19 copy-email, by keyboard:** `press_key` Tab until `document.activeElement` is a `BUTTON` whose `aria-label` starts with "Copy email address". Press Enter: `window.__copied` equals the email and the toast's "copied" text appears. Reset `window.__copied`, press Space: same result.
  2. **C18 social links:** in `take_snapshot`, the links read "GitHub (opens in a new tab)" and "LinkedIn (opens in a new tab)".
  3. **C20 certifications:** `document.querySelectorAll('a[href="#"]').length` is `0`. Clicking a certificate row that has no link leaves `scrollY` unchanged.
  4. **C21 titles stay readable:** scroll a project row to the top 10% of the viewport, then to 85%, waiting 1000 ms each time. Both times, after the row has been revealed once, the computed `color` of its title's first character equals the baseline's revealed colour and is not `rgba(255, 255, 255, 0.1)`. Repeat for an Experience company name.
  5. **C22 wrapping:** at phone (390) and small phone (320), every project title `h3` has `scrollWidth <= clientWidth + 1` and a right edge inside the viewport. Screenshot the Projects section at both widths.
  6. **C23 hint stops:** load Home, wait 6000 ms; the hint dot's computed `opacity` is `1`, and a second read 500 ms later is identical.
  7. **C24 "Explore work":** at desktop and phone, `scrollY` 2500 ms after the click is within ±2 px of the baseline. At 300 ms it is strictly between its start and that value — it glides now, through Lenis.
  8. **C25 spheres:** screenshot the hero at load; scroll to Contact and back three times (the off-screen pause fires each time); screenshot again. The small spheres sit in the same places in both shots (the large shapes keep rotating; ignore them).
  9. **C26 autofill:** `evaluate_script` confirms the name input's `autocomplete` is `"name"` and the email input's is `"email"`, and `list_console_messages` no longer shows Chrome's "missing autocomplete" notice.
  10. **Whole-page accessibility:** the `lighthouse_audit` accessibility score is at least the baseline's, and its `link-name` audit passes. `npx impeccable detect http://127.0.0.1:4173` shows no finding that is not in `baseline/detect.txt`.
  11. No new console errors.
- [x] **Step 7: Commit** `Fix accessibility issues from the UI audit`.

**Reviewer looks hardest at:** that the copy-email button contains only phrasing content and looks pixel-identical; that `Certifications` has no cast and no fake link left; that "Explore work" lands where it did on both breakpoints; that the hero pause guard is untouched and the material is disposed exactly once per mount.

---

### Task 10: Docs

**Files:**
- Modify: `docs/AUDIT_REPORT.md`, `CLAUDE.md`, `WORKSPACE_GUIDE.md`, `docs/specs/DESIGN_UPGRADE.md` (two factual lines only), this plan's `Status` line

- [x] **Step 0: Check the docs are clean before editing.** Run `git status --short docs CLAUDE.md WORKSPACE_GUIDE.md .gitignore`. Expected: no output (this plan went into Task 1's commit). If anything is listed, stop and report it: Task 10's edits are left unstaged for the owner, so they must not mix with anything else.
- [x] **Step 1: `AUDIT_REPORT.md`.**
  - Move C1, C2, C4–C10 and the new C12–C17 to "Resolved", one line each with the date. **C3 moves only in part** — the easing, viewport margin and reveal colours are resolved; its entry-variant bullet stays open (see "Not in this plan"). C11 stays open.
  - Also fix these, which this branch makes wrong: the Repo hygiene lines about `pnpm-workspace.yaml` and `hello.ts` (both resolved by Tasks 2 and 1), the Track A item 1 line that lists `gsap` among the bundled libraries (it is installed but not imported, so it does not ship), and the "see C7" cross-reference.
  - Correct the "Two icon libraries" skip line (C13: only `lucide-react` remains).
  - Replace the build-state numbers with the final ones, and note the Space Grotesk `impeccable detect` finding as gone.
  - Bump "Last updated".
  - Add one line naming the guard: "`pnpm run check:reuse` (CI) keeps Track C closed; add a rule when you remove a duplicate."
  - Record the Impeccable audit: add C18–C26 to "Resolved" (those Task 11 shipped; any D7 declined stay open), note the unused tooltip as removed, and add a new **"Track D — UI audit (6 Nov 2026)"** section listing every "Not fixed here" item from this plan's [Impeccable audit](#impeccable-audit-6-nov-2026) section, one line each with its severity and file. Put the 11/20 score in the build-state line.
  - The duplicate-files section: `tooltip.tsx` was one of the files `portfolio` shared with `mockup-sandbox`. Task 2 deletes the portfolio copy, so that pair is no longer a duplicate — update the count.
- [x] **Step 2: `CLAUDE.md`.**
  - Commands: add `pnpm run check:reuse` and `pnpm --filter @workspace/scripts run test`.
  - Traps: delete the now-false traps (dead `index.css`, `tw-animate-css` import, the `main.tsx` observer, the three dead classes, "two icon libraries"). Add one trap: "`globals.css` ~4–590 is an inlined `tw-animate-css` — except the Lenis base styles at ~230–250, which are ours; the toast animations need the rest."
  - Fix three more lines this branch makes wrong: "**`scripts`** — one `hello.ts`" (Task 1 replaces it with the guard), the Sanity rule "`data ?? fallback`" (Task 6 moves the fallback into the hooks), and the no-code-splitting trap that lists `three`, `gsap` and `framer-motion` (gsap is installed but never imported, so it does not ship in the bundle). Also rewrite the stale comment at `sanityQueries.ts:3` that tells readers components use `data ?? fallback` — that one belongs to Task 6 Step 3.
  - Reuse section: name `lib/lenis.ts`, `lib/motion.ts`, `Section`/`CONTAINER`, `PageShell`, `PillLink`, `orFallback`, and the fallback files `lib/fallbackContent.ts` and `lib/projectsData.ts` (replacing "next to their query").
  - Design tooling: add the **Chrome DevTools MCP** beside Watermelon — what it is (headless, isolated profile, telemetry off), that agents use it for browser checks against `vite preview` on `127.0.0.1:4173`, and its reinstall command, copied from this plan's "Browser checks" section into CLAUDE.md's reinstall block.
  - Design tooling: both MCP servers moved to **user scope** on 6 Nov 2026, because the IDE's lowercase `d:` path stopped local-scope servers loading. Change Watermelon's "(local scope …)" to user scope, change its reinstall command to `claude mcp add --transport http watermelon --scope user https://mcp.watermelon.sh/mcp`, and add one line explaining why. Make the same scope correction in `AUDIT_REPORT.md`'s "Design tooling installed" entry.
  - Design tooling: drop "Do not run `npx shadcn add` yet" now that `components.json` points at `globals.css`; keep the dependency-approval line, and add the caution that `shadcn add` writes tokens in its own format, which must be converted to this repo's raw HSL triplets.
  - **Model and effort:** replace the Haiku-for-mechanical guidance with the owner's standing rule — build with Sonnet (high, or xhigh for behaviour), review with Opus, fix with Sonnet xhigh and escalate to Opus, final whole-branch review on Opus at high effort — and name the four `.claude/agents/portfolio-*` agents that encode it.
  - **Where to look → `docs/plans/`:** add that a plan runs with `/run-plan <plan>` (`.claude/commands/run-plan.md`), or when the owner says "go"; plans follow the "Owner decisions → Execution → Task dispatch" shape this plan uses.
  - Add `gsap` and `@gsap/react` to Traps as **installed but unused on purpose** — kept for `DESIGN_UPGRADE.md` §6 (D3). Like `BackToTop`/`CustomCursor`, don't delete them in a cleanup sweep.
  - Reuse section: "`portfolio` and `mockup-sandbox` already share six byte-identical files" becomes five — Task 2 deleted the portfolio's `tooltip.tsx`.
- [x] **Step 3: `WORKSPACE_GUIDE.md`.** Add the two guard commands under Key Commands.
- [x] **Step 4: `DESIGN_UPGRADE.md`.** Make two factual corrections:
  - §1 Motion: "currently inconsistent" → "now centralised in `src/lib/motion.ts`; change the values there".
  - §1 Spacing: name `Section.tsx` as the one place to change the padding.
  - Change nothing else; it is the owner's spec. Two §6 lines are already inaccurate and stay so: "GSAP already bundled" (gsap is installed but never imported, so it is not in the bundle), and §6's `frameloop="never"`, which now differs from what Task 9 ships. **Name both in your report instead of editing them**; they are the owner's to decide.
- [x] **Step 5: Leave these changes unstaged.** No commit — doc edits stay unstaged for the owner's own review (CLAUDE.md → Git), and this run makes exactly 10 commits, one per Task 1–9 and 11. Report the files touched; the owner commits them in their own words if they agree with the edits.

---

## Done when

- `pnpm --filter @workspace/scripts run test` passes, and `pnpm run check:reuse` passes with all 21 rules in `RULES` — 18 from Tasks 1–9, plus Task 11's three (and its widened `native-scroll-in-lenis`).
- `pnpm run typecheck` and `pnpm --filter portfolio run build` are clean. JS is within +2 kB of `1,603.55 kB`, CSS is below `75.37 kB`, and both numbers are in the report.
- `npx impeccable detect artifacts/portfolio/src` shows no finding that was not there at baseline.
- The agent-run browser checks after Tasks 2, 4, 6, 7, 8, 9 and 11 have passed, with their evidence in `.impeccable/review/reuse-cleanup/`, and anything unclassifiable is listed under "Needs owner eyes". No preview server is left running.
- No `any`, no `__lenis`, no dead class, token or dependency remains in `artifacts/portfolio`.
- `AUDIT_REPORT.md`, `CLAUDE.md`, `WORKSPACE_GUIDE.md` and `DESIGN_UPGRADE.md` are updated and left unstaged for the owner to commit (Task 10). Exactly 10 commits exist on the branch. Nothing is pushed.

## Not in this plan

- **Code splitting** (Track A item 1). It belongs to the hero rework, per `DESIGN_UPGRADE.md` §6.
- **Web3Forms replacement** (item 3), pending the owner's choice. **Tableau** (item 4) is a Sanity content call.
- **Fonts** (C11) and **gradient text** (the remaining `impeccable detect` findings) belong to `DESIGN_UPGRADE.md` §1.
- **`mockup-sandbox` duplicates** (D6) and the **dormant backend** (Track B) wait on owner decisions.
- **`siteSettings` per-field fallbacks** in Hero, About and Contact (`settings?.x || '…'`). They are single values and partly JSX, so a different shape from the list fallbacks. Revisit when the About copy moves fully to Sanity.
- **Tech chips** (Projects versus ProjectDetail): two occurrences that differ by design (decision 4).
- **The rest of the Impeccable audit** — muted-text contrast, the 9–10px text floor, focus states, form error wiring, landmarks and skip link, nav focus management, the hidden scrollbar, `ScrollRevealText` render cost, the CDN-loaded HDR, gallery touch targets, and the 47 raw white/black alpha classes. Listed in [Impeccable audit](#impeccable-audit-6-nov-2026); Task 10 logs them as Track D. Most are visible design changes `DESIGN_UPGRADE.md` §1/§6 already owns.
- **C3's entry variant** — the audit's third C3 bullet, `initial { opacity: 0, y: 20 }` with `viewport { once: true, margin: '-100px' }`. It appears 9× (`initial={{ opacity: 0, y: 20 }}`) and `-100px` appears 4× (About ×2, SectionHeading ×2), but the durations and delays differ per site, so a single preset would change timings. `DESIGN_UPGRADE.md` §1 redefines this variant anyway. Task 7 centralises the easing, viewport-centre margin and reveal colours only; **C3 stays open for the entry variant**, and no guard rule covers it.

