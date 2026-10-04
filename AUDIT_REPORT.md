# SK-Portfolio — Full System Audit

**Date:** 2026-10-04
**Purpose:** Pre-migration review (Vercel → self-hosted custom domain). Read-only audit — no code was changed. Use this as the punch list before the migration.

**Scope:** Whole monorepo — `artifacts/portfolio` (live site), `artifacts/api-server` + `lib/db` + `lib/api-spec` + `lib/api-client-react` (backend stack), `studio` (Sanity CMS), `scripts/`, root tooling.

**Headline finding:** the live portfolio is a pure Vite SPA that talks directly to Sanity's public read API and to Web3Forms — it does **not** use the API server, database, or generated API client at all. Those packages are a separate, unused/scaffold-stage backend (deployed independently on Replit, not Vercel). Treat this report as two tracks: **Track A — the live site** (what actually needs to be production-hardened before the domain move) and **Track B — the dormant backend** (only relevant if/when you intend to actually use it).

**Priority key:** 🔴 **MUST FIX** (blocking or zero-downside) · 🟡 **SHOULD FIX** (recommended, real value) · ⚪ **SKIP** (not needed now, optional/cosmetic, or not in use)

---

## Track A — Live portfolio site (`artifacts/portfolio`)

### Critical

1. 🔴 **MUST FIX** — **SPA rewrite rule is Vercel-only and must be replicated on the new host.**
   `artifacts/portfolio/vercel.json:6` — `{"source": "/(.*)", "destination": "/index.html"}`. This is what makes client-side routes like `/projects/<slug>` work on direct load/refresh. On nginx/Apache/any static host you need an equivalent (`try_files $uri /index.html;` for nginx, or a catch-all rewrite for Apache/IIS/Caddy). **Without this, every deep link 404s on the new domain.**

### High

2. 🔴 **MUST FIX** — **12MB `logo.png` committed and shipped as-is.**
   `artifacts/portfolio/public/logo.png` is 12,051,484 bytes — used both as the favicon (`index.html:8-9`) and presumably as a nav/hero logo. A favicon/logo should be tens of KB. This bloats every page load and the favicon fetch specifically. Needs resizing/compression (and a proper multi-size favicon set — `.ico`/`.png` 32/180/512).

3. 🟡 **SHOULD FIX** — **Single 1.6MB JS bundle, no code splitting.**
   `three`, `@react-three/fiber`, `@react-three/drei`, `gsap`, `framer-motion`, `recharts`, and several unused shadcn/radix primitives all ship in one bundle on first load. Several of these libraries appear to have zero actual usage outside their own UI wrapper components (see item 10 below) — removing them plus adding route-level `React.lazy()` splitting (at minimum for `ProjectDetail` and the 3D hero) would meaningfully cut initial load time.

4. 🟡 **SHOULD FIX** — **No SEO meta tags at all.**
   `artifacts/portfolio/index.html:4-13` has only `charset`, `viewport`, a static `<title>`, and font preconnects. There is no `<meta name="description">`, no Open Graph (`og:title`, `og:image`, `og:description`), no Twitter card tags, no canonical link. `ProjectDetail.tsx:68-73` sets `document.title` client-side via `useEffect`, which crawlers/link-unfurlers that don't execute JS (most social-media scrapers) will never see — every shared link (LinkedIn, WhatsApp, Twitter/X) will show the same generic preview regardless of which project is shared.

5. 🟡 **SHOULD FIX** — **No `robots.txt` or `sitemap.xml`.**
   `public/` contains only `logo.png`. Both files are missing entirely — worth adding before relying on organic search indexing under the new domain.

### Medium

6. 🟡 **SHOULD FIX** — **Hardcoded third-party API key in source.**
   `artifacts/portfolio/src/components/sections/Contact.tsx:92` — Web3Forms `access_key: "5efdf489-27ba-41bd-baec-f7e6bebc647a"` is a literal string in the shipped bundle. Web3Forms keys are designed to be client-visible, but it should still be (a) sourced from `import.meta.env.VITE_WEB3FORMS_KEY` rather than hardcoded, and (b) domain-restricted in the Web3Forms dashboard to the new domain once you move off `vercel.app`, so the old key can't be reused elsewhere.

7. 🔴 **MUST FIX** — **`.gitignore` has no `.env` entry.**
   No `.env*` pattern exists anywhere in the root `.gitignore`. No `.env` file is currently tracked or present, but there is nothing stopping one from being committed by accident — especially relevant once you're managing real server secrets for self-hosting. Add `.env`, `.env.local`, `.env.*.local` now, before they're needed.

8. 🟡 **SHOULD FIX** — **No error boundary anywhere in the app.**
   `App.tsx` has no `ErrorBoundary`/`componentDidCatch` wrapping the router. Network/fetch failures from Sanity already fail safe (falls back to hardcoded data in `projectsData.ts`), but a render-time exception anywhere in the tree would white-screen the entire site with no fallback UI.

9. ⚪ **DECLINED (by user)** — **Desktop-only navigation, no mobile menu.**
   `src/components/layout/Navbar.tsx:112` — nav links are `hidden md:flex`, no mobile menu. A mobile hamburger menu was built and then explicitly removed per user decision — mobile visitors scroll to navigate, no nav menu on mobile. Intentional, not a gap.

10. 🟡 **SHOULD FIX** — **Unused heavy dependencies inflating the bundle.**
    No app-level imports found (outside their own `src/components/ui/*` wrapper files) for: `recharts`, `input-otp`, `vaul`, `cmdk`, `react-day-picker`, `react-resizable-panels`, and most of `embla-carousel-react` beyond the one gallery that uses it directly. These look like unused shadcn/ui scaffolding carried over from a template. Candidates for removal (confirm no hidden usage first, then delete the dep + its wrapper component).

11. 🟡 **SHOULD FIX** — **Viewport pinch-zoom disabled.**
    `index.html:6` — `maximum-scale=1` in the viewport meta prevents users from pinch-zooming, a recognized accessibility issue (WCAG 1.4.4 Resize Text). Low effort to remove.

### Low

12. ⚪ **SKIP** — **`not-found.tsx` is visually inconsistent and has placeholder copy.** Light theme (`bg-gray-50`, `text-gray-900`) while the rest of the site forces dark mode (`document.documentElement.classList.add('dark')` in `Home.tsx`/`ProjectDetail.tsx`). Copy ("Did you forget to add the page to the router?") is dev-facing, not user-facing.

13. ⚪ **SKIP** — **Two icon libraries installed** (`lucide-react` + `react-icons`) doing the same job — consolidate to one to shed a dependency.

14. ⚪ **SKIP** — **Hand-rolled hash-scroll navigation** (`ProjectDetail.tsx:51,263-264` → `/#project-<slug>`, resolved via scroll listeners/`ResizeObserver` in `Home.tsx:16-68`) works but is fragile/timer-dependent. Not migration-blocking, just a maintainability note.

15. ⚪ **SKIP** — **Live (non-CDN) Sanity endpoint used for every request.** `src/lib/sanity.ts:16-18` intentionally queries Sanity's live API (not the cached CDN) so edits show immediately — reasonable for low personal-site traffic, but means every page view is an uncached round-trip to Sanity with no edge caching layer once you're off Vercel's network. Fine to leave as-is, just note it if traffic ever grows.

16. 🔴 **MUST FIX** (user-reported) — **Scroll feels less smooth than intended, on both mobile and desktop.** `src/components/ui/SmoothScroll.tsx` configures Lenis for desktop wheel scroll only (`smoothWheel: true`) — mobile touch scroll isn't smoothed (`syncTouch` not enabled, Lenis v1 default). Separately, three independent `requestAnimationFrame` loops run concurrently (`SmoothScroll.tsx`, `Navbar.tsx`, `Contact.tsx`) alongside React Three Fiber's own render loop for the 3D hero — competing per-frame work likely contributes to jank, especially on mobile.

### Clean / no action needed
- No hardcoded `localhost`/`127.0.0.1` references.
- No `console.log`/`debugger`/TODO/FIXME left in source.
- All `<img>` tags have `alt` text.
- `dangerouslySetInnerHTML` used once (`chart.tsx:79`, a static shadcn chart-theme injector fed by static config, not user/CMS input) — no XSS risk. Sanity rich text renders safely through `@portabletext/react`, not raw HTML.
- No secrets/API keys/DB credentials found committed anywhere in this package.
- 404 route (`NotFound`) exists and is wired correctly in the router.

---

## Track B — Dormant backend (`artifacts/api-server`, `lib/db`, `lib/api-spec`, `lib/api-client-react`)

⚪ **SKIP (entire track)** — not used by the live site today. Currently scaffold-stage: one route (`GET /api/healthz`), an empty DB schema (`export {}` placeholder), generated clients that match that single endpoint. Deployed (per `artifacts/api-server/.replit-artifact/artifact.toml`) on **Replit**, not Vercel — a separate migration concern from the portfolio frontend if you ever activate this stack. Everything below only matters if/when you build real functionality on top of it.

### High
- **No Dockerfile, CI/CD, or any deployment config beyond the Replit artifact files anywhere in the repo.** No `.github/workflows`, no `fly.toml`/`render.yaml`/`docker-compose.yml`. This is the single biggest gap if you ever want this service self-hosted — it needs to be built from scratch (the esbuild single-file bundle at `dist/index.mjs` containerizes easily once a Dockerfile exists).
- **No migration history.** `lib/db` uses `drizzle-kit push`/`push-force` directly against `DATABASE_URL` rather than versioned SQL migrations (`drizzle-kit generate`). No rollback path, no audit trail. `scripts/post-merge.sh` runs `pnpm --filter db push` automatically on every post-merge git hook — this will silently push schema changes against whatever `DATABASE_URL` is active in that environment.
- **No auth, rate limiting, or security headers.** `src/middlewares/` is empty. `cors()` is called with no config (`app.ts:28`) — allow-all origins. No `helmet` or equivalent in any package.json. Fine for a single unauthenticated health route today, but all of this must exist before any route handles real user input or data.
- **No global error handler or process-level crash handling.** No 4-arg Express error middleware, no `uncaughtException`/`unhandledRejection` handlers in `index.ts`.

### Medium
- No documentation of required env vars (`PORT`, `DATABASE_URL`, `NODE_ENV`, `LOG_LEVEL`) outside the Replit artifact file — `DATABASE_URL` specifically isn't referenced there at all, meaning it's supplied out-of-band via Replit secrets with no record in-repo.
- No CI check that re-runs Orval codegen and diffs against committed generated files — currently moot (spec and generated code match, hand-verified), but will drift silently as routes are added with no guard.

### Low / Clean
- No hardcoded credentials, connection strings, or API keys found anywhere in this stack. Logger (`pino`) already redacts `authorization`/`cookie`/`set-cookie` headers — good practice already in place.
- TypeScript configs are consistent across packages (shared `tsconfig.base.json`, correct project-reference setup).
- API spec (`lib/api-spec/openapi.yaml`) matches the one implemented route exactly.

---

## Duplicate files (reuse opportunity)

⚪ **SKIP (optional, not urgent)** — mockup-sandbox isn't deployed; only worth doing for long-term maintainability.

**51 byte-identical files** copy-pasted between `artifacts/portfolio/src` and `artifacts/mockup-sandbox/src` (same relative path in both packages):

- `lib/utils.ts`
- `hooks/use-mobile.tsx`
- `components/ui/`: accordion, alert, alert-dialog, aspect-ratio, avatar, badge, breadcrumb, button-group, card, carousel, checkbox, collapsible, command, context-menu, dialog, drawer, dropdown-menu, empty, field, form, hover-card, input, item, kbd, label, menubar, navigation-menu, pagination, popover, progress, radio-group, resizable, scroll-area, select, separator, sheet, skeleton, slider, sonner, spinner, switch, table, tabs, textarea, toast, toaster, toggle, toggle-group, tooltip

**1 near-duplicate** (same name, diverged content — not identical, likely drifted over time):
- `hooks/use-toast.ts` (`artifacts/portfolio` vs `artifacts/mockup-sandbox`)

No internal duplication found within `portfolio`, `lib/`, or `studio` individually — all duplication is cross-package, between the live site and the unused mockup-sandbox dev tool.

**Fix (later, not now):** extract the shared shadcn/ui kit + `utils.ts` + `use-mobile.tsx` into a shared `lib/ui` workspace package both apps import from, instead of maintaining two copies.

---

## Cross-cutting / repo hygiene

- 🟡 **SHOULD FIX** — **Mixed package managers / lockfiles.** Root workspace uses pnpm (`pnpm-lock.yaml`, `pnpm-workspace.yaml`), but `artifacts/portfolio/package-lock.json` is also tracked in git (confirmed via `git ls-files`) — a stray npm lockfile inside a pnpm-managed package. Decide on one and remove the other to avoid confusion about which is authoritative.
- ⚪ **SKIP** — **`studio/` (Sanity Studio) is intentionally outside the pnpm workspace** and managed with its own npm lockfile — reasonable as a standalone deploy target, just worth documenting so it isn't mistaken for an oversight. It also pins React 18 while the rest of the repo is on React 19 — fine since it's a separate app, no shared-dependency conflict.
- 🟡 **SHOULD FIX** — **No CI/CD anywhere in the repo** (`.github/workflows` doesn't exist). Root `pnpm run build`/`typecheck` scripts exist but nothing runs them automatically on push/PR. Worth adding at minimum a typecheck+build GitHub Action before the migration, so regressions are caught before they hit the new host.
- 🔴 **MUST FIX** — **No `.env*` entries in `.gitignore`** (noted above for the portfolio, applies repo-wide) — add this at the root now regardless of which packages end up self-hosted.

---

## Suggested order of operations for the migration

1. Fix the Critical item first (SPA rewrite) — this alone will break the site on day one of the new host if skipped.
2. Knock out the quick, high-value wins: compress `logo.png` + proper favicon set, add meta description/OG/Twitter tags + `robots.txt`/`sitemap.xml`, move the Web3Forms key to an env var and restrict it to the new domain, add `.env*` to `.gitignore`.
3. Bundle/perf pass: remove confirmed-unused dependencies, add route-level code splitting.
4. Smaller polish: mobile nav, error boundary, 404 page theming, viewport zoom fix, icon-library consolidation.
5. Decide explicitly whether the API server/DB/Sanity-Studio stack travels with this migration or stays on Replit/separate hosting — they're independent deployments today and don't need to move together.
6. If the backend stack is ever activated for real use: add CI/CD, Dockerfile, versioned DB migrations, auth/rate-limiting/security headers, and global error handling before any real route goes live.

---

*This report is a point-in-time snapshot (commit `130145f`, 2026-10-04). No files were modified as part of this audit.*
