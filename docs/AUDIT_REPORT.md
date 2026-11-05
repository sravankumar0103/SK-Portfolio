# SK-Portfolio — Audit Report (living document)

**Last updated:** 2026-11-06
**Purpose:** Originally a pre-migration audit (Vercel → self-hosted). The migration is now complete and live on `sravankumar.online` via Cloudflare Pages. This file now tracks remaining code-quality/cleanliness items only. Paired with `docs/specs/DESIGN_UPGRADE.md` (visual/UX redesign spec). This is the only backlog in the repo; implementation plans live in `docs/plans/`.

**Scope:** Whole monorepo — `artifacts/portfolio` (live site), `artifacts/api-server` + `lib/db` + `lib/api-spec` + `lib/api-client-react` (dormant backend), `studio` (Sanity CMS), `artifacts/mockup-sandbox` (scratch), `scripts/`, root tooling.

**Priority key:** 🔴 **MUST FIX** · 🟡 **SHOULD FIX** · ⚪ **SKIP / not actionable**

**Build state, verified 2026-11-05:** `pnpm run typecheck` clean across all 4 typechecked packages · `pnpm --filter portfolio run build` clean · JS `1,603.55 kB` (gzip 470.06 kB), CSS `75.37 kB` (gzip 12.84 kB), 2771 modules.

---

## ✅ Resolved since the original audit (2026-10-04)

All verified fixed, live, and working:
- SPA routing on the new host (`wrangler.jsonc`, `not_found_handling: "single-page-application"`)
- 12MB `logo.png` → proper multi-size favicon set (~188KB total)
- SEO: meta description, OG/Twitter tags, `robots.txt`, `sitemap.xml` (all pointing at `sravankumar.online`)
- Web3Forms key moved to `VITE_WEB3FORMS_KEY` env var, set in Cloudflare
- `.env*` added to `.gitignore`
- Error boundary added, wraps the app
- 6 unused heavy dependencies removed (`recharts`, `input-otp`, `vaul`, `cmdk`, `react-day-picker`, `react-resizable-panels`) + their wrapper files
- Phantom dependency bug fixed (`embla-carousel` now declared explicitly, was silently relying on a transitive install — this is what broke CI initially)
- Viewport pinch-zoom re-enabled
- Scroll smoothness: `syncTouch` enabled on Lenis, 2 competing `requestAnimationFrame` loops removed (Navbar/Contact now delegate to the single Lenis RAF), 3D hero pauses when scrolled off-screen
- Mixed lockfiles: stray `artifacts/portfolio/package-lock.json` removed (pnpm-only now)
- CI/CD added (`.github/workflows/ci.yml`) — typecheck + build on every push
- `vercel.json` removed, Vercel GitHub integration uninstalled/restricted
- Contact form now shows inline validation errors instead of silently blocking submission
- Mobile hamburger menu: built, then explicitly reverted per user decision — desktop-only nav is intentional, not a gap
- **46 unused UI components + 26 orphaned npm packages removed** (2026-11-02): full transitive dependency analysis found only 10 of 56 `components/ui/` files were actually reachable from app code. Deleted the 44 dead component files (kept `BackToTop`/`CustomCursor` — unused-for-now, not dead, see `DESIGN_UPGRADE.md`) plus the orphaned `hooks/use-mobile.tsx`, 25 `@radix-ui/*` packages, and the `sonner` package. Verified: typecheck clean, full build clean, zero stray references. Side effect: CSS bundle dropped from 124.76KB → 75.37KB (JS size unchanged — this was dead code tree-shaking already excluded, confirming zero behavior change).
- **`CLAUDE.md` added** (2026-11-05): agent rule set covering stack, commands, Sanity content model, traps, reuse policy, git and model selection.
- **Design tooling installed** (2026-11-05): Impeccable v0.1.18 (project scope, `.claude/skills/impeccable`, 4 agents, design-check hook) and the Watermelon UI MCP server (local scope). First `impeccable detect artifacts/portfolio/src` scan: 5 findings — `overused-font` ×3 (Plus Jakarta Sans in `globals.css` lines 1 and 779; Space Grotesk in the dead `index.css`) and `gradient-text` ×2 (`globals.css` lines 806, 823). That is a source-only scan; contrast and tiny-text rules need a rendered page, so treat it as an undercount. All five already map to `DESIGN_UPGRADE.md` §1 and Track C (C10, C11).
- **Docs moved into `docs/`** (2026-11-06): this file is now `docs/AUDIT_REPORT.md`, the design spec `docs/specs/DESIGN_UPGRADE.md`, plans go in `docs/plans/`. Only `CLAUDE.md`, `README.md` and `WORKSPACE_GUIDE.md` stay at the root (rule in `CLAUDE.md` → Where to look).
- **Local Claude tooling gitignored** (2026-11-06): the Impeccable skill and agents, `.impeccable/`, `.claude/settings.local.json` and `.mcp.json` are now in `.gitignore` (previously `settings.local.json` was ignored only by the owner's global git config). Reinstall commands are in `CLAUDE.md` → Design tooling.

---

## 🟡 Open items — Track A (live site, behaviour)

1. 🟡 **Single ~1.6MB JS bundle, no code splitting.** `three`, `@react-three/fiber`, `@react-three/drei`, `gsap`, `framer-motion` all ship in one entry chunk (`1,603.55 kB`, gzip `470.06 kB`). Vite emits the >500kB warning on every build. Addressed in `DESIGN_UPGRADE.md` §6 (route-level + Canvas-level `lazy()`, `manualChunks`, `LazyMotion`) — do this *during* the design upgrade work, not separately, since the hero rework touches the same code.

2. ⚪ **`BackToTop` and `CustomCursor` are built but never wired up.** Not dead code — intentional unused-for-now components. `DESIGN_UPGRADE.md` §5 plans to activate both.

3. 🟡 **Web3Forms emails not reliably arriving.** Confirmed: Web3Forms dashboard shows all submissions as "Delivered", but they don't appear in Gmail inbox *or* spam, on any search. Likely a deliverability problem with Web3Forms' free-tier sending domain, not a config error on this end (API key, recipient email, and spam-filter settings all verified correct). **Decision pending:** swap to EmailJS (sends via your own Gmail, zero backend changes) or Resend (best deliverability, but needs a small server-side proxy since the repo is a static SPA). Not implemented — waiting on a choice.

4. ⚪ **`Tableau` listed in Skills but not on the resume.** Confirmed still present in the live Sanity content. Harmless either way — flagging only because it was raised and not resolved (keep or remove is your call).

### Already-known, still intentionally skipped (no change)
- `not-found.tsx` light-theme/dev-copy inconsistency
- Two icon libraries (`lucide-react` + `react-icons`)
- Hand-rolled hash-scroll navigation in `Home.tsx`/`ProjectDetail.tsx` — but see **C7**, the Lenis access inside it is worth consolidating
- Live (non-CDN) Sanity endpoint — fine at current traffic

---

## 🟡 Open items — Track C (code cleanliness & reuse) — **new, 2026-11-05**

Found by a full re-review of `artifacts/portfolio/src` against the reuse rule in `CLAUDE.md`. None of these change behaviour or break the build — they are duplication and dead weight that make every future change cost more than it should. Ordered by payoff.

### C1. 🟡 No `<Section>` wrapper — the section shell is copy-pasted 5×
`py-12 md:py-20 relative` + `container mx-auto px-6 md:px-12` appears verbatim in `About`, `Experience`, `Skills`, `Projects`, `Certifications` (and a variant in `Contact` and `Hero`).

**Why it matters now:** `DESIGN_UPGRADE.md` §1 changes section padding to `clamp(96px, 12vw, 180px)`. With a wrapper that is a one-line edit; today it is a six-file edit with five chances to miss one. `ProjectDetail.tsx` already drifted to its own `max-w-7xl`/`max-w-3xl` container variants — proof the drift has started.

**Fix:** `components/layout/Section.tsx` taking `id`, `children`, optional `className`. Do this *before* the design upgrade, not during.

### C2. 🟡 The Sanity fallback ternary is written out 4×
`const x = data && data.length ? data : fallbackX;` in `Skills`, `Certifications`, `Experience`, `Projects` — four chances to forget the fallback on the next Sanity-backed section, and the fallback is the thing that keeps the site up when Sanity is down.

**Fix:** fold it into the hooks in `sanityQueries.ts` (e.g. the hook takes its fallback and always returns populated data), so a component cannot forget it. Also makes the `CLAUDE.md` rule "add the fallback in the same change" structurally enforced instead of a convention.

### C3. 🟡 Motion constants are duplicated instead of shared
- Easing `[0.22, 1, 0.36, 1]` — 6 occurrences across `Navbar`, `Experience`, `Projects`, `ProjectDetail`. `ProjectDetail` alone does the right thing (`const EASE = [...] as const`) — and that constant is local to the file.
- Viewport `margin: "-30% 0px -30% 0px"` — 8 occurrences across `Certifications`, `Experience`, `Projects`.
- The entry variant `initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:"-100px"}}` — repeated with hand-tweaked durations everywhere.

**Why it matters now:** `DESIGN_UPGRADE.md` §1 calls the current motion "inconsistent across components" and specifies one motion language. That spec is unimplementable as long as the values live inline in ten files.

**Fix:** `lib/motion.ts` exporting the eases, viewport presets and named variants from the §1 table. Then §1 becomes editing one file.

### C4. 🟡 The pill/chip link is copy-pasted 3×
The same 11 utility classes (`flex items-center gap-2 px-2.5 py-1 … rounded-full border border-white/5 hover:border-primary/20 …`) build the "View" chip in `Certifications` and both the "Code" and "Live" chips in `Projects` — with the class order shuffled between them, so they are already quietly diverging.

**Fix:** one `components/ui/PillLink.tsx` (label + icon + href). ~25 lines saved, and the hover treatment stays identical by construction.

### C5. 🟡 `(window as any).__lenis` appears 6× in 4 files, untyped
`SmoothScroll` (set + clear), `Navbar`, `Home`, `ProjectDetail`, `Contact`. Every reader re-does the `as any` cast and the `if (lenis) … else window.scrollTo(…)` fallback by hand.

**Fix:** `lib/lenis.ts` with a `declare global` typing for `window.__lenis` and one `scrollToTarget()` / `scrollToTop()` helper carrying the native fallback. Removes 4 of the repo's 11 `any`s and makes the single-RAF-loop rule harder to violate by accident.

### C6. 🟡 11 `any` types in a `strict: true` codebase
`ExperienceItem({ data: any })`, `ProjectRow({ project: any })`, `PortableBody({ value: any[] })`, `Character({ progress: any })`, `SanityProjectDetail.body?: any[]`, plus the 4 Lenis casts (C5).

The Sanity interfaces already exist in `sanityQueries.ts` — the component props simply aren't wired to them, so a GROQ projection can drop a field and nothing fails until it renders blank. `body`/`progress` need real types (`PortableTextBlock`, `MotionValue<number>`).

### C7. 🟡 Three near-identical "scroll somewhere with Lenis" blocks
`Home.tsx` (hash jump with ResizeObserver + 7 timers), `ProjectDetail.tsx` (to-top with 3 timers), `Navbar.tsx` (`handleClick`). Each re-implements Lenis-or-native branching and its own re-assert schedule. Subsumed by the C5 helper; the retry schedules could share one `reassert(fn, delays)` utility.

### C8. 🟡 `main.tsx` runs a permanent observer for classes nothing uses
`main.tsx` installs a `MutationObserver` on `document.body` with `{childList: true, subtree: true}` that re-queries the DOM for `.text-reveal`, `.text-reveal-muted`, `.text-reveal-reference`, `.text-reveal-word` on **every DOM mutation** — and **no component applies any of those four classes.** Verified: the only references in the whole repo are the selector string in `main.tsx` itself and the CSS rules in `globals.css`.

This is live cost on a heavily-animated page for zero effect. Either wire the classes up (they appear to belong to the §1 scroll-reveal work) or delete the observer block and the CSS rules together. **Decide before the design upgrade**, since `DESIGN_UPGRADE.md` may want this mechanism back.

### C9. 🟡 Dead CSS in `globals.css`
`glow-primary`, `mask-up`, `rule-divider` are defined and used nowhere. Plus the 4 `text-reveal*` rules from C8. (`glow-hover`, `gold-text`, `hover-lift`, `premium-card`, `premium-card-hover`, `premium-gradient-text` are all genuinely used — leave them.)

### C10. 🟡 `src/index.css` is dead, and it imports an undeclared package
Nothing imports `src/index.css` — `main.tsx` loads `globals.css` only. Two consequences:
- It imports `tw-animate-css`, which is **not** a declared dependency of `portfolio`. It builds only because the file is unreachable. Reviving the file without declaring the package breaks the build.
- `components.json` still points shadcn at `src/index.css`, so any `shadcn add` writes tokens into a file the app never loads — a silent, confusing failure for whoever runs it next.

**Fix:** delete `index.css` (268 lines) and repoint `components.json` at `src/globals.css`, or merge the two. Either way `components.json` must stop pointing at a dead file.

### C11. ⚪ Fonts are loaded three times over
`index.html` pulls Inter; `globals.css` pulls Plus Jakarta Sans + Outfit + Inter; `index.css` pulls Orbitron + Space Grotesk. Only the first two reach users (C10). `DESIGN_UPGRADE.md` §1 already plans the type cleanup (drop Inter, add a mono) — fold this in there rather than touching it twice.

---

## Duplicate files — `portfolio` vs `mockup-sandbox`

⚪ **SKIP for now** — `mockup-sandbox` isn't deployed; this only matters for long-term maintainability, not correctness.

**Shrank from 51 to 6 duplicated files** as a side effect of the 2026-11-02 unused-component cleanup — portfolio no longer has 45 of the files that used to be duplicated, because they no longer exist on that side at all.

**Correction to the previous entry (verified 2026-11-05):** this was recorded as "5 byte-identical + 1 near-duplicate (diverged)". `hooks/use-toast.ts` has **not** diverged — a `diff` shows the two files differ by exactly one 2-line code comment and nothing else. Treat it as a 6th duplicate.

Current duplicates: `lib/utils.ts`, `components/ui/card.tsx`, `toast.tsx`, `toaster.tsx`, `tooltip.tsx`, `hooks/use-toast.ts`.

**Fix (later):** extract the 6 into a shared `lib/ui` workspace package. No internal file-level duplication exists within `portfolio`, `lib/`, or `studio` individually — the duplication *inside* `portfolio` is at the markup/constant level and is tracked as C1–C7 above.

---

## Track B — Dormant backend (unchanged, still fully skipped)

`artifacts/api-server`, `lib/db`, `lib/api-spec`, `lib/api-client-react` — **not used by the live site.** Re-verified 2026-11-05: still scaffold-stage. One route (`GET /api/healthz`), `lib/db/src/schema/index.ts` is a comment block plus `export {}`, generated clients cover that single endpoint.

Everything in this track only matters if this stack is ever activated for real use:
- No Dockerfile, CI/CD, or deployment config of any kind in the repo
- No versioned DB migrations (`drizzle-kit push`/`push-force` only, no rollback path)
- No auth, rate limiting, or security headers (`cors()` wide open)
- No global error handler or crash handling
- Env vars undocumented in-repo

No hardcoded credentials anywhere, TypeScript configs consistent, API spec matches the implemented route.

**Open question (unanswered since the original audit):** is this stack ever going to be used? If the answer is no, deleting all four packages removes ~5 packages from every `pnpm install` and `pnpm run typecheck`, and removes the only part of the repo where the "is this reachable?" question has a non-obvious answer. If the answer is "maybe", leave it exactly as is — it costs little and a half-deleted scaffold would be worse. Your call; flagging it because the Web3Forms replacement (Track A item 3) is the one thing that might actually need a server.

---

## Repo hygiene

- ✅ **Replit traces fully removed** (2026-11-02): deleted `.replit-artifact/` folders from `artifacts/api-server`, `artifacts/portfolio`, and `artifacts/mockup-sandbox` (all three were tracked in git), plus the dead `# Replit` section in root `.gitignore`.
- ✅ **Dead template cruft removed from `.gitignore`**: `.expo`/`.expo-shared` entries (Expo/React Native — never used in this web-only project) and `.cursor/rules/nx-rules.mdc` / `.github/instructions/nx.instructions.md` (Nx monorepo tool — this repo uses pnpm workspaces, not Nx; neither path ever existed on disk).
- ⚪ **`studio/` intentionally outside the pnpm workspace**, own npm lockfile, pins React 18 vs. the rest of the repo's React 19 — correct as a standalone deploy target, not an oversight.
- ⚪ **`pnpm-workspace.yaml` catalog is partly stale**: it still carries a `react: 19.1.0` pin commented "Must be this exact version because expo requires it", and a `lib/integrations/*` workspace glob for a directory that does not exist. Harmless, but the Expo comment is misleading — nothing in this repo uses Expo. Fix the comment next time that file is touched.
- ⚪ **`scripts/` contains one `hello.ts`** and is otherwise empty. It is still typechecked by CI. Leave it or delete it; no impact either way.
- ⚪ **`.claude/settings.local.json` has accumulated ~45 one-off permission entries**, several of them hyper-specific (an exact `git commit -m` message, a `TMPDIR=/d/tmp` build invocation). Harmless, but it is now easier to re-approve than to read. Worth pruning to the broad rules (`Bash(pnpm run *)`, `Bash(git *)`) if it ever gets in the way.

---

## Suggested order of work

Only if and when you want to spend time here — nothing below is urgent, and nothing below changes what a visitor sees.

1. **C10 + C9 + C8** — pure deletion, zero risk, removes a live perf cost and a config landmine. Half an hour.
2. **C5 + C6** — type the Lenis access and the component props. Small, mechanical, kills 11 `any`s.
3. **C1 + C3** — the `Section` wrapper and `lib/motion.ts`. Do these **before** starting `DESIGN_UPGRADE.md`, because §1 edits exactly the values they centralise.
4. **C2 + C4 + C7** — fold-ins that get cheaper once 1–3 are done.
5. **Track A item 1** (code splitting) — during the hero rework, per §6.
6. Everything else stays parked.

---

*Living document — update as items are resolved or new findings surface.*
