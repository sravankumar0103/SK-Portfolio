import { useEffect } from 'react';
import { Link, useParams } from 'wouter';
import { motion } from 'framer-motion';
import { ArrowLeft, Github, ExternalLink, ArrowUpRight } from 'lucide-react';
import { useSanityProject } from '../lib/sanityQueries';
import { fallbackProjectDetails } from '../lib/projectsData';
import { imageUrl } from '../lib/sanity';
import { PortableBody } from '../components/ui/PortableBody';
import NotFound from './not-found';

export default function ProjectDetail() {
  const params = useParams();
  const slug = params?.slug;

  const { data, isLoading } = useSanityProject(slug);
  // Prefer CMS content; fall back to the bundled write-up so pages work offline.
  const project = data ?? (slug ? fallbackProjectDetails[slug] : undefined);

  useEffect(() => {
    document.documentElement.classList.add('dark');
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    if (project) document.title = `${project.title} — Sravan Kumar`;
    return () => {
      document.title = 'Sravan Kumar Portfolio';
    };
  }, [project]);

  // Still fetching from Sanity and no fallback matched yet → light placeholder.
  if (isLoading && !project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
      </div>
    );
  }

  // Unknown slug, and nothing in Sanity or fallback → 404.
  if (!project) return <NotFound />;

  const cover = imageUrl(project.coverImageUrl, 1800);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary/30 selection:text-primary">
      {/* Slim header */}
      <header className="fixed top-0 left-0 w-full z-50 px-6 md:px-12 py-4 flex items-center justify-between bg-gradient-to-b from-background/90 to-transparent backdrop-blur-sm">
        <Link
          href="/#projects"
          className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="font-sans">Back to Portfolio</span>
        </Link>
        <Link href="/" className="text-sm font-display font-medium hover:text-primary transition-colors">
          Sravan Kumar
        </Link>
      </header>

      <article className="container mx-auto px-6 md:px-12 pt-28 md:pt-36 pb-24 max-w-3xl">
        {/* Title block */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {project.client && (
            <p className="text-xs font-sans uppercase tracking-[0.25em] text-primary/70 mb-4">
              {project.client}
            </p>
          )}
          <h1 className="text-4xl md:text-6xl font-display font-medium leading-[1.05] tracking-tight">
            {project.title}
          </h1>

          {project.overview && (
            <p className="mt-6 text-lg md:text-xl font-sans text-muted-foreground leading-relaxed">
              {project.overview}
            </p>
          )}

          {/* Tech tags */}
          {project.tech && project.tech.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-7">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="text-[9px] font-sans text-muted-foreground uppercase tracking-[0.2em] px-2.5 py-0.5 bg-white/[0.03] border border-white/5 rounded-full"
                >
                  {t}
                </span>
              ))}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-3 mt-7">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-primary transition-all rounded-full border border-white/10 hover:border-primary/30 hover:bg-white/[0.03]"
              >
                <Github className="w-4 h-4" /> View Code
              </a>
            )}
            {project.live && project.live !== '#' && (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 text-sm text-background bg-primary hover:bg-primary/90 transition-all rounded-full font-medium"
              >
                <ExternalLink className="w-4 h-4" /> Live Demo
              </a>
            )}
          </div>

          {/* Meta row */}
          {(project.role || project.timeline) && (
            <div className="flex flex-wrap gap-x-12 gap-y-4 mt-10 pt-8 border-t border-white/5">
              {project.role && (
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 mb-1">Role</p>
                  <p className="text-sm text-foreground">{project.role}</p>
                </div>
              )}
              {project.timeline && (
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 mb-1">Timeline</p>
                  <p className="text-sm text-foreground">{project.timeline}</p>
                </div>
              )}
            </div>
          )}
        </motion.div>

        {/* Cover image */}
        {cover && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="mt-12 -mx-2 md:mx-0"
          >
            <img
              src={cover}
              alt={project.title}
              className="w-full rounded-2xl border border-white/10"
            />
          </motion.div>
        )}

        {/* Body */}
        {project.body && project.body.length > 0 && (
          <div className="mt-12">
            <PortableBody value={project.body} />
          </div>
        )}

        {/* Outcomes */}
        {project.outcomes && project.outcomes.length > 0 && (
          <div className="mt-14 p-6 md:p-8 rounded-2xl border border-white/5 bg-white/[0.02]">
            <h2 className="text-sm font-sans uppercase tracking-[0.2em] text-primary/70 mb-5">
              Highlights
            </h2>
            <ul className="space-y-3">
              {project.outcomes.map((o, i) => (
                <li key={i} className="flex items-start gap-3 text-[15px] text-muted-foreground">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  <span className="leading-relaxed">{o}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Gallery */}
        {project.gallery && project.gallery.length > 0 && (
          <div className="mt-14">
            <h2 className="text-2xl md:text-3xl font-display font-medium mb-6">Gallery</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {project.gallery.map((img, i) => {
                const src = imageUrl(img.url, 1000);
                if (!src) return null;
                return (
                  <figure key={i} className="group overflow-hidden rounded-xl border border-white/10">
                    <img
                      src={src}
                      alt={img.caption || `${project.title} screenshot ${i + 1}`}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {img.caption && (
                      <figcaption className="px-3 py-2 text-xs text-muted-foreground italic bg-white/[0.02]">
                        {img.caption}
                      </figcaption>
                    )}
                  </figure>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer CTA */}
        <div className="mt-20 pt-10 border-t border-white/5">
          <Link
            href="/#projects"
            className="group inline-flex items-center gap-2 text-lg font-display font-medium hover:text-primary transition-colors"
          >
            See more projects
            <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </Link>
        </div>
      </article>
    </div>
  );
}
