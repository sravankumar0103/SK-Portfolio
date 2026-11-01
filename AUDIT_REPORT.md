# SK-Portfolio — Audit Report (living document)

**Last updated:** 2026-11-02
**Purpose:** Originally a pre-migration audit (Vercel → self-hosted). The migration is now complete and live on `sravankumar.online` via Cloudflare Pages. This file now tracks remaining code-quality/cleanliness items only. Paired with `DESIGN_UPGRADE.md` (visual/UX redesign spec) — together these are the only two tracking docs in this repo.

**Scope:** Whole monorepo — `artifacts/portfolio` (live site), `artifacts/api-server` + `lib/db` + `lib/api-spec` + `lib/api-client-react` (dormant backend), `studio` (Sanity CMS), `scripts/`, root tooling.

**Priority key:** 🔴 **MUST FIX** · 🟡 **SHOULD FIX** · ⚪ **SKIP / not actionable**

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

---

## 🟡 Open items — Track A (live site)

1. 🟡 **Single ~1.6MB JS bundle, no code splitting.** `three`, `@react-three/fiber`, `@react-three/drei`, `gsap`, `framer-motion` all ship in one entry chunk. Addressed in `DESIGN_UPGRADE.md` §6 (route-level + Canvas-level `lazy()`, `manualChunks`, `LazyMotion`) — do this *during* the design upgrade work, not separately, since the hero rework touches the same code.

2. ⚪ **`BackToTop` and `CustomCursor` are built but never wired up.** Not dead code — intentional unused-for-now components. `DESIGN_UPGRADE.md` §5 plans to activate both.

3. 🟡 **Web3Forms emails not reliably arriving.** Confirmed: Web3Forms dashboard shows all submissions as "Delivered", but they don't appear in Gmail inbox *or* spam, on any search. Likely a deliverability problem with Web3Forms' free-tier sending domain, not a config error on this end (API key, recipient email, and spam-filter settings all verified correct). **Decision pending:** swap to EmailJS (sends via your own Gmail, zero backend changes) or Resend (best deliverability, but needs a small server-side proxy since the repo is a static SPA). Not implemented — waiting on a choice.

4. ⚪ **`Tableau` listed in Skills but not on the resume.** Confirmed still present in the live Sanity content. Harmless either way — flagging only because it was raised and not resolved (keep or remove is your call).

### Already-known, still intentionally skipped (no change)
- `not-found.tsx` light-theme/dev-copy inconsistency
- Two icon libraries (`lucide-react` + `react-icons`)
- Hand-rolled hash-scroll navigation in `Home.tsx`/`ProjectDetail.tsx`
- Live (non-CDN) Sanity endpoint — fine at current traffic

---

## Duplicate files — `portfolio` vs `mockup-sandbox`

⚪ **SKIP for now** — `mockup-sandbox` isn't deployed; this only matters for long-term maintainability, not correctness.

**Shrank from 51 to 5 byte-identical files** as a side effect of the 2026-11-02 unused-component cleanup above — portfolio no longer has 46 of the files that used to be duplicated, because they no longer exist on that side at all. Remaining: `lib/utils.ts`, `components/ui/card.tsx`, `toast.tsx`, `toaster.tsx`, `tooltip.tsx`. **1 near-duplicate** (diverged): `hooks/use-toast.ts`.
**Fix (later):** extract the remaining 5 into a shared `lib/ui` workspace package. No internal duplication exists within `portfolio`, `lib/`, or `studio` individually.

---

## Track B — Dormant backend (unchanged, still fully skipped)

`artifacts/api-server`, `lib/db`, `lib/api-spec`, `lib/api-client-react` — **not used by the live site.** Scaffold-stage: one route (`GET /api/healthz`), empty DB schema, generated clients matching that single endpoint.

Everything in this track only matters if this stack is ever activated for real use:
- No Dockerfile, CI/CD, or deployment config of any kind in the repo
- No versioned DB migrations (`drizzle-kit push`/`push-force` only, no rollback path)
- No auth, rate limiting, or security headers (`cors()` wide open)
- No global error handler or crash handling
- Env vars undocumented in-repo

No hardcoded credentials anywhere, TypeScript configs consistent, API spec matches the implemented route.

---

## Repo hygiene

- ✅ **Replit traces fully removed** (2026-11-02): deleted `.replit-artifact/` folders from `artifacts/api-server`, `artifacts/portfolio`, and `artifacts/mockup-sandbox` (all three were tracked in git), plus the dead `# Replit` section in root `.gitignore`.
- ✅ **Dead template cruft removed from `.gitignore`**: `.expo`/`.expo-shared` entries (Expo/React Native — never used in this web-only project) and `.cursor/rules/nx-rules.mdc` / `.github/instructions/nx.instructions.md` (Nx monorepo tool — this repo uses pnpm workspaces, not Nx; neither path ever existed on disk).
- ⚪ **`studio/` intentionally outside the pnpm workspace**, own npm lockfile, pins React 18 vs. the rest of the repo's React 19 — correct as a standalone deploy target, not an oversight.

---

*Living document — update as items are resolved or new findings surface.*
