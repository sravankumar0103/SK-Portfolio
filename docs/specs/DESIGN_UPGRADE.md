# SK-Portfolio — Design Upgrade Spec

**Date:** 2026-10-05
**Goal:** Take the site from "good personal portfolio" to SaaS-grade / award-site standard.
**Status:** Spec only — nothing implemented. Decisions marked 🔵 need your pick before build.

---

## The core insight

Your **writing is already case-study quality**. The ArogyaLens page has a real problem statement, architecture breakdown, resilience notes, safety-first reasoning — that's genuinely strong content most portfolios don't have.

The problem is **presentation, not substance**. That content is currently rendered as a sidebar + a wall of body text, which reads like a blog post. Everything below is about giving strong content the frame it deserves.

Second finding, less comfortable: the **floating glossy black blobs in your hero are now a cliché**. Research flagged "glossy orbs/blobs" explicitly as an overdone 2026 pattern alongside glassmorphism and purple-blue "AI gradients". The 3D is well-built, but it reads as generic — it could be anyone's portfolio. That's the single biggest thing holding the site back from feeling distinctive.

> ⚠️ **Sourcing caveat:** Reference sites below come largely from model knowledge rather than fresh verification — worth spot-checking a few yourself before treating them as gospel. Browser-support claims in the technical section *were* verified against current docs.

---

## 1. Design system foundations

Fix these first — everything else inherits from them. Cheap to do, disproportionate impact.

### Color
Current: `--background: 11 6% 6%` (warm obsidian), `--primary: 11 81% 57%` (burnt orange). **Keep this** — the warm-black + burnt-orange identity is distinctive and better than the default purple/blue most dev portfolios use. Refinements:

| Token | Current | Proposed | Why |
|---|---|---|---|
| Background | `11 6% 6%` | keep | Already correct (not pure black) |
| Elevation 1 | `11 6% 9%` | keep | Cards |
| Elevation 2 | — | `11 6% 12%` | Add — needed for nested surfaces |
| Text primary | `30 8% 92%` | keep | |
| Text secondary | `0 0% 48%` | `0 0% 60%` | Current muted is too dim on dark — contrast risk |
| Text tertiary | — | `0 0% 40%` | Add — for labels/meta |
| Hairline | `rgba(255,255,255,0.08)` | keep | Correct value already |

### Type
Currently three families loaded (Plus Jakarta Sans, Outfit, Inter) — that's one too many. Proposal:

- **Display:** Outfit (keep) — but go heavier and tighter. `font-weight: 600-700`, `letter-spacing: -0.04em`, `line-height: 0.95`
- **Body/UI:** Plus Jakarta Sans (keep)
- **Drop Inter** (redundant with Jakarta)
- **🔵 Add a mono** for metadata labels/numbers (Geist Mono or JetBrains Mono). This is the single strongest "engineer, not designer-template" signal — uppercase, 11px, `letter-spacing: 0.08em` on all the `01 / 02 / 03` section numbers, tech chips, timeline dates.
- **🔵 Optional accent:** one serif-italic word inside the hero headline (Instrument Serif). Very current, high-impact, zero risk. e.g. *AI & Full-Stack **Developer*** with the italic on one word.
- Add `text-wrap: balance` on all headings, `text-wrap: pretty` on paragraphs. Both are Baseline-safe, degrade harmlessly.
- Use `tabular-nums` on all metrics/counters.

### Motion language (standardize — now centralised in `src/lib/motion.ts`; change the values there)
| Use | Duration | Easing |
|---|---|---|
| Hover / micro | 150–250ms | `cubic-bezier(0.22, 1, 0.36, 1)` |
| Reveals on scroll | 700–900ms | `cubic-bezier(0.16, 1, 0.3, 1)` (expo.out) |
| Page transitions | 500–700ms | `cubic-bezier(0.76, 0, 0.24, 1)` (in-out) |
| Interactive springs | — | stiffness 200, damping 25 |

You already use `[0.22,1,0.36,1]` and `[0.16,1,0.3,1]` in places — just make it universal and never fall back to default `ease`.

### Grain overlay ← highest effort-to-impact ratio on this list
A fixed, full-viewport noise layer at `opacity: 0.04`, `pointer-events: none`. Instantly separates "designed" from "templated" on dark backgrounds.
**Implementation:** tiled 128px noise PNG (a few KB) — *not* SVG `feTurbulence` (rasterizes at full viewport size, slow, flaky in Safari) and *not* canvas. Use plain `opacity`, **never `mix-blend-mode` over the WebGL canvas** (forces expensive compositing).

### Spacing
Section padding → `clamp(96px, 12vw, 180px)` — change it in one place, `src/components/layout/Section.tsx`. Current `py-12 md:py-20` (48/80px) is too tight for a premium feel — generous whitespace is most of what reads as "expensive".

---

## 2. Hero — the headline moment

### What's there now
Two-line masked text reveal (good, correct technique), 3D canvas with icosahedron + torus knot + 8 spheres in glossy black, mouse-parallax rotation, scroll indicator. Technically sound, visually generic.

### Direction options — 🔵 pick one

**Option A — "Refined signal" (lowest risk, ~2 days)**
Keep the Canvas, replace what's in it. Single large displaced sphere using `MeshDistortMaterial` or a custom noise-displacement shader, iridescent `MeshPhysicalMaterial` (clearcoat 1, iridescence 1) so it reads oil-slick rather than plastic-glossy. Cursor proximity dents the surface. Camera drifts on scroll. Add a preloader counter (0→100) that hands off into the headline reveal.
*Risk: low. Still "an abstract 3D object", but a far more refined one.*

**Option B — "Identity-driven" (highest impact, ~4-5 days) ← my recommendation**
Replace the abstract object with something that *means something* — you're an AI developer, so make the hero visual a representation of that. Options: a particle field that assembles into a neural-graph structure on load, an interactive shader where cursor movement propagates through a node lattice, or a live "latent space" field that reacts to cursor velocity.
*Why: the research's clearest finding is that top portfolios make the interaction itself the proof of skill (Bruno Simon's drivable jeep being the extreme case). An AI developer with a generic blob hero is leaving the strongest differentiator unused.*
*Risk: medium. Needs taste to avoid "meaningless particle field", which is its own cliché.*

**Option C — "Typography-first" (safest premium, ~1-2 days)**
Drop 3D from the hero entirely. Huge kinetic type at 12vw, a subtle animated noise-gradient shader background (cheap, runs great on mobile), scroll-scrubbed mask reveal. Move the 3D to a smaller, supporting role elsewhere.
*Risk: lowest. Loads fastest, works everywhere. Less "wow", more "confident".*

### Regardless of option
- **Headline:** GSAP `SplitText` (now free in 3.13+, you're on 3.15) with `mask: "lines"`, `autoSplit: true`, chars stagger `0.02`, `yPercent: 110 → 0`, `duration: 0.9`, `ease: "expo.out"`. **Must split after `document.fonts.ready`** or line breaks compute wrong.
- **Preloader:** counter 0→100, max 1.5s, hands directly into headline reveal. Never block past asset load.
- **Mobile:** force DPR 1, drop transmission/postprocessing, halve geometry segments — or swap to a static poster entirely. Detect via `useDetectGPU` + `matchMedia("(pointer:coarse)")`.
- **The `<h1>` must stay real DOM text** — never rendered into the canvas (SEO + screen readers).
- `prefers-reduced-motion` → static frame, `frameloop="never"`.

---

## 3. Projects section (list) — restructure

### What's there now
Vertical rows: number, title with char-reveal, tech chips, description that expands on scroll, Code/Live/arrow buttons. It's clean but it's a **text list — there's no imagery at all**, which is the biggest miss. Visitors judge projects visually in the first second.

### Proposed
Keep the row rhythm (it's good, and more distinctive than a card grid), but add:

1. **Hover image reveal** — on row hover, the project's cover image fades in following the cursor (positioned absolutely, `pointer-events: none`, slight scale-in + rotation). This is the signature interaction of nearly every top agency portfolio and it fixes the "no imagery" problem without adding a grid.
2. **Row hover state**: siblings dim to `opacity: 0.4`, hovered row stays full — focuses attention, used by Brittany Chiang and most SaaS sites.
3. **Mono numbering** — `01 / 02` in the new mono face, tertiary color.
4. **Year + status** per row (right-aligned, mono) — adds scannable credibility.
5. **Mobile:** no hover, so show the cover image inline in each row instead.

### 🔵 Decision: featured vs. all
Research strongly recommends **3-4 deep case studies over many thumbnails**. You have 6 projects. Consider: top 3 get large treatment (image + expanded description), remaining 3 in a compact "More work" list below.

---

## 4. Project detail page — full restructure (the main ask)

### What's there now
Title → overview → buttons → cover (max-w-3xl, small) → **sticky sidebar + one long text column** → outcomes as cards → coverflow gallery → "see more projects" link.

**Why it reads basic:** everything is the same width, same rhythm, same text size. No media punctuating the reading. No visual hierarchy between "intro", "deep technical section", and "outcome". The cover image is small and centered rather than making an entrance. It's a well-styled document, not a case study.

### Proposed structure — section by section

**1. Full-bleed hero** *(replaces current compact header)*
- Title at `clamp(48px, 8vw, 120px)`, masked line reveal
- One-line pitch below
- Cover image **full-bleed, 100vw**, scale 1.1→1 on scroll (parallax), not a small centered box
- Live + GitHub CTAs above the fold
- Sticky mini-header appears on scroll past hero: project title (small) + live link, always accessible

**2. Meta strip** *(new — currently buried in sidebar)*
Horizontal 4-column row with hairline dividers, directly under hero:
`ROLE · TIMELINE · STACK · STATUS/YEAR` — all labels in mono, uppercase, 11px.
*Recruiters scan this in ~5 seconds. In the sidebar it's missable; as a strip it's the first thing after the title.*

**3. Overview** — single large paragraph, `28-32px`, max `65ch`, generous padding. Give it room to breathe as a statement, not body copy.

**4. Body with media rhythm** ← **the key fix**
Currently: one uninterrupted text column. Proposed: alternate the width and insert media between sections:
```
[ text column, 65ch, centered ]
[ FULL-BLEED image/video ]
[ text column ]
[ 2-up image pair ]
[ text + image side-by-side split ]
[ text column ]
```
Reveal each image with `clip-path: inset(0 0 100% 0) → inset(0)` or scale `1.08 → 1` over 1.2s. This single change does more for "premium vs. blog post" than anything else on this list.

**5. Architecture diagram** *(new — strong fit for you specifically)*
Your ArogyaLens write-up already *describes* the pipeline in prose ("image input → Gemini → verified KB → cache → UI"). Render that as an actual SVG diagram. For an AI/full-stack developer this is high-signal and almost nobody does it.

**6. Challenges & solutions** *(new)* — 2-3 numbered cards: problem → what you tried → result. Optional short code snippet. You already have this content (the NVIDIA NIM fallback story, the "AI never invents dosages" decision) — it's just currently buried in flowing prose.

**7. Outcomes** — keep the cards, but add **animated count-up numbers** where you have metrics (latency, accuracy, users). Mono + `tabular-nums`. End with one line of reflection ("what I'd do differently") — signals maturity.

**8. Gallery** — keep the coverflow (it's genuinely nice and already built).

**9. Next project footer** *(replaces "See more projects" link)*
Full-width, next project's title at huge scale, its cover image revealing on hover. Keeps people moving through your work instead of dead-ending.

**Throughout:** keep the reading-progress bar (already there, good). Add a sticky section index (scroll-spy) on wide screens.

---

## 5. Other sections — targeted upgrades

| Section | Issue | Proposal |
|---|---|---|
| **About** | Plain two-column text | 🔵 Bento grid: bio + photo + "currently" status + local time (IST) + stats. Asymmetric, spacious. Very 2026, fits you. |
| **Experience** | Standard list | Timeline with scroll-scrubbed progress line; mono dates |
| **Skills** | Text chips in 3 rows | Keep text (avoid logo marquees — cliché), but add hover-tilt cards or group into a bento. *(Keep "Vercel" — still used for other projects, even though this site moved off it. Consider adding Cloudflare too.)* |
| **Certifications** | Basic list | Cards with issuer logos + verify links |
| **Contact** | Already strong | Add the inline validation errors (already committed), + animated availability pulse |
| **404 page** | Light theme, dev-facing copy ("Did you forget to add the page to the router?") | Dark theme, real copy, useful links. *(Previously marked SKIP in the audit — worth doing as part of this pass.)* |

### Cross-cutting additions
- **Activate `CustomCursor`** — already built in your codebase, wired up nowhere. Dot + lagging ring, morphs to "View" label over project rows, hidden on touch. **Free win.**
- **Activate `BackToTop`** — also already built, also unused (Contact has its own inline version instead).
- **Extend `Magnetic`** — currently only on two Hero buttons. Apply to all primary CTAs, nav links, social icons.
- **Rolling-text hover on nav links** — duplicate text, `translateY(-100%)` on hover, 0.5s. Cheap, very polished.
- **Page transitions** — currently none; routes swap instantly. See technical section.
- **Status signals** — "Available for work" pulse, local time in Hyderabad. Small, humanizing, very current.
- **Light mode** — 🔵 optional. Considered light mode is a quality signal, but it's real work and your dark identity is strong. My take: skip for now.

---

## 6. Technical implementation notes

These are the load-bearing details — getting them wrong causes jank that undermines everything above.

### Lenis ↔ ScrollTrigger (must be exact)
Your current `SmoothScroll.tsx` runs its own RAF loop. Once ScrollTrigger enters, **GSAP's ticker must own the single RAF** or you get double-RAF jitter:
```js
const lenis = new Lenis({ autoRaf: false });   // ← critical
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((t) => lenis.raf(t * 1000));   // gsap time is seconds
gsap.ticker.lagSmoothing(0);
```
Other gotchas: clean up on unmount (StrictMode double-mounts duplicate tickers); `ScrollTrigger.refresh()` after fonts/images/route changes; `overflow-x: clip` not `hidden` on body (`hidden` breaks `position: sticky`); mark modals with `data-lenis-prevent`; don't combine with ScrollSmoother.

### Page transitions with wouter
Baseline: framer-motion `AnimatePresence mode="wait"` keyed by location.
**Critical wouter gotcha:** you *must* pass `location={location}` to `<Switch>` inside `AnimatePresence` — otherwise the exiting page re-renders against the new route and shows the wrong content mid-transition.
Keep exits ≤400ms (in `mode="wait"` the new page doesn't mount until exit finishes).

**Shared-element morph** (project card image → detail hero image) — the premium touch:
- Via **View Transitions API** — verified Baseline since Oct 2025 (Chrome/Edge 111+, Safari 18+, Firefox 144+). Needs `flushSync` with wouter's synchronous navigate. Set `viewTransitionName` on the *clicked* card only (names must be unique at snapshot time). Give the WebGL canvas its own name so it's excluded from the root snapshot.
- *Not* via framer-motion `layoutId` — flaky with Lenis scroll offsets, and requires the heavier `domMax` feature bundle.
- Always feature-gate: `if (!document.startViewTransition || reducedMotion)` → plain fade.

### Bundle — currently 1.6MB, this gets worse if we add naively
Cause: `three` + `drei` + `framer-motion` + `gsap` all in the entry chunk.
- Route-level `lazy()` on every page; `lazy()` the Canvas separately and mount it after first paint → LCP becomes the headline text, not WebGL
- `manualChunks`: `three`/`@react-three/*` in one chunk, `gsap` and `framer-motion` separate
- `LazyMotion` + `m.div` + `domAnimation` saves ~60KB (note: incompatible with `layoutId`, which is another reason to prefer View Transitions)
- Preload route chunks on link hover
- Self-host subsetted variable WOFF2 fonts (currently loading 3 families from Google Fonts)

**Weight of proposed additions:** SplitText ~7KB · grain PNG few KB · View Transitions 0KB · CSS marquee/magnetic/cursor ~0 (GSAP already bundled) · `@react-three/postprocessing` ~40-60KB ⚠️ · HDR environments 200KB-2MB ⚠️ (use procedural `Lightformer` instead — zero download).

### Accessibility (non-negotiable)
- `prefers-reduced-motion` wired everywhere: no Lenis, no scrub/pin, no parallax, static hero. Use `gsap.matchMedia()` + framer-motion `MotionConfig reducedMotion="user"`
- SplitText keeps `aria-label` automatically — don't strip it
- Move focus to `<h1>` after route change + announce via `aria-live` (SPA transitions break this by default)
- Contrast check text over grain + 3D — glossy black + grey text drops below AA fast
- Keep focus rings visible even with custom cursor

---

## 7. Suggested phasing

**Phase 1 — Foundations** *(highest impact per hour, low risk)*
Design tokens · grain overlay · mono face · type scale · spacing · standardized easings · activate `CustomCursor` + `BackToTop` + extend `Magnetic` · remove Inter

**Phase 2 — Project detail restructure** *(the main ask)*
Full-bleed hero · meta strip · media rhythm · challenges cards · count-up outcomes · next-project footer · sticky mini-header

**Phase 3 — Projects list**
Hover image reveal · sibling dimming · mono numbering · featured/compact split

**Phase 4 — Hero** *(after you pick A/B/C)*
Preloader handoff · SplitText reveal · new 3D direction · mobile fallbacks

**Phase 5 — Page transitions + perf**
Lenis↔ScrollTrigger rewiring · AnimatePresence · View Transitions morph · code-splitting (do the splitting *with* this phase, not after — it gets harder later)

**Phase 6 — Remaining sections**
About bento · Experience timeline · Skills · Certifications · 404

*Phases 1-3 alone would get most of the perceived jump. Phase 4 is where it becomes distinctive.*

---

## 8. Decisions needed from you

| # | Decision | Options |
|---|---|---|
| 1 | **Hero direction** | A (refined 3D) / B (identity-driven, recommended) / C (typography-first) |
| 2 | Add a mono typeface? | Geist Mono / JetBrains Mono / skip |
| 3 | Serif-italic accent word in headline? | yes / no |
| 4 | Featured (3) + compact (3) project split? | yes / keep all 6 equal |
| 5 | About section → bento grid? | yes / keep current |
| 6 | Light mode? | yes / skip (my rec: skip) |
| 7 | Scope | all 6 phases / phases 1-3 only / something else |

---

## 9. What NOT to do (flagged as cliché/overdone in 2026)

Glossy orbs & blobs ⚠️*(you have these)* · glassmorphism everywhere · purple-blue "AI gradient" · meaningless particle fields · typewriter "Hi, I'm..." intros · skill percentage bars · tech-logo marquees · aggressive scroll-jacking · horizontal scroll for everything · laggy cursor trails that hurt usability · preloaders over 3s · **everything animating at once** (pick one hero moment, keep the rest quiet).

---

*Spec only — no code written. Reference sites unverified; browser-support claims verified against current docs.*
