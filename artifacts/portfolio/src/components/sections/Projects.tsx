import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { Section } from '../layout/Section';
import { SectionHeading } from '../ui/SectionHeading';
import { ScrollRevealText } from '../ui/ScrollRevealText';
import { PillLink } from '../ui/PillLink';
import { ArrowRight, Github, ExternalLink } from 'lucide-react';
import { useSanityProjects, type SanityProject } from '../../lib/sanityQueries';
import { detailSlugByTitle, codeUrl, liveUrl } from '../../lib/projectsData';
import { rowEnter, expandOnView, slideInFromRight } from '../../lib/motion';
import { useRowInView } from '../../hooks/use-row-in-view';

export function Projects() {
  const projects = useSanityProjects();

  return (
    <Section id="projects">
      <SectionHeading num="04" title="Selected Works" />

      <div className="flex flex-col mt-16 max-w-5xl">
        {projects.map((project, idx) => (
          <ProjectRow key={project.title} project={project} index={idx} />
        ))}
      </div>
    </Section>
  );
}

function ProjectRow({ project, index }: { project: SanityProject, index: number }) {
  const num = (index + 1).toString().padStart(2, '0');
  const { ref, isInView } = useRowInView();
  // Resolve the detail-page link. Every project that has a slug — either from
  // Sanity or matched by title to a bundled write-up — gets a working page.
  // The Sanity "Enable detail page" toggle only decides whether the page shows
  // custom CMS content or falls back to the bundled starter content; it never
  // removes the page itself.
  const fallbackSlug = detailSlugByTitle[project.title];
  const slug = project.slug || fallbackSlug;
  const detailHref = slug ? `/projects/${slug}` : null;
  const code = codeUrl(project, slug);
  const live = liveUrl(project);
  const title = (
    <ScrollRevealText
      text={project.title}
      isActive={isInView}
      tone="primary"
      characterClassName="group-hover:!text-foreground"
    />
  );

  return (
    <motion.div
      ref={ref}
      id={slug ? `project-${slug}` : undefined}
      {...rowEnter}
      className="group relative border-b border-white/5 py-6 md:py-8 px-4 md:px-6 transition-all duration-700 ease-out-expo overflow-hidden"
    >
      {/* Cinematic Background Hover */}
      <div className="absolute inset-0 bg-white/[0.01] translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-out-expo" />
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
                  {title}
                </Link>
              ) : (
                title
              )}
            </h3>

            <div className="flex flex-wrap gap-2">
              {(project.tech || []).map((t) => (
                <span key={t} className="text-[9px] font-sans text-muted-foreground uppercase tracking-[0.2em] px-2.5 py-0.5 bg-white/[0.03] border border-white/5 rounded-full group-hover:border-primary/20 transition-colors">
                  {t}
                </span>
              ))}
            </div>
          </div>

          <motion.div className="overflow-hidden" {...expandOnView}>
            <p className="text-sm font-sans text-muted-foreground leading-relaxed pt-6 max-w-2xl">
              {project.description}
            </p>
          </motion.div>
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-4 self-end md:self-start pt-1.5">
          <motion.div {...slideInFromRight(0.2)} className="flex items-center gap-3">
            {code && <PillLink label="Code" icon={<Github />} href={code} />}
            {live && <PillLink label="Live" icon={<ExternalLink />} href={live} />}
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
