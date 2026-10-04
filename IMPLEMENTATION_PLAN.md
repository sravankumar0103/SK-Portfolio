# SK-Portfolio — Implementation Plan

Source of truth for findings: `AUDIT_REPORT.md`. This file is the execution spec. Do not re-derive findings — implement exactly what's below. Preserve all existing features/behavior; this is hardening + cleanup, not a redesign.

## Model usage (mandatory)

- **Build phase (all tasks below):** Claude Sonnet, medium reasoning effort.
- **Final review:** Claude Sonnet, high reasoning effort — run only once, after ALL build tasks are complete and committed. Full-repo review against this plan + `AUDIT_REPORT.md`: verify each task was done correctly, nothing broke, architecture/data flow (routing, Sanity fetch → render, build output) still works end-to-end.
- **Post-review fixes:** back to Claude Sonnet, medium reasoning effort. Apply only what the high-effort review flags.
- Do not run the high-effort review until every task below is checked off and the app builds clean.

## Scope

Only `artifacts/portfolio`. Do not touch `artifacts/api-server`, `lib/db`, `lib/api-spec`, `lib/api-client-react`, `studio/`, or `artifacts/mockup-sandbox` — out of scope (see AUDIT_REPORT.md Track B / duplicate-files section, both marked SKIP).

## Ground rules

- No feature removal, no behavior change to any working UI/animation/route.
- No new frameworks/libraries unless explicitly listed.
- After each task, run `pnpm --filter portfolio run typecheck` and `pnpm --filter portfolio run build` — must pass before moving to the next task.
- Verify in a real browser after the full pass: `/`, `/projects/<any-valid-slug>`, an invalid slug (404), and a hard-refresh on `/projects/<slug>` (post-deploy config step, see Task 9).

---

## Tasks

### 1. Fix favicon/logo size
- File: `artifacts/portfolio/public/logo.png` (12MB, used as favicon).
- Generate properly sized variants from the same source image, no visible quality loss at display size:
  - `favicon-32.png` (32x32), `favicon-16.png` (16x16), `apple-touch-icon.png` (180x180), `logo-512.png` (512x512, for any larger on-page logo usage — check if `logo.png` is referenced anywhere beyond the favicon links first; if so, replace that reference with the right-sized variant).
- Update `index.html` icon `<link>` tags to reference the new files instead of the raw 12MB file.
- Replace the original oversized `public/logo.png` with a reasonably sized version (or remove if fully superseded by the new files) — final total favicon assets should be well under 500KB combined.

### 2. Add `.env*` to `.gitignore`
- File: root `.gitignore`.
- Add: `.env`, `.env.local`, `.env.*.local`.

### 3. ~~Add mobile navigation menu~~ — DECLINED, do not do
- A mobile hamburger menu was built, then explicitly removed per user decision. Navbar stays desktop-only (`hidden md:flex`), unchanged. Do not re-add a mobile menu.

### 4. SEO meta tags
- File: `artifacts/portfolio/index.html`.
- Add: `<meta name="description">`, Open Graph tags (`og:title`, `og:description`, `og:type`, `og:image`, `og:url`), Twitter card tags (`twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`), `<link rel="canonical">`.
- Content: use the existing portfolio title/description already implied by the site (check `Home.tsx` hero copy for wording) — do not invent unrelated content.
- `og:image`/`twitter:image` should point to a static image (create a simple 1200x630 social-preview image if none exists, or reuse an existing hero/project image — confirm with available assets first, do not block on this if no suitable image exists; use the resized logo as fallback).
- Per-project dynamic meta: in `src/pages/ProjectDetail.tsx`, alongside the existing `document.title` update (line ~68-73), also update the `og:description`/`og:image`/`twitter:*` meta tag content dynamically (select the tag by id/name and set `.content`). This won't help pure crawlers (SPA limitation, acceptable), but improves same-session share behavior and is low-cost.

### 5. `robots.txt` and `sitemap.xml`
- Add `artifacts/portfolio/public/robots.txt` — allow all, reference sitemap.
- Add `artifacts/portfolio/public/sitemap.xml` — list `/` and each project route (pull slugs from `src/lib/projectsData.ts` and/or Sanity schema; static list is fine, this is a personal portfolio, not auto-generated).

### 6. Web3Forms key to env var
- File: `artifacts/portfolio/src/components/sections/Contact.tsx:92`.
- Replace hardcoded `access_key: "5efdf489-27ba-41bd-baec-f7e6bebc647a"` with `access_key: import.meta.env.VITE_WEB3FORMS_KEY`.
- Add `VITE_WEB3FORMS_KEY=5efdf489-27ba-41bd-baec-f7e6bebc647a` to a new `.env.example` file (committed, placeholder/documentation only) in `artifacts/portfolio/`.
- Do not commit an actual `.env` with the real key (covered by Task 2's gitignore update). Note in a comment that the real key must be set in the hosting platform's env var config and the key should be domain-restricted in the Web3Forms dashboard after the domain move (manual, non-code step — leave a one-line comment, don't attempt to automate it).

### 7. Error boundary
- Add `artifacts/portfolio/src/components/ErrorBoundary.tsx` — class component, standard `componentDidCatch`/`getDerivedStateFromError`, renders its own dark-themed fallback UI consistent with the site's existing dark theme. Do NOT base it on `not-found.tsx` — that page's light-theme inconsistency is an explicit SKIP item (AUDIT_REPORT.md item 12) and must not be touched or copied from.
- Wrap the router in `App.tsx` with it (outermost, around `QueryClientProvider` or just inside it — wrap so a render error anywhere in the tree is caught).

### 8. Unused dependency cleanup
- Confirm zero usage (grep for imports outside each library's own `src/components/ui/*` wrapper) before removing:
  - `recharts`, `input-otp`, `vaul`, `cmdk`, `react-day-picker`, `react-resizable-panels`.
- For each confirmed-unused one: remove the npm dependency from `artifacts/portfolio/package.json` AND delete its corresponding wrapper component file(s) in `src/components/ui/` (e.g. `chart.tsx`, `input-otp.tsx`, `drawer.tsx`/`vaul`-based file, `command.tsx` if cmdk-only, `calendar.tsx`, `resizable.tsx`).
- Do NOT remove `embla-carousel-react` itself — it's used directly by `CoverflowGallery`. Only remove the unused `carousel.tsx` wrapper if it's confirmed to have zero imports anywhere (re-check, audit noted "most" usage beyond the gallery, verify exactly before deleting).
- After removal: `pnpm install` at root, then typecheck + build to confirm nothing broke.

### 9. Viewport pinch-zoom
- File: `artifacts/portfolio/index.html`.
- Change `<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1" />` to remove `maximum-scale=1` (keep `width=device-width, initial-scale=1.0`).

### 10. Scroll smoothness (mobile + desktop)
- File: `artifacts/portfolio/src/components/ui/SmoothScroll.tsx`.
- Current Lenis config only smooths wheel/desktop scroll (`smoothWheel: true`); mobile touch scroll falls back to native (Lenis v1 default — `syncTouch` is not enabled), which can feel inconsistent with the rest of the site's animated feel. Separately, three independent `requestAnimationFrame` loops run concurrently (`SmoothScroll.tsx`, `Navbar.tsx`, `Contact.tsx`) plus React Three Fiber's own render loop for the 3D hero — competing RAF work is a likely contributor to jank, especially on mobile.
- Fix, in order:
  1. Tune Lenis: enable `syncTouch: true` (with a reasonable `syncTouchLerp`, e.g. `0.075`) so touch scroll gets the same smoothing treatment as desktop wheel scroll — test on an actual mobile viewport/device, not just devtools throttling, since touch physics behave differently.
  2. Audit the `requestAnimationFrame` loops in `Navbar.tsx` and `Contact.tsx` — confirm what they're driving (likely scroll-position-based effects); if they can be driven by Lenis's own `scroll` event instead of a separate RAF loop, consolidate to cut redundant per-frame work. Do not change their visual behavior, only the mechanism driving it.
  3. Verify the 3D hero (`@react-three/fiber`) isn't rendering at full frame rate while off-screen or behind other content — if it already pauses/throttles appropriately, leave it; if not, this is a secondary perf lever but lower priority than 1–2.
  4. Re-test scroll feel on both a real mobile device and desktop after each change — this is a feel-based fix, not purely mechanical; iterate on `duration`/`syncTouchLerp`/`wheelMultiplier` values until scrolling feels smooth on both without becoming sluggish or overshooting.
- Do not change scroll-triggered animation logic/behavior elsewhere in the app — only the scrolling mechanism itself.

### 11. Mixed lockfiles
- `artifacts/portfolio/package-lock.json` is tracked in git alongside root `pnpm-lock.yaml`. This repo uses pnpm exclusively (root `package.json` `preinstall` script enforces it).
- Delete `artifacts/portfolio/package-lock.json` and remove it from git tracking (`git rm`).

### 12. CI/CD (new file)
- Add `.github/workflows/ci.yml`: on push/PR to `main`, run `pnpm install --frozen-lockfile`, `pnpm run typecheck`, `pnpm run build` (root scripts already exist, see `WORKSPACE_GUIDE.md`). Node version per `pnpm-workspace.yaml`/`package.json` engines (Node 24, per `WORKSPACE_GUIDE.md`).

### 13. Deploy config for new host (deferred, do last, verify manually)
- Not a code change inside `artifacts/portfolio` itself, but required for the migration to actually work: whatever web server serves the built `dist/` on the new domain must replicate the SPA rewrite currently done by `vercel.json`'s `rewrites` rule (`/(.*) → /index.html`).
- Produce the equivalent config for the actual target server software once known (nginx `try_files`, Apache `.htaccess`, Caddy, Node static-serve middleware, etc.) — ask the user which server software the new host uses if not already specified, don't guess a generic nginx.conf if the host might be something else (e.g. a reverse proxy, a PaaS with its own static-site rewrite setting).

---

## Explicitly out of scope (do not touch)
- `artifacts/api-server`, `lib/db`, `lib/api-spec`, `lib/api-client-react` — unused by the live site (AUDIT_REPORT.md Track B).
- `studio/` — Sanity CMS, working as-is, do not modify.
- `artifacts/mockup-sandbox` — dev sandbox, not deployed; duplicate-file dedup with `portfolio` is optional/deferred, not part of this pass.
- `not-found.tsx` theme, icon-library consolidation (`lucide-react`/`react-icons`), hash-scroll navigation rewrite, Sanity CDN-vs-live endpoint — all marked SKIP in AUDIT_REPORT.md, leave as-is.

## Definition of done
- All tasks 1–12 implemented, typecheck + build pass.
- Manual browser verification: home page, a project detail page, direct URL load of a project detail page (not just client-side nav), invalid slug → 404, mobile viewport → hamburger menu works, scroll feels smooth on both desktop (mouse wheel) and mobile (touch) without regressing existing scroll-triggered animations, contact form still submits successfully.
- High-effort Sonnet review run once at the end against this plan + AUDIT_REPORT.md; any findings routed back to medium-effort Sonnet for fixes.
- Task 13 confirmed against the actual target hosting platform before the domain cutover.
