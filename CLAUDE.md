# SK-Portfolio

pnpm workspace monorepo on Node 24, TypeScript 5.9. The live product is a React 19 + Vite 7 +
Tailwind v4 single-page portfolio, content-driven by Sanity CMS, deployed to Cloudflare Pages at
https://sravankumar.online. A dormant Express 5 + Drizzle backend sits beside it, unused.

**pnpm only.** `npm install` and `yarn` are blocked by the root `preinstall` hook. Never run a dev
server yourself unless asked — ask the user to run `pnpm --filter portfolio run dev` and report
what they see.

## What SK-Portfolio is

The personal portfolio of Sravan Kumar Diddi (AI & Full-Stack Developer, Hyderabad). A single
immersive marketing site: a 3D hero, scroll-driven reveals, a project list, per-project case-study
pages, and a contact form. There is no login, no database, and no server behind the live site —
it is static assets plus client-side `fetch` calls to Sanity and Web3Forms.

- **`artifacts/portfolio`** — **the live site.** The only deployed artifact. React 19, Vite 7,
  Tailwind v4, `wouter` routing, TanStack Query, Three.js (`@react-three/fiber` + `drei`), GSAP,
  Framer Motion, Lenis smooth scroll. Everything you are asked to change is almost certainly here.
- **`studio`** — Sanity Studio (CMS dashboard), project `3otp111t`, dataset `production`, hosted at
  https://sk-portfolio.sanity.studio. **Deliberately outside the pnpm workspace**: own
  `package-lock.json`, own npm, pinned to React 18 while everything else is React 19. That is
  correct, not an oversight — never "fix" it by folding it into the workspace.
- **`artifacts/mockup-sandbox`** — a scratch shadcn/ui playground. Not deployed, not referenced by
  the live site. Do not edit it to make a change to the portfolio.
- **`artifacts/api-server`, `lib/db`, `lib/api-spec`, `lib/api-zod`, `lib/api-client-react`** —
  **dormant backend scaffold.** One route (`GET /api/healthz`), an empty Drizzle schema, generated
  clients for that one endpoint. The live site does not import any of it. Leave it alone unless the
  task names it explicitly.
- **`scripts`** — one `hello.ts`. Effectively empty.

## Content lives in Sanity, not in the repo

The site reads content at runtime from Sanity's **live** query API (not the CDN) over plain
`fetch` — no Sanity SDK dependency. `artifacts/portfolio/src/lib/sanity.ts` is the transport;
`sanityQueries.ts` holds the GROQ queries and the typed React Query hooks.

- `projectId` / `dataset` are public identifiers, not secrets. They are committed on purpose.
- **Every section falls back to hardcoded content** (`data ?? fallback`, see `lib/projectsData.ts`).
  That fallback is the safety net that keeps the site up when Sanity is empty or unreachable —
  never remove a fallback, and when you add a Sanity-backed field, add its fallback in the same change.
- Document types live in `studio/schemaTypes/` (`siteSettings`, `project`, `experience`,
  `skillGroup`, `certification`). A new field is a two-sided change: the schema in `studio/`, the
  GROQ projection and TypeScript interface in `sanityQueries.ts`. Shipping one without the other
  silently renders nothing.
- Content the user asks to "change on the site" is usually a Sanity edit, not a code edit. Say so
  rather than hardcoding it.

## Commands

Run from the repo root unless stated otherwise.

- **Typecheck everything:** `pnpm run typecheck` — this is the gate. Run it after any TS/TSX edit.
- **Build everything:** `pnpm run build` (typechecks first, then builds each package).
- **Just the live site:** `pnpm --filter portfolio run typecheck` / `run build` / `run dev`.
- **Preview a production build:** `pnpm --filter portfolio run serve`.
- **Install:** `pnpm install`. In CI it is `pnpm install --frozen-lockfile`.
- **Studio** (from `studio/`, npm not pnpm): `npm run dev`, `npm run build`, `npm run deploy`.
- **Dormant backend, only if asked:** `pnpm --filter @workspace/api-server run dev`,
  `pnpm --filter @workspace/api-spec run codegen`, `pnpm --filter @workspace/db run push`.

There is no test suite, no linter and no formatter script. `prettier` is installed at the root but
not wired to a command — do not reformat files wholesale. **Typecheck + build is the whole
verification story**, so actually run both before claiming a change works.

CI (`.github/workflows/ci.yml`) runs typecheck + build on every push and PR to `main`. If it is
green locally it is green there; pin-version drift is the only usual difference.

## Where to look

**Every document lives in `docs/`.** Only three markdown files stay at the repo root:
`CLAUDE.md` (this file), `README.md` (public, for visitors) and `WORKSPACE_GUIDE.md` (monorepo
commands). Anything else you write — a spec, a plan, an audit, a decision record — goes under
`docs/`, in the subfolder for its kind:

```
docs/
  AUDIT_REPORT.md        the one living backlog: open, resolved, deliberately skipped
  specs/                 what we intend to build — design specs, brainstorm outputs
    DESIGN_UPGRADE.md
  plans/                 implementation plans, one per piece of work: YYYY-MM-DD-<topic>.md
```

- **This overrides every skill's default location.** Superpowers and similar skills default to
  `docs/superpowers/plans/` and `docs/superpowers/specs/` — write to `docs/plans/` and
  `docs/specs/` instead, and never create `docs/superpowers/`.
- Add a new subfolder under `docs/` only when a new *kind* of document appears that none of the
  above fits. Never a second backlog: findings go into `AUDIT_REPORT.md`.
- **The one exception is Impeccable's two context files**, `PRODUCT.md` and `DESIGN.md` (see
  Design tooling). Impeccable writes them at the project root and finds them by searching upward
  from its target to the git root, so moving them into `docs/` silently runs it without context.
  They stay at the root.
- Link docs by their real path (`docs/AUDIT_REPORT.md`, `docs/specs/DESIGN_UPGRADE.md`). Inside
  `docs/`, relative links are relative to the linking file.

Read the one doc for the area you are touching.

- `docs/AUDIT_REPORT.md` — **living document.** Open issues, what is already resolved, and what is
  deliberately skipped. Read it before proposing any cleanup: the thing you spotted may already be
  there, already decided against, or already fixed. **Track C is the duplication and dead-code
  backlog** — check it before extracting anything, and add to it when you find a new duplicate you
  are not in a position to fix. Update it when you resolve an item.
- `docs/specs/DESIGN_UPGRADE.md` — the visual/UX redesign spec: design tokens, motion language, hero
  direction, project-page restructure, bundle-splitting plan, accessibility rules, and a list of
  2026 clichés to avoid. **Spec only — nothing in it is implemented.** Read it before any design,
  animation or layout work so you build toward the agreed direction. Sections marked 🔵 are
  undecided; ask rather than picking for the user.
- `README.md` — public-facing, for visitors. Keep it short; it is not a place for internal notes.
- `WORKSPACE_GUIDE.md` — monorepo stack summary and the cross-package commands.
- `docs/plans/` — implementation plans. Before starting multi-step work, check whether a plan for
  it already exists; when executing one, follow it and tick its checkboxes.
- `pnpm-workspace.yaml` — workspace globs, the dependency **catalog**, and the supply-chain policy.

Do not create new tracking docs; fold findings into `AUDIT_REPORT.md` or `DESIGN_UPGRADE.md`.
Impeccable's `PRODUCT.md` (from `/impeccable init`) and `DESIGN.md` (from `/impeccable document`)
describe the product and the *current* visual system; `DESIGN_UPGRADE.md` remains the *target*.
Do not merge or duplicate the two.

## Design tooling

Two tools are installed to get a better UI. Use them for UI work instead of improvising.

**Both are local tooling and gitignored** — the Impeccable skill, its four agents, its
`.impeccable/` working folder, `.claude/settings.local.json` (its hook) and any `.mcp.json`. They
are never committed. On a fresh clone, or a machine where `/impeccable` is missing, reinstall from
the repo root:

```bash
npx impeccable install --providers=claude --scope=project --yes        # skill, agents, hook
claude mcp add --transport http watermelon https://mcp.watermelon.sh/mcp  # Watermelon, local scope
```

Never `git add -f` anything under those paths. `PRODUCT.md` and `DESIGN.md` are the exception:
they are project content, not tooling, and are committed at the root.

**Impeccable** (`pbakaus/impeccable`, installed at project scope in `.claude/skills/impeccable`).
A design vocabulary plus a reviewer and a slop detector. Type `/impeccable` for the command list.

- **Review before you change.** `/impeccable critique <target>` is a scored UX review;
  `/impeccable audit <target>` is the technical pass (a11y, performance, theming, responsive).
  Use a single section as the target — a narrow target beats a whole page.
- **Then steer:** `polish`, `bolder`, `quieter`, `typeset`, `layout`, `animate`, `distill`.
- **One-time setup:** `/impeccable init` writes `PRODUCT.md`, `/impeccable document` writes
  `DESIGN.md`. Run them before the first design task, and keep `DESIGN.md` consistent with the
  `globals.css` tokens — if they disagree, the tokens are right.
- **Detector, no agent needed:** `npx impeccable detect artifacts/portfolio/src`, or point it at a
  running dev server (`npx impeccable detect http://localhost:5173`) for the contrast and tiny-text
  rules, which the source scan cannot run. Exit code `2` means findings.
- **A design-check hook runs on every Edit/Write and at Stop.** It lives in
  `.claude/settings.local.json` (gitignored in `.gitignore`), so it is per-machine. Treat its findings as real
  feedback. To allow something deliberate, use `npx impeccable ignores add-value …` with a
  `--reason`, never a silent suppression.
- `/impeccable live` edits the local checkout. Never use it against the deployed site.
- Impeccable's detector and `DESIGN_UPGRADE.md` agree on the known problems (overused fonts,
  gradient text). Where they disagree, `DESIGN_UPGRADE.md` is the owner's decision; surface the
  conflict instead of resolving it.

**Watermelon UI** (https://ui.watermelon.sh, MIT, 800+ components, blocks, dashboards) — a
shadcn-style registry, connected as the `watermelon` MCP server (local scope, no API key). Use it
for *inspiration and source*: `search`, `get_inspiration`, `get_component`, `compose_page`.

- **Reuse still wins.** Search `src/components/` first. Take from Watermelon only what the site
  does not already have, and adapt it to the existing tokens and motion constants — never paste a
  second copy of something we already have in a different style.
- **Do not run `npx shadcn add …` yet.** `components.json` still points at the dead
  `src/index.css` (`AUDIT_REPORT.md` C10), so shadcn would write tokens into a file the app never
  loads. Resolve C10 first, or hand-port the component.
- **Watermelon components pull in dependencies** (Radix, Motion). Those are dependency changes —
  get approval, and check `catalog:` in `pnpm-workspace.yaml` before adding. The 1-day
  `minimumReleaseAge` still applies.
- Anything ported must meet the same bar as the rest: typecheck, build, `prefers-reduced-motion`,
  visible focus states, and no new `any`.
- The MCP is a third-party remote server; it receives the search queries and component requests
  you send it. Do not put secrets, `.env` values or private content in those calls.

## Keeping docs current

Docs fall behind the code. When a doc and the code disagree, the code is right and the doc is a bug.

- Before acting on a doc that says something is missing, unbuilt, or works a certain way, check the
  code (grep the component, hook or dependency). Status lines go stale fastest.
- When your change makes a doc wrong, fix that doc in the same task — the claim, the status marker,
  and the `Last updated` date.
- When you find a doc wrong while doing something else, fix the factual line. If the fix needs a
  judgement call, name it in your final report instead of guessing.
- Doc edits stay unstaged for review unless the request covers them (see Git).

## Traps

- **`artifacts/portfolio/src/index.css` is dead code.** `main.tsx` imports `globals.css` only;
  nothing imports `index.css`. But `components.json` still points shadcn at `index.css`, so a
  `shadcn add` writes tokens into a file the app never loads. Real tokens and styles live in
  `src/globals.css` (`:root` block ~line 652). Edit `globals.css`.
- **`index.css` references `tw-animate-css`, which is not a declared dependency of `portfolio`.**
  It builds only because the file is unused. Do not revive `index.css` without declaring the package.
- **Design tokens are raw HSL triplets** (`--background: 11 6% 6%`), consumed as
  `hsl(var(--background))` in the `@theme inline` block. Write new tokens the same way — a bare
  hex or `hsl(...)` value breaks the Tailwind v4 mapping.
- The identity is **warm obsidian + burnt orange** (`--primary: 11 81% 57%`). Keep it. Do not drift
  toward the default purple/blue AI-gradient look; `DESIGN_UPGRADE.md` §9 explains why.
- **One RAF loop only.** Lenis drives the single `requestAnimationFrame` loop. Components that
  previously ran their own (Navbar, Contact) were deliberately changed to delegate to it. Adding a
  competing RAF loop re-breaks scroll smoothness, which took real work to fix.
- **The 3D hero pauses when scrolled off-screen** on purpose. Do not remove that guard.
- **`main.tsx` runs a `MutationObserver` on the whole body for `.text-reveal*` classes that no
  component applies.** It is dead weight that fires on every DOM mutation, not a mechanism to build
  on (`AUDIT_REPORT.md` C8). Do not wire new work into it without deciding its fate first.
- **`glow-primary`, `mask-up` and `rule-divider` in `globals.css` are unused.** The other custom
  classes there (`gold-text`, `hover-lift`, `premium-card*`, `glow-hover`, `premium-gradient-text`)
  are live — check before deleting anything in that file.
- **No code splitting yet** — `three`, `gsap` and `framer-motion` all ship in one ~1.6MB chunk.
  That is a known open item tied to the hero rework (`DESIGN_UPGRADE.md` §6); do not fix it as a
  drive-by, it touches the same code.
- **Desktop-only navigation is intentional.** A mobile hamburger menu was built and explicitly
  reverted by the user. Do not re-add it unprompted.
- **`BackToTop` and `CustomCursor` are unused on purpose** — staged for `DESIGN_UPGRADE.md` §5, not
  dead code. Do not delete them in a cleanup sweep.
- **Fonts are loaded three times over**: `index.html` (Inter), `globals.css` (Plus Jakarta Sans,
  Outfit, Inter), `index.css` (Orbitron, Space Grotesk). Only the `globals.css` and `index.html`
  imports actually reach users. Touch this only as part of the planned type cleanup.
- **`VITE_WEB3FORMS_KEY`** drives the contact form and is set in Cloudflare, not in the repo.
  `.env*` is gitignored; `.env.example` documents it. Never commit a real key. Note that Web3Forms
  delivery is currently unreliable and a replacement decision is pending (`AUDIT_REPORT.md` item 3).
- **SPA routing is Cloudflare's job**, via `not_found_handling: "single-page-application"` in
  `artifacts/portfolio/wrangler.jsonc`. A `_redirects` file conflicts with it and was removed —
  do not add one back.
- **Hash-scroll navigation in `Home.tsx` / `ProjectDetail.tsx` is hand-rolled** and known to be
  so. Leave it unless the task is about navigation.
- Two icon libraries (`lucide-react` + `react-icons`) coexist knowingly. Not a bug to fix.

## Reuse before you write. No duplicates.

This is the rule the codebase is judged on. The repo has already paid for ignoring it — see
Track C in `AUDIT_REPORT.md`, where the same section shell is copy-pasted five times and the same
easing curve is typed out in four files.

- **Search first, always.** Before writing a component, hook, helper, type, constant or utility
  class string, grep for one that already exists — `src/components/ui/`, `src/components/layout/`,
  `src/hooks/`, `src/lib/`. If something close exists, extend it; do not fork it.
- **Compose shadcn primitives. Never reimplement one.** Same for Framer Motion, Lenis, GSAP — use
  the library's mechanism rather than hand-rolling a second one beside it.
- **The second occurrence is the warning; the third is a bug.** Writing the same markup, the same
  class list, the same animation config or the same guard a second time means stopping and
  extracting it. Do not let a pattern reach three copies.
- **Shared values live in one place.** Easings, durations and viewport margins belong in a motion
  module, not inline. Design values belong in the `globals.css` tokens, not as literal hex or HSL
  in a component. Content fallbacks belong next to their query, not re-written per section.
- **A near-copy is worse than a duplicate**, because it looks intentional. If you must branch an
  existing thing, add a prop to the original instead of pasting a variant beside it.
- **Reuse across packages is a workspace package, not a copy-paste.** `portfolio` and
  `mockup-sandbox` already share six byte-identical files — do not add a seventh. If both genuinely
  need it, say so and propose `lib/ui`; never paste.
- **Deleting a duplicate is in scope when you are already editing it.** Finding one elsewhere is
  not — note it in `AUDIT_REPORT.md` and keep your diff clean.
- **Never leave dead code behind.** If a change orphans a component, class, CSS rule or
  dependency, remove it in the same commit. Unused-on-purpose things are listed in Traps; anything
  not listed there is dead.
- `any` is not reuse-neutral — it hides the type that already exists. The Sanity interfaces in
  `sanityQueries.ts` are the source of truth for content shapes; wire props to them.

## Working rules

- Keep the diff to what was asked. No drive-by refactors, no reformatting adjacent code, no
  renaming things that were not in scope.
- **No new dependency without approval.** Prefer plain `fetch` and what is already installed —
  the Sanity integration is deliberately SDK-free for exactly this reason. When a package genuinely
  is needed, check the root `catalog:` in `pnpm-workspace.yaml` first and use `catalog:` if the
  version is already pinned there.
- **Never lower `minimumReleaseAge` in `pnpm-workspace.yaml`.** It is a 1-day supply-chain guard.
  If a package is blocked, say so and let the user decide — do not add to `minimumReleaseAgeExclude`
  on your own.
- A dependency declared nowhere but resolving through a transitive install is a bug, not a
  shortcut — it broke CI once already. Declare what you import.
- No new top-level folders.
- Every change gets typechecked and built before you call it done. Run both, paste what matters.
  Changes that are visual by nature also need the user to look — say what to check and where.
- Bug fixes: reproduce first, then fix in the shared path every caller goes through, not only on
  the reported surface.
- Accessibility is not optional on this site: respect `prefers-reduced-motion`, keep focus states
  visible, and keep text contrast above the floor (`DESIGN_UPGRADE.md` §6).
- Work in the current checkout and branch. Do not create git worktrees unless asked.

## Git

- **Never add a `Co-Authored-By` trailer, a "Generated with" footer, or any other AI attribution**
  to a commit message or PR body. Commits are authored by the person running the work.
- Commit messages are plain, sentence-case, and describe the change in the user's own register —
  match the existing log (`Remove unused UI components and orphaned dependencies, clean up docs`).
- **Keep commits simple and short.** One line naming the change is enough; add a short body only
  when the one-liner needs it, not by default. Never reference a plan's phase, task or step number
  in a commit message — a commit describes what changed, not where it sat in a work breakdown.
- Commit only what was asked for. Documentation changes are held back for review unless the request
  covers them.
- Pushing to `main` triggers CI and a Cloudflare Pages deploy to the live domain. Do not push
  unless asked, and never push a change you have not typechecked and built.
- `dist/`, `node_modules/`, `.env*` and `*.tsbuildinfo` are gitignored at the root; `studio/` has
  its own `.gitignore`. Never commit build output or a lockfile for a package manager this repo
  does not use — the root `preinstall` deletes stray `package-lock.json` / `yarn.lock` on sight.

## Model and effort

Use the smallest model and lowest effort that can do the task. Move up only on evidence — a failed
attempt, a reviewer finding — or when the task is genuinely design-heavy or risky.

- Searching, reading code, mechanical edits whose exact content is already decided → Haiku.
- Component work, small integration fixes, diff review → Sonnet.
- Opus is for design direction, the hero/3D work, bundle architecture, debugging a smaller model
  already failed at, and the final review of a branch.
- When dispatching a subagent, say which model you picked and why. If the main session is doing
  mechanical work on a large model, suggest `/model` or `/effort`.
