# SK-Portfolio — Audit Report (living document)

**Last updated:** 2026-11-06
**Purpose:** Originally a pre-migration audit (Vercel → self-hosted). The migration is now complete and live on `sravankumar.online` via Cloudflare Pages. This file now tracks remaining code-quality/cleanliness items only. Paired with `docs/specs/DESIGN_UPGRADE.md` (visual/UX redesign spec). This is the only backlog in the repo; implementation plans live in `docs/plans/`.

**Scope:** Whole monorepo — `artifacts/portfolio` (live site), `artifacts/api-server` + `lib/db` + `lib/api-spec` + `lib/api-client-react` (dormant backend), `studio` (Sanity CMS), `artifacts/mockup-sandbox` (scratch), `scripts/`, root tooling.

**Priority key:** 🔴 **MUST FIX** · 🟡 **SHOULD FIX** · ⚪ **SKIP / not actionable**

**Build state, verified 2026-11-06 on `reuse-cleanup` (HEAD `9425b85`):** `pnpm run typecheck` clean · `pnpm --filter portfolio run build` clean · JS `1,567.43 kB` (baseline `1,603.55 kB`), CSS `72.65 kB` (baseline `75.37 kB`) · `pnpm run check:reuse`: 21 rules, 0 violations · `pnpm --filter @workspace/scripts run test`: 9/9 · `npx impeccable detect artifacts/portfolio/src`: 4 findings (was 5 — the Space Grotesk one went with `index.css`) · Lighthouse accessibility (desktop) 90 → 94 · Impeccable audit score **11/20** (6 Nov, before the Task 11 fixes; see Track D). The rendered `impeccable detect <url>` scan now times out in this environment (against the live site as well), so only the source scan and Lighthouse's contrast audit were available.

**Guard:** `pnpm run check:reuse` (CI) keeps Track C closed; add a rule when you remove a duplicate.

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
- **Design tooling installed** (2026-11-05): Impeccable v0.1.18 (project scope, `.claude/skills/impeccable`, 4 agents, design-check hook) and the Watermelon UI MCP server (installed at local scope, moved to **user scope** on 2026-11-06 — the IDE opens the repo as lowercase `d:\` while local-scope servers key on `D:/`, so a local-scope server silently failed to load). First `impeccable detect artifacts/portfolio/src` scan: 5 findings — `overused-font` ×3 (Plus Jakarta Sans in `globals.css` lines 1 and 779; Space Grotesk in the dead `index.css`) and `gradient-text` ×2 (`globals.css` lines 806, 823). That is a source-only scan; contrast and tiny-text rules need a rendered page, so treat it as an undercount. All five already map to `DESIGN_UPGRADE.md` §1 and Track C (C10, C11). As of 2026-11-06 four remain: `overused-font` ×2 (`globals.css` lines 1 and 709) and `gradient-text` ×2 (lines 736, 753); the Space Grotesk one went with `index.css`.
- **Docs moved into `docs/`** (2026-11-06): this file is now `docs/AUDIT_REPORT.md`, the design spec `docs/specs/DESIGN_UPGRADE.md`, plans go in `docs/plans/`. Only `CLAUDE.md`, `README.md` and `WORKSPACE_GUIDE.md` stay at the root (rule in `CLAUDE.md` → Where to look).
- **Local Claude tooling gitignored** (2026-11-06): the Impeccable skill and agents, `.impeccable/`, `.claude/settings.local.json` and `.mcp.json` are now in `.gitignore` (previously `settings.local.json` was ignored only by the owner's global git config). Reinstall commands are in `CLAUDE.md` → Design tooling.
- **Chrome DevTools MCP added** (2026-11-06): `chrome-devtools-mcp@1.12.0`, user scope, headless, isolated profile, telemetry and CrUX off. Agents use it for browser checks against `vite preview` on `127.0.0.1:4173`. Reinstall command in `CLAUDE.md` → Design tooling.

### Reuse cleanup — branch `reuse-cleanup` (2026-11-06)

10 commits on `main` @ `cb14209`, HEAD `9425b85`, from `docs/plans/2026-11-05-reuse-cleanup.md`. Verified fixed unless marked partial. Details of each finding are no longer repeated here; the code and `pnpm run check:reuse` are the record.

- **C1** (2026-11-06): `components/layout/Section.tsx` (`Section`, `CONTAINER`) wraps About, Experience, Skills, Projects and Certifications; `PageShell.tsx` is the shared page shell for `Home` and `ProjectDetail`. Section padding is now one edit.
- **C2** (2026-11-06): the four list hooks in `sanityQueries.ts` apply their own fallback through `orFallback` and return `T[]`, never `undefined`. Fallbacks live in `lib/fallbackContent.ts` and `lib/projectsData.ts`.
- **C3, in part** (2026-11-06): easing (`EASE_OUT_QUINT`, `EASE_OUT_EXPO`), viewport margin (`VIEWPORT_CENTER_MARGIN`), the row and chip presets and the reveal colours are in `lib/motion.ts`, `hooks/use-row-in-view.ts` and `globals.css` tokens. **The entry-variant bullet stays open** — see Track C.
- **C4** (2026-11-06): `components/ui/PillLink.tsx` replaces the three copy-pasted chip links.
- **C5** (2026-11-06): `lib/lenis.ts` owns the Lenis instance (`setLenis`, private getter), `scrollToY`, `scrollToElement` and `scrollEasing`; `window.__lenis` is gone and both branches honour `scroll-margin-top`.
- **C6** (2026-11-06): all 11 `any` removed from `artifacts/portfolio/src`, props wired to the Sanity interfaces (`PortableTextBlock`, `MotionValue<number>`).
- **C7** (2026-11-06): Home hash-jump, ProjectDetail to-top and Navbar clicks route through `lib/lenis.ts`; the retry schedules share `reassert`.
- **C8** (2026-11-06): the `main.tsx` `MutationObserver` and the `.text-reveal*` CSS are deleted.
- **C9** (2026-11-06): `glow-primary`, `mask-up`, `rule-divider` deleted.
- **C10** (2026-11-06): `src/index.css` deleted; `components.json` points at `src/globals.css`. This also removes the undeclared `tw-animate-css` import and the Space Grotesk `impeccable detect` finding.
- **C12** (2026-11-06): the `.dark { … }` block, `@custom-variant dark`, the two `classList.add('dark')` effects and the 31 unused `--sidebar`/`--chart-*` token lines are removed.
- **C13** (2026-11-06): `date-fns`, `next-themes`, `react-icons` and `@radix-ui/react-tooltip` removed; only `lucide-react` remains. `gsap` and `@gsap/react` are kept on purpose for `DESIGN_UPGRADE.md` §6 (installed, never imported, not in the bundle).
- **C14** (2026-11-06): the hexapod "no code link" and `live === '#'` rules live once, as `codeUrl` / `liveUrl` in `lib/projectsData.ts`.
- **C15** (2026-11-06): one Lenis easing (`scrollEasing` in `lib/lenis.ts`); `BackToTop` scrolls through `scrollToY`, so it will not fight Lenis when wired up.
- **C16** (2026-11-06): colour literals moved to `globals.css` tokens and `lib/motion.ts`; About renders `ScrollRevealText` once.
- **C17** (2026-11-06): `prefers-reduced-motion` handled — `MotionConfig reducedMotion="user"` in `App.tsx`, `SmoothScroll` and the hero scene respect it, `lib/lenis.ts` scrolls natively under it, and `globals.css` has a media query.
- **Unused tooltip removed** (2026-11-06): `TooltipProvider` wrapped the app but nothing rendered a tooltip. `src/components/ui/tooltip.tsx` and `@radix-ui/react-tooltip` are gone.
- **Impeccable audit fixes, C18–C26** (2026-11-06; all shipped):
  - **C18** social icon links now carry an accessible name (`Contact.tsx`).
  - **C19** "Copy email" is a real, keyboard-reachable button (`Contact.tsx`).
  - **C20** a certification without a link renders a `<div>`, not `<a href="#">` (`Certifications.tsx`).
  - **C21** project and company titles no longer fade back to ~1.28:1 (`Projects.tsx`, `Experience.tsx`).
  - **C22** `ScrollRevealText` keeps normal spaces, so titles can wrap on phones.
  - **C23** the hero scroll-hint dot stops blinking (`repeat: 1`).
  - **C24** "Explore work" scrolls through `scrollToElement`, not native `scrollIntoView`.
  - **C25** `RotatingShapes` memoises its material and sphere positions, so the off-screen pause no longer leaks or reshuffles.
  - **C26** the contact form's name and email inputs carry `autocomplete`.
  Lighthouse accessibility (desktop) 90 → 94: `link-name`, `button-name`, `label` and `autocomplete-valid` now pass; `color-contrast` (33 nodes) and `landmark-one-main` are unchanged and sit in Track D.

---

## 🟡 Open items — Track A (live site, behaviour)

1. 🟡 **Single ~1.6MB JS bundle, no code splitting.** `three`, `@react-three/fiber`, `@react-three/drei` and `framer-motion` all ship in one entry chunk (`1,567.43 kB`). `gsap` is installed but not imported, so it does not ship. Vite emits the >500kB warning on every build. Addressed in `DESIGN_UPGRADE.md` §6 (route-level + Canvas-level `lazy()`, `manualChunks`, `LazyMotion`) — do this *during* the design upgrade work, not separately, since the hero rework touches the same code.

2. ⚪ **`BackToTop` and `CustomCursor` are built but never wired up.** Not dead code — intentional unused-for-now components. `DESIGN_UPGRADE.md` §5 plans to activate both.

3. 🟡 **Web3Forms emails not reliably arriving.** Confirmed: Web3Forms dashboard shows all submissions as "Delivered", but they don't appear in Gmail inbox *or* spam, on any search. Likely a deliverability problem with Web3Forms' free-tier sending domain, not a config error on this end (API key, recipient email, and spam-filter settings all verified correct). **Decision pending:** swap to EmailJS (sends via your own Gmail, zero backend changes) or Resend (best deliverability, but needs a small server-side proxy since the repo is a static SPA). Not implemented — waiting on a choice.

4. ⚪ **`Tableau` listed in Skills but not on the resume.** Confirmed still present in the live Sanity content. Harmless either way — flagging only because it was raised and not resolved (keep or remove is your call).

### Already-known, still intentionally skipped (no change)
- `not-found.tsx` light-theme/dev-copy inconsistency
- ~~Two icon libraries~~ — no longer true: `react-icons` was never imported and was removed (C13); only `lucide-react` remains
- Hand-rolled hash-scroll navigation in `Home.tsx`/`ProjectDetail.tsx` — left as is; the Lenis access inside it now goes through `lib/lenis.ts` (C5, C7)
- Live (non-CDN) Sanity endpoint — fine at current traffic

---

## 🟡 Open items — Track C (code cleanliness & reuse)

Found 2026-11-05 by a full re-review of `artifacts/portfolio/src` against the reuse rule in `CLAUDE.md`. C1, C2, C4–C10 and C12–C17 were fixed on `reuse-cleanup` and are logged under **Resolved** above. Two items remain open. `pnpm run check:reuse` (CI) keeps the closed ones closed; add a rule when you remove a duplicate.

### C3 (remainder). 🟡 The entry variant is still duplicated
The easing, viewport margin and reveal colours moved to `lib/motion.ts` and `globals.css` (resolved above). What is left is the entry variant `initial={{ opacity: 0, y: 20 }}` `whileInView={{ opacity: 1, y: 0 }}` `viewport={{ once: true, margin: '-100px' }}`: `initial={{ opacity: 0, y: 20 }}` appears 9× and `-100px` 4× (About ×2, SectionHeading ×2), with hand-tweaked durations and delays per site, so one preset would change timings. `DESIGN_UPGRADE.md` §1 redefines this variant, so build the preset there, in `lib/motion.ts`. No guard rule covers it.

### C11. ⚪ Fonts are loaded twice
`index.html` pulls Inter; `globals.css` pulls Plus Jakarta Sans + Outfit + Inter. (`index.css`, which pulled Orbitron + Space Grotesk, was deleted under C10.) `DESIGN_UPGRADE.md` §1 already plans the type cleanup (drop Inter, add a mono) — fold this in there rather than touching it twice. Two `impeccable detect` `overused-font` findings (`globals.css` lines 1 and 709) belong here.

---

## 🟡 Open items — Track D (UI audit, 6 Nov 2026)

From `/impeccable audit artifacts/portfolio/src` — the technical pass (accessibility, performance, theming, responsive, implementation integrity). It was source-level only (no rendered page), so contrast figures are token arithmetic and the tiny-text and overflow findings are estimates; the Lighthouse run after the fixes (desktop accessibility 94) still reports `color-contrast` on 33 nodes and `landmark-one-main`. Score **11/20 (Acceptable)**: Accessibility 2/4, Performance 2/4, Theming 2/4, Responsive 3/4, Implementation integrity 2/4. The bugs were fixed as C18–C26 (Resolved above). The rest was left for a later pass because each item is a visible design change `DESIGN_UPGRADE.md` already owns, too wide to do safely in a cleanup branch, or inside code `CLAUDE.md` fences off. Most of them belong with `DESIGN_UPGRADE.md` §1/§6.

- 🟡 **Muted text contrast** (P1) — `globals.css`. `--muted-foreground: 0 0% 48%` is 4.49:1, just under AA; stacked `opacity-*` variants fall to 1.8–2.8:1 and the form labels sit at ~2.3:1. `DESIGN_UPGRADE.md` §1 already targets `0 0% 60%`. A site-wide visible change.
- 🟡 **9–10px text in 17 places** (P1/P2) — across `components/`. §1 already proposes an 11px metadata floor.
- 🟡 **No designed focus states** (P2) — site-wide. Zero `focus-visible:` classes; the `--ring` token is unused.
- 🟡 **Form errors not tied to their fields** (P2) — `Contact.tsx`. No `aria-invalid`, `aria-describedby` or `required`; errors are 10px `text-red-400`.
- 🟡 **No `<main>` landmark or skip link; footer inside a section** (P2) — `Home.tsx` / `PageShell.tsx` / `Contact.tsx`. This is Lighthouse's `landmark-one-main`.
- 🟡 **Nav clicks and route changes do not move focus; no `aria-current`** (P2) — `Navbar.tsx`, `Home.tsx`, `ProjectDetail.tsx`. The hash-scroll code is fenced by `CLAUDE.md`, so this needs its own navigation task.
- 🟡 **Per-character spans may be read letter by letter** (P2) — `ScrollRevealText.tsx`. §6 already asks for `sr-only` text with an `aria-hidden` split.
- 🟡 **Scrollbar hidden site-wide** (P2) — `globals.css` (~lines 760–766 when audited).
- 🟡 **`ScrollRevealText` render cost** (P2) — `ScrollRevealText.tsx`. A `transition-colors duration-500` fights the JS-driven colour on every frame; ~240 per-character motion spans.
- 🟡 **Hero HDR loaded from a third-party CDN at runtime** (P2) — `HeroScene.tsx`. `<Environment preset="city">` fetches from `raw.githack.com`; `DESIGN_UPGRADE.md` §6 prefers procedural `Lightformer`.
- 🟡 **Gallery dots 6×6px with no carousel semantics; Code/Live chips ~22px tall** (P2) — `CoverflowGallery.tsx`, `PillLink.tsx` / `Projects.tsx`. Touch targets.
- 🟡 **Token layer bypassed** (P2) — site-wide. 47 raw `white/x` / `black/x` classes stand in for the border and surface tokens; status colours skip `--destructive`; there is no `--success` token.
- ⚪ **P3s** — `transition-all` ×23 and a letter-spacing hover; Navbar's scroll handler bound twice (`Navbar.tsx`); `Magnetic` re-renders on every `mousemove` (`Magnetic.tsx`); a `<div>` inside the hero `<h1>`, the tagline as `<h2>` and the Contact heading an `<h3>` (`Hero.tsx`, `Contact.tsx`); gold `rgba(201,169,110)` and `#080808` fog in the hero (`HeroScene.tsx`); the cover image without dimensions (`ProjectDetail.tsx`); a spinner without `role="status"`. `@types/three` and the other `@types/*` have no import because they are type packages — not a finding.

---

## Duplicate files — `portfolio` vs `mockup-sandbox`

⚪ **SKIP for now** — `mockup-sandbox` isn't deployed; this only matters for long-term maintainability, not correctness.

**Shrank from 51 to 6 duplicated files** as a side effect of the 2026-11-02 unused-component cleanup — portfolio no longer has 45 of the files that used to be duplicated, because they no longer exist on that side at all. **Down to 5 on 2026-11-06:** `components/ui/tooltip.tsx` was deleted from `portfolio` (nothing rendered a tooltip), so that pair is no longer a duplicate.

`hooks/use-toast.ts` has not diverged (verified 2026-11-05): the two copies differ by exactly one 2-line code comment and nothing else, so it counts as a duplicate.

Current duplicates: `lib/utils.ts`, `components/ui/card.tsx`, `toast.tsx`, `toaster.tsx`, `hooks/use-toast.ts`.

**Fix (later):** extract the 5 into a shared `lib/ui` workspace package. No internal file-level duplication exists within `portfolio`, `lib/`, or `studio` individually — the duplication *inside* `portfolio` is at the markup/constant level and was tracked as C1–C7 (now closed; C3's entry variant is the remainder).

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
- ✅ **`pnpm-workspace.yaml` stale Expo comment and `lib/integrations/*` glob removed** (2026-11-06).
- ✅ **`scripts/hello.ts` replaced** (2026-11-06) by the reuse guard: `scripts/src/check-reuse.ts` + `reuse-rules.ts`, run as `pnpm run check:reuse` in CI and covered by `pnpm --filter @workspace/scripts run test`.
- ⚪ **`.claude/settings.local.json` has accumulated ~45 one-off permission entries**, several of them hyper-specific (an exact `git commit -m` message, a `TMPDIR=/d/tmp` build invocation). Harmless, but it is now easier to re-approve than to read. Worth pruning to the broad rules (`Bash(pnpm run *)`, `Bash(git *)`) if it ever gets in the way.

---

## Suggested order of work

Only if and when you want to spend time here — nothing below is urgent.

Track C's cleanup (C1–C10, C12–C17) is done. What is left:

1. **Track A item 1** (code splitting) — during the hero rework, per `DESIGN_UPGRADE.md` §6.
2. **Track D**, folded into the `DESIGN_UPGRADE.md` §1/§6 work it overlaps (contrast, text floor, focus states, landmarks, token layer); the navigation-focus item needs its own task.
3. **C3's entry variant** and **C11** (fonts), also inside `DESIGN_UPGRADE.md` §1.
4. Everything else stays parked.

---

*Living document — update as items are resolved or new findings surface.*
