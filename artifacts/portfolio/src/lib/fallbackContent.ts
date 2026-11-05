// ---------------------------------------------------------------------------
// Fallback content for the small Sanity-backed sections — used when Sanity is
// empty, loading, or unreachable. The hooks in sanityQueries.ts apply these, so
// a component never writes its own `data ?? fallback`. Project fallbacks live
// next to their (much larger) write-ups in projectsData.ts.
//
// Each array is typed with its Sanity interface, so a fallback that drifts from
// the shape the CMS returns is a typecheck failure.
// ---------------------------------------------------------------------------
import type {
  SanityCertification,
  SanityExperience,
  SanitySkillGroup,
  SanitySocial,
} from './sanityQueries';

export const fallbackSkills: SanitySkillGroup[] = [
  {
    category: "Languages",
    items: ["Python", "Java", "SQL", "JavaScript", "HTML5", "CSS3"]
  },
  {
    category: "Frameworks & Libraries",
    items: ["Next.js", "React", "TensorFlow", "OpenCV", "Bootstrap", "Tailwind CSS"]
  },
  {
    category: "Tools & Infrastructure",
    items: ["Git", "Supabase", "PostgreSQL", "Tableau", "Raspberry Pi", "Vercel"]
  }
];

export const fallbackCertifications: SanityCertification[] = [
  {
    name: "Google Cybersecurity",
    issuer: "Google / Coursera",
    date: "2024",
    link: "https://www.coursera.org/account/accomplishments/professional-cert/HZXL29HPYAK2"
  },
  {
    name: "Machine Learning & Artificial Intelligence",
    issuer: "IBM",
    date: "2023"
  },
  {
    name: "Machine Learning, Data Engineering, Cloud Architecting",
    issuer: "AWS Academy",
    date: "2023"
  }
];

export const fallbackExperience: SanityExperience[] = [
  {
    role: "Python Programming Intern",
    company: "MotionCut",
    date: "Jan 2025 – Feb 2025",
    description: "Automated real-world tasks with Python resulting in a 30% effort reduction. Solved 10+ problem statements."
  },
  {
    role: "Web Development Intern",
    company: "Prodigy InfoTech",
    date: "Jun 2024 – Jul 2024",
    description: "Built 3+ responsive web apps with HTML/CSS/JS. Collaborated effectively within a 5+ member team."
  }
];

export const FALLBACK_EMAIL = 'sravankumar0103@gmail.com';

export const fallbackSocials: SanitySocial[] = [
  { platform: 'github', url: 'https://github.com/sravankumar0103' },
  { platform: 'linkedin', url: 'https://linkedin.com/in/diddi-sravan-kumar' },
];
