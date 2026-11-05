// ---------------------------------------------------------------------------
// GROQ queries + typed React Query hooks for each portfolio section.
// Every hook is read-only. The four list hooks apply their own fallback and
// return `T[]` (never `undefined`), so an empty, loading or unreachable Sanity
// leaves the site visually identical to the hardcoded version and a component
// cannot forget one. Fallbacks live in fallbackContent.ts and projectsData.ts.
// ---------------------------------------------------------------------------
import { useQuery } from '@tanstack/react-query';
import type { PortableTextBlock } from '@portabletext/react';
import { sanityFetch } from './sanity';
import { fallbackProjects } from './projectsData';
import {
  fallbackCertifications,
  fallbackExperience,
  fallbackSkills,
} from './fallbackContent';

const STALE_TIME = 1000 * 60; // 1 min — content is not time-critical

// `primary` when it has at least one item, else `fallback`. The one place the
// "empty means fall back" rule is written; sections and resolveDetail import it.
export function orFallback<T>(primary: T[] | null | undefined, fallback: T[]): T[];
export function orFallback<T>(
  primary: T[] | null | undefined,
  fallback: T[] | undefined,
): T[] | undefined;
export function orFallback<T>(
  primary: T[] | null | undefined,
  fallback: T[] | undefined,
): T[] | undefined {
  return primary && primary.length ? primary : fallback;
}

// A list query that resolves to its fallback while loading, on error, and when
// Sanity returns an empty list.
function useSanityList<T>(key: string, query: string, fallback: T[]): T[] {
  const { data } = useQuery({
    queryKey: ['sanity', key],
    queryFn: () => sanityFetch<T[]>(query),
    staleTime: STALE_TIME,
    retry: 1,
  });
  return orFallback(data, fallback);
}

// ---------- Projects ----------
export interface SanityProject {
  title: string;
  description: string;
  tech?: string[];
  github?: string;
  live?: string;
  imageUrl?: string;
  hasDetailPage?: boolean;
  slug?: string;
}

const projectsQuery = `*[_type == "project" && visible != false]|order(order asc, _createdAt asc){
  title, description, tech, github, live, "imageUrl": image.asset->url,
  hasDetailPage, "slug": slug.current
}`;

export function useSanityProjects(): SanityProject[] {
  return useSanityList('projects', projectsQuery, fallbackProjects);
}

// ---------- Single project (detail / blog page) ----------
export interface SanityImage {
  url?: string;
  caption?: string;
}

// An image member of `body`: the projection maps it to `{ _type, url, caption }`, no `children`.
export interface SanityBodyImage {
  _type: 'image';
  _key?: string;
  url?: string;
  caption?: string;
}

export interface SanityProjectDetail {
  title: string;
  description: string;
  tech?: string[];
  github?: string;
  live?: string;
  slug?: string;
  overview?: string;
  client?: string;
  clientLabel?: string; // Overrides the "Client" heading (e.g. "Institution") per project.
  role?: string;
  timeline?: string;
  coverImageUrl?: string;
  // Portable Text blocks, plus image members as the GROQ projection below returns them.
  body?: Array<PortableTextBlock | SanityBodyImage>;
  gallery?: SanityImage[];
  outcomes?: string[];
}

const projectDetailQuery = `*[_type == "project" && slug.current == $slug && hasDetailPage == true][0]{
  title, description, tech, github, live, "slug": slug.current,
  overview, client, clientLabel, role, timeline,
  "coverImageUrl": coverImage.asset->url,
  body[]{
    ...,
    _type == "image" => { "url": asset->url, caption }
  },
  "gallery": gallery[]{ "url": asset->url, caption },
  outcomes
}`;

export function useSanityProject(slug: string | undefined) {
  return useQuery({
    queryKey: ['sanity', 'project', slug],
    queryFn: () => sanityFetch<SanityProjectDetail | null>(projectDetailQuery, { slug: slug! }),
    enabled: !!slug,
    staleTime: STALE_TIME,
    retry: 1,
  });
}

// ---------- Experience ----------
export interface SanityExperience {
  role: string;
  company: string;
  date?: string;
  description?: string;
}

const experienceQuery = `*[_type == "experience"]|order(order asc, _createdAt asc){
  role, company, date, description
}`;

export function useSanityExperience(): SanityExperience[] {
  return useSanityList('experience', experienceQuery, fallbackExperience);
}

// ---------- Skills ----------
export interface SanitySkillGroup {
  category: string;
  items?: string[];
}

const skillsQuery = `*[_type == "skillGroup"]|order(order asc, _createdAt asc){
  category, items
}`;

export function useSanitySkills(): SanitySkillGroup[] {
  return useSanityList('skills', skillsQuery, fallbackSkills);
}

// ---------- Certifications ----------
export interface SanityCertification {
  name: string;
  issuer?: string;
  date?: string;
  link?: string;
}

const certsQuery = `*[_type == "certification"]|order(order asc, _createdAt asc){
  name, issuer, date, link
}`;

export function useSanityCertifications(): SanityCertification[] {
  return useSanityList('certifications', certsQuery, fallbackCertifications);
}

// ---------- Site Settings (Hero / About / Resume / Contact) ----------
export interface SanitySocial {
  platform?: string;
  url?: string;
}

export interface SanitySiteSettings {
  heroFirstName?: string;
  heroLastName?: string;
  heroRole?: string;
  heroLocation?: string;
  aboutPara1?: string;
  aboutHighlight?: string;
  aboutPara2?: string;
  statCgpa?: string;
  statProjects?: string;
  statCertifications?: string;
  statExperience?: string;
  resumeFileUrl?: string;
  resumeUrl?: string;
  contactEmail?: string;
  socials?: SanitySocial[];
}

const siteSettingsQuery = `*[_id == "siteSettings"][0]{
  heroFirstName, heroLastName, heroRole, heroLocation,
  aboutPara1, aboutHighlight, aboutPara2,
  statCgpa, statProjects, statCertifications, statExperience,
  "resumeFileUrl": resumeFile.asset->url, resumeUrl,
  contactEmail, socials
}`;

export function useSanitySiteSettings() {
  return useQuery({
    queryKey: ['sanity', 'siteSettings'],
    queryFn: () => sanityFetch<SanitySiteSettings | null>(siteSettingsQuery),
    staleTime: STALE_TIME,
    retry: 1,
  });
}
