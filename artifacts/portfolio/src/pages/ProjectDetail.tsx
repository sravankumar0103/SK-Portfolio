import { useEffect } from 'react';
import { Link, useParams } from 'wouter';
import { motion, useScroll, useSpring } from 'framer-motion';
import { ArrowLeft, Github, ExternalLink, ArrowUpRight, Sparkles } from 'lucide-react';
import { useSanityProject, type SanityProjectDetail } from '../lib/sanityQueries';
import { fallbackProjectDetails } from '../lib/projectsData';
import { imageUrl } from '../lib/sanity';
import { PortableBody } from '../components/ui/PortableBody';
import { CoverflowGallery } from '../components/ui/CoverflowGallery';
import NotFound from './not-found';

const EASE = [0.22, 1, 0.36, 1] as const;

// Combine CMS data with the bundled in-depth write-up.
// The curated fallback supplies the detailed text (overview, body, outcomes) so
// every project page reads in depth, while any images uploaded in Sanity
// (cover + gallery) and meta fields still take precedence.
function resolveDetail(
  sanity: SanityProjectDetail | null | undefined,
  fallback: SanityProjectDetail | undefined,
): SanityProjectDetail | undefined {
  if (!sanity) return fallback;
  if (!fallback) return sanity;
  return {
    ...fallback,
    title: sanity.title || fallback.title,
    coverImageUrl: sanity.coverImageUrl || fallback.coverImageUrl,
    gallery: sanity.gallery && sanity.gallery.length ? sanity.gallery : fallback.gallery,
    tech: fallback.tech && fallback.tech.length ? fallback.tech : sanity.tech,
    github: sanity.github || fallback.github,
    live: sanity.live || fallback.live,
    client: sanity.client || fallback.client,
    role: sanity.role || fallback.role,
    timeline: sanity.timeline || fallback.timeline,
  };
}

export default function ProjectDetail() {
  const params = useParams();
  const slug = params?.slug;

  const { data, isLoading } = useSanityProject(slug);
  const project = resolveDetail(data, slug ? fallbackProjectDetails[slug] : undefined);

  // Reading-progress bar.
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.2 });

  // Where "back" should return to: the exact project row in the list.
  const backHref = slug ? `/#project-${slug}` : '/#projects';

  useEffect(() => {
    document.documentElement.classList.add('dark');
    // Always open a project page at the very top. Lenis keeps its scroll
    // position across client-side navigations, so reset it (not just the
    // window) and re-assert briefly in case it re-syncs after layout.
    const toTop = () => {
      const lenis = (window as any).__lenis;
      if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
      else window.scrollTo(0, 0);
    };
    toTop();
    const timers = [0, 60, 160].map((t) => setTimeout(toTop, t));
    return () => timers.forEach(clearTimeout);
  }, [slug]);

  useEffect(() => {
    if (project) document.title = `${project.title} — Sravan Kumar`;
    return () => {
      document.title = 'Sravan Kumar Portfolio';
    };
  }, [project]);

  if (isLoading && !project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
      </div>
    );
  }

  if (!project) return <NotFound />;

  const cover = imageUrl(project.coverImageUrl, 2000);
  const hasLive = project.live && project.live !== '#';

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary/30 selection:text-primary">
      {/* Reading progress */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-primary z-[60] origin-left"
        style={{ scaleX: progress }}
      />

      {/* Slim header */}
      <header className="fixed top-0 left-0 w-full z-50 px-6 md:px-12 py-4 flex items-center justify-between bg-gradient-to-b from-background/95 via-background/70 to-transparent backdrop-blur-sm">
        <Link
          href={backHref}
          className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="font-sans">Back to Portfolio</span>
        </Link>
        <Link href="/" className="text-sm font-display font-semibold hover:text-primary transition-colors">
          Sravan Kumar
        </Link>
      </header>

      {/* ---------- HERO (full-bleed, solid background) ---------- */}
      <section className="relative overflow-hidden">
        <div className="relative container mx-auto max-w-7xl px-6 md:px-12 pt-24 md:pt-28 pb-6 md:pb-8">
          <div className="max-w-4xl">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.05 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-semibold leading-[1.02] tracking-tight text-primary"
            >
              {project.title}
            </motion.h1>

            {project.overview && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: EASE, delay: 0.15 }}
                className="mt-7 text-base md:text-xl font-sans text-muted-foreground leading-relaxed max-w-3xl"
              >
                {project.overview}
              </motion.p>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.25 }}
              className="mt-10 flex flex-wrap items-center gap-3"
            >
              {project.github && slug !== 'hexapod-robotic-arm' && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-foreground rounded-full border border-white/10 hover:border-primary/40 hover:bg-white/[0.04] transition-all hover-lift"
                >
                  <Github className="w-4 h-4" /> View Code
                </a>
              )}
              {hasLive && (
                <a
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-background bg-primary hover:bg-primary/90 rounded-full transition-all glow-hover hover-lift"
                >
                  <ExternalLink className="w-4 h-4" /> Live Demo
                </a>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ---------- COVER (compact, full image visible) ---------- */}
      {cover && (
        <section className="container mx-auto max-w-3xl px-6 md:px-12 pt-4">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE }}
            className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]"
          >
            <img
              src={cover}
              alt={project.title}
              className="w-full h-auto object-contain"
            />
          </motion.div>
        </section>
      )}

      {/* ---------- BODY (two columns to fill width) ---------- */}
      <section className="container mx-auto max-w-7xl px-6 md:px-12 pt-12 md:pt-16 pb-16 md:pb-20">
        <div className="grid lg:grid-cols-[280px_1fr] gap-12 lg:gap-24">
          {/* Sticky spec sidebar */}
          <aside className="lg:sticky lg:top-28 h-max space-y-8">
            <MetaRow label="Role" value={project.role} />
            <MetaRow label="Timeline" value={project.timeline} />
            <MetaRow label="Client" value={project.client} />

            {project.tech && project.tech.length > 0 && (
              <div className="pt-6 border-t border-white/5">
                <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground/60 mb-4">
                  Tech Stack
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className="text-[10px] font-sans text-muted-foreground uppercase tracking-[0.15em] px-3 py-1 bg-white/[0.03] border border-white/5 rounded-full"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </aside>

          {/* Main content */}
          <div className="min-w-0">
            {project.body && project.body.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-10% 0px' }}
                transition={{ duration: 0.7, ease: EASE }}
                className="max-w-3xl"
              >
                <PortableBody value={project.body} />
              </motion.div>
            )}

            {/* Highlights as cards */}
            {project.outcomes && project.outcomes.length > 0 && (
              <div className="mt-16">
                <div className="flex items-center gap-2 mb-6">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <h2 className="text-sm font-sans uppercase tracking-[0.25em] text-primary">Highlights</h2>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  {project.outcomes.map((o, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-10% 0px' }}
                      transition={{ duration: 0.5, ease: EASE, delay: i * 0.05 }}
                      className="premium-card premium-card-hover rounded-2xl p-5 flex items-start gap-3"
                    >
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                      <span className="text-[15px] text-muted-foreground leading-relaxed">{o}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ---------- GALLERY (3D coverflow) ---------- */}
      {project.gallery && project.gallery.length > 0 && (
        <section className="max-w-[110rem] mx-auto px-2 md:px-6 pb-20 overflow-hidden">
          <h2 className="text-2xl md:text-3xl font-display font-semibold mb-6 px-4 md:px-6 container">
            Gallery
          </h2>
          <CoverflowGallery items={project.gallery} title={project.title} />
        </section>
      )}

      {/* ---------- FOOTER CTA (full width) ---------- */}
      <section className="border-t border-white/5">
        <div className="container mx-auto max-w-7xl px-6 md:px-12 py-16">
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground/60 mb-2">Explore more</p>
          <Link
            href={backHref}
            className="group inline-flex items-center gap-3 text-2xl md:text-3xl font-display font-semibold hover:text-primary transition-colors"
          >
            See more projects
            <ArrowUpRight className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
}

function MetaRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground/60 mb-1.5">{label}</p>
      <p className="text-base text-foreground font-medium">{value}</p>
    </div>
  );
}
