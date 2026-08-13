import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'wouter';
import { SectionHeading } from '../ui/SectionHeading';
import { ScrollRevealText } from '../ui/ScrollRevealText';
import { ArrowRight, Github, ExternalLink } from 'lucide-react';
import { useSanityProjects } from '../../lib/sanityQueries';
import { fallbackProjects, detailSlugByTitle } from '../../lib/projectsData';

export function Projects() {
  const { data } = useSanityProjects();
  const projects = data && data.length ? data : fallbackProjects;

  return (
    <section id="projects" className="py-12 md:py-20 relative">
      <div className="container mx-auto px-6 md:px-12">
        <SectionHeading num="04" title="Selected Works" />

        <div className="flex flex-col mt-16 max-w-5xl">
          {projects.map((project, idx) => (
            <ProjectRow key={project.title} project={project} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectRow({ project, index }: { project: any, index: number }) {
  const num = (index + 1).toString().padStart(2, '0');
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-30% 0px -30% 0px" });
  // Resolve the detail-page link. Every project that has a slug — either from
  // Sanity or matched by title to a bundled write-up — gets a working page.
  // The Sanity "Enable detail page" toggle only decides whether the page shows
  // custom CMS content or falls back to the bundled starter content; it never
  // removes the page itself.
  const fallbackSlug = detailSlugByTitle[project.title];
  const slug = project.slug || fallbackSlug;
  const detailHref = slug ? `/projects/${slug}` : null;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 1, y: 0, scale: 0.95 }}
      whileInView={{
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] }
      }}
      viewport={{ once: false, margin: "-30% 0px -30% 0px" }}
      className="group relative border-b border-white/5 py-6 md:py-8 px-4 md:px-6 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden"
    >
      {/* Cinematic Background Hover */}
      <div className="absolute inset-0 bg-white/[0.01] translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]" />
      <div className="absolute inset-y-0 left-0 w-1 bg-primary scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-bottom" />

      <div className="relative z-10 flex flex-col md:flex-row gap-4 md:gap-12 md:items-start">
        {/* Project Number */}
        <div className="text-xs font-sans font-medium text-primary/40 group-hover:text-primary transition-colors pt-1.5">
          {num}
        </div>

        <div className="flex-1">
          <div className="flex flex-col gap-3">
            <h3 className="text-2xl sm:text-3xl md:text-5xl font-display font-medium transition-all duration-500 group-hover:tracking-tight">
              {detailHref ? (
                <Link href={detailHref} className="cursor-pointer">
                  <ScrollRevealText
                    text={project.title}
                    isActive={isInView}
                    from="rgba(255, 255, 255, 0.1)"
                    to="hsl(11, 81%, 57%)"
                    characterClassName="group-hover:!text-foreground"
                  />
                </Link>
              ) : (
                <ScrollRevealText
                  text={project.title}
                  isActive={isInView}
                  from="rgba(255, 255, 255, 0.1)"
                  to="hsl(11, 81%, 57%)"
                  characterClassName="group-hover:!text-foreground"
                />
              )}
            </h3>

            <div className="flex flex-wrap gap-2">
              {(project.tech || []).map((t: string) => (
                <span key={t} className="text-[9px] font-sans text-muted-foreground uppercase tracking-[0.2em] px-2.5 py-0.5 bg-white/[0.03] border border-white/5 rounded-full group-hover:border-primary/20 transition-colors">
                  {t}
                </span>
              ))}
            </div>
          </div>

          <motion.div
            className="overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            whileInView={{ height: "auto", opacity: 1 }}
            viewport={{ once: false, margin: "-30% 0px -30% 0px" }}
            transition={{
              height: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
              opacity: { duration: 0.5, delay: 0.2 }
            }}
          >
            <p className="text-sm font-sans text-muted-foreground leading-relaxed pt-6 max-w-2xl">
              {project.description}
            </p>
          </motion.div>
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-4 self-end md:self-start pt-1.5">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, margin: "-30% 0px -30% 0px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center gap-3"
          >
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-2.5 py-1 text-muted-foreground hover:text-primary transition-all duration-300 hover:bg-white/[0.03] rounded-full border border-white/5 hover:border-primary/20 group/code"
                onClick={(e) => e.stopPropagation()}
              >
                <span className="text-[9px] font-sans font-semibold uppercase tracking-widest opacity-70 group-hover/code:opacity-100 transition-opacity">Code</span>
                <Github className="w-3.5 h-3.5" />
              </a>
            )}
            {project.live && project.live !== '#' && (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-2.5 py-1 text-muted-foreground hover:text-primary transition-all duration-300 hover:bg-white/[0.03] rounded-full border border-white/5 hover:border-primary/20 group/live"
                onClick={(e) => e.stopPropagation()}
              >
                <span className="text-[9px] font-sans font-semibold uppercase tracking-widest opacity-70 group-hover/live:opacity-100 transition-opacity">Live</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </motion.div>
          {detailHref ? (
            <Link
              href={detailHref}
              aria-label={`Read more about ${project.title}`}
              className="flex w-10 h-10 rounded-full border border-white/10 items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-background group-hover:border-primary transition-all duration-500 cursor-pointer"
            >
              <ArrowRight className="w-4 h-4 -rotate-45 group-hover:rotate-0 transition-transform duration-500" />
            </Link>
          ) : (
            <div className="hidden md:flex w-10 h-10 rounded-full border border-white/10 items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-background group-hover:border-primary transition-all duration-500">
              <ArrowRight className="w-4 h-4 -rotate-45 group-hover:rotate-0 transition-transform duration-500" />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
