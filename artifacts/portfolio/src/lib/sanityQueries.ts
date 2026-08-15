// ---------------------------------------------------------------------------
// GROQ queries + typed React Query hooks for each portfolio section.
// Every hook is read-only. Components use `data ?? fallback`, so an empty or
// unreachable Sanity leaves the site visually identical to the hardcoded version.
// ---------------------------------------------------------------------------
import { useQuery } from '@tanstack/react-query';
import { sanityFetch } from './sanity';

const STALE_TIME = 1000 * 60; // 1 min — content is not time-critical

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

export function useSanityProjects() {
  return useQuery({
    queryKey: ['sanity', 'projects'],
    queryFn: () => sanityFetch<SanityProject[]>(projectsQuery),
    staleTime: STALE_TIME,
    retry: 1,
  });
}

// ---------- Single project (detail / blog page) ----------
export interface SanityImage {
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
  // Portable Text blocks; typed loosely to avoid a hard dependency on internal types.
  body?: any[];
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

export function useSanityExperience() {
  return useQuery({
    queryKey: ['sanity', 'experience'],
    queryFn: () => sanityFetch<SanityExperience[]>(experienceQuery),
    staleTime: STALE_TIME,
    retry: 1,
  });
}

// ---------- Skills ----------
export interface SanitySkillGroup {
  category: string;
  items?: string[];
}

const skillsQuery = `*[_type == "skillGroup"]|order(order asc, _createdAt asc){
  category, items
}`;

export function useSanitySkills() {
  return useQuery({
    queryKey: ['sanity', 'skills'],
    queryFn: () => sanityFetch<SanitySkillGroup[]>(skillsQuery),
    staleTime: STALE_TIME,
    retry: 1,
  });
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

export function useSanityCertifications() {
  return useQuery({
    queryKey: ['sanity', 'certifications'],
    queryFn: () => sanityFetch<SanityCertification[]>(certsQuery),
    staleTime: STALE_TIME,
    retry: 1,
  });
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
