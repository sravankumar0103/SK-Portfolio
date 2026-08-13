// ---------------------------------------------------------------------------
// Fallback project data — used when Sanity is empty, loading, or unreachable.
//
// This mirrors the shape returned by the Sanity queries, so the list and the
// detail pages render identically whether content comes from the CMS or here.
// Once you fill a project in Sanity Studio (with real screenshots), the CMS
// version transparently takes over.
// ---------------------------------------------------------------------------
import type { SanityProject, SanityProjectDetail } from './sanityQueries';

// --- Tiny Portable Text builders so fallback bodies share the CMS render path.
const p = (text: string) => ({
  _type: 'block',
  style: 'normal',
  children: [{ _type: 'span', text }],
});
const h2 = (text: string) => ({
  _type: 'block',
  style: 'h2',
  children: [{ _type: 'span', text }],
});
const bullets = (items: string[]) =>
  items.map((text) => ({
    _type: 'block',
    style: 'normal',
    listItem: 'bullet',
    level: 1,
    children: [{ _type: 'span', text }],
  }));

// ---------- Card list (Selected Works) ----------
export const fallbackProjects: SanityProject[] = [
  {
    title: 'ArogyaLens',
    description:
      'An AI-powered medical document decoder designed to bridge the healthcare literacy gap. It utilizes OCR, LLMs, and TTS to instantly translate complex prescriptions and lab reports into ultra-simple, multilingual audio summaries with built-in drug safety checks.',
    tech: ['React', 'LLM APIs', 'OCR', 'OpenFDA'],
    github: 'https://github.com/sravankumar0103/ArogyaLens',
    live: '#',
    hasDetailPage: true,
    slug: 'arogyalens',
  },
  {
    title: 'CRM Dashboard - Nuzividu Mangoes',
    description:
      'A comprehensive, full-stack Customer Relationship Management (CRM) platform built as a freelance project for Nuzividu Mangoes. It digitizes the end-to-end sales pipeline—handling leads, follow-ups, inventory, and finances—while featuring integrated analytics and AI-driven campaign tools.',
    tech: ['React', 'TypeScript', 'Express.js', 'Supabase'],
    github: 'https://github.com/sravankumar0103/AdminDashboard-NuzividuMangoes',
    live: '#',
    hasDetailPage: true,
    slug: 'crm-nuzividu',
  },
  {
    title: 'VaultIX',
    description:
      'Secure Bookmark & Knowledge Management platform designed for efficient information storage and retrieval. Features real-time synchronization, advanced search filtering, integrated analytics, and automated notification systems.',
    tech: ['Next.js', 'React', 'Supabase', 'PostgreSQL'],
    github: 'https://github.com/sravankumar0103/VaultIX',
    live: 'https://vaultix-sk.vercel.app/',
    hasDetailPage: true,
    slug: 'vaultix',
  },
  {
    title: 'Hexapod Robotic Arm',
    description:
      'Integrated a robotic arm into a 16-DOF hexapod robot for real-time object manipulation and automated task execution. Utilized AI, ML, and Computer Vision for adaptive autonomous behavior. Included an AR-based interface for real-time visualization.',
    tech: ['Python', 'OpenCV', 'TensorFlow', 'Raspberry Pi 5'],
    github: 'https://github.com/sravankumar0103',
    live: '#',
    hasDetailPage: true,
    slug: 'hexapod-robotic-arm',
  },
  {
    title: 'Python Utilities',
    description:
      'Suite of Python utility applications focusing on logic and automation: Word Counter, Expense Tracker, and a Username Generator.',
    tech: ['Python', 'Automation Scripts'],
    github: 'https://github.com/sravankumar0103',
    live: '#',
    hasDetailPage: true,
    slug: 'python-utilities',
  },
  {
    title: 'Web App Suite',
    description:
      'A collection of interactive web applications built during virtual internship, including a responsive landing page, Tic-Tac-Toe game, and a Stopwatch tool.',
    tech: ['HTML5', 'CSS3', 'JavaScript'],
    github: 'https://github.com/sravankumar0103',
    live: '#',
    hasDetailPage: true,
    slug: 'web-app-suite',
  },
];

// Title → detail slug lookup. Lets projects coming from Sanity (which may not
// yet have the slug/hasDetailPage fields filled in) still resolve to a detail
// page by matching their title against the bundled data.
export const detailSlugByTitle: Record<string, string> = Object.fromEntries(
  fallbackProjects
    .filter((p) => p.hasDetailPage && p.slug)
    .map((p) => [p.title, p.slug as string]),
);

// ---------- Detail pages (blog), keyed by slug ----------
export const fallbackProjectDetails: Record<string, SanityProjectDetail> = {
  arogyalens: {
    title: 'ArogyaLens',
    description:
      'An AI-powered medical document decoder designed to bridge the healthcare literacy gap.',
    tech: ['React', 'LLM APIs', 'OCR', 'OpenFDA', 'TTS'],
    github: 'https://github.com/sravankumar0103/ArogyaLens',
    live: '#',
    slug: 'arogyalens',
    role: 'Full-Stack & AI Developer',
    overview:
      'ArogyaLens turns confusing prescriptions and lab reports into simple, spoken summaries anyone can understand — in their own language — with built-in drug safety checks.',
    body: [
      h2('The problem'),
      p(
        'Medical documents are written for clinicians, not patients. Prescriptions and lab reports are full of abbreviations, dosages, and jargon that leave many people unsure of what they are actually taking or what their results mean — a gap that is even wider for non-English speakers.',
      ),
      h2('What it does'),
      p(
        'ArogyaLens reads a photo or scan of a medical document and translates it into an ultra-simple, multilingual audio summary. It combines OCR to extract the text, LLMs to interpret and simplify it, and text-to-speech to read it back, so understanding your health does not depend on literacy or language.',
      ),
      ...bullets([
        'OCR extraction of printed and handwritten medical text',
        'LLM-driven simplification into plain, everyday language',
        'Multilingual audio summaries via text-to-speech',
        'Drug safety checks powered by the OpenFDA data set',
      ]),
      h2('How it works'),
      p(
        'The document image is passed through an OCR layer to recover raw text. That text is sent to an LLM with prompts tuned for medical simplification, which returns a clean, structured explanation. Detected medications are cross-referenced against OpenFDA for interaction and safety warnings, and the final summary is converted to speech in the user’s chosen language.',
      ),
    ],
    outcomes: [
      'Makes complex prescriptions understandable in seconds',
      'Multilingual, audio-first design for low-literacy accessibility',
      'Automated drug-safety flags using OpenFDA',
    ],
  },

  'crm-nuzividu': {
    title: 'CRM Dashboard — Nuzividu Mangoes',
    description:
      'A full-stack CRM platform built as a freelance project to digitize an end-to-end sales pipeline.',
    tech: ['React', 'TypeScript', 'Express.js', 'Supabase'],
    github: 'https://github.com/sravankumar0103/AdminDashboard-NuzividuMangoes',
    slug: 'crm-nuzividu',
    client: 'Nuzividu Mangoes (Freelance)',
    role: 'Full-Stack Developer',
    overview:
      'A comprehensive CRM built for a mango business to replace scattered spreadsheets and manual tracking with a single platform for leads, inventory, and finances. As a private client system, it is showcased here through its features and workflow rather than a public live link.',
    body: [
      h2('Context'),
      p(
        'Nuzividu Mangoes needed to move off manual, spreadsheet-based tracking. The goal was a single, reliable platform that digitizes the entire sales pipeline — from first lead to fulfilled order and reconciled finances.',
      ),
      h2('What it does'),
      p(
        'The dashboard manages the full customer lifecycle and connects it to inventory and finance, with analytics on top so the business can see what is happening at a glance.',
      ),
      ...bullets([
        'Lead capture and follow-up tracking across the sales pipeline',
        'Inventory management tied to orders',
        'Finance and payment tracking',
        'Integrated analytics dashboards',
        'AI-driven campaign / outreach tools',
      ]),
      h2('How it works'),
      p(
        'The frontend is a React + TypeScript single-page app talking to an Express.js API, with Supabase (Postgres) as the data layer for storage, auth, and real-time updates. The architecture keeps sales, inventory, and finance as connected modules so a change in one — an order placed, a payment received — flows through to the others.',
      ),
      h2('Why there is no public demo'),
      p(
        'This is real client software containing business data, so it is not publicly hosted. The screenshots and write-up here are the intended way to explore it. A guided walkthrough is available on request.',
      ),
    ],
    outcomes: [
      'Replaced manual spreadsheets with one connected platform',
      'End-to-end pipeline: leads → inventory → finance',
      'Delivered as a real, paid freelance engagement',
    ],
  },

  vaultix: {
    title: 'VaultIX',
    description:
      'A secure bookmark and knowledge-management platform for fast information storage and retrieval.',
    tech: ['Next.js', 'React', 'Supabase', 'PostgreSQL'],
    github: 'https://github.com/sravankumar0103/VaultIX',
    live: 'https://vaultix-sk.vercel.app/',
    slug: 'vaultix',
    role: 'Full-Stack Developer',
    overview:
      'VaultIX is a knowledge vault for the bookmarks, notes, and links you actually want to find again — with real-time sync, powerful search, and analytics so nothing gets lost.',
    body: [
      h2('The idea'),
      p(
        'Saved links pile up and become impossible to search. VaultIX treats bookmarks as a searchable knowledge base rather than a dumping ground, so information is easy to store and just as easy to retrieve.',
      ),
      h2('Features'),
      ...bullets([
        'Real-time synchronization across sessions and devices',
        'Advanced search and filtering',
        'Integrated usage analytics',
        'Automated notification system',
      ]),
      h2('How it works'),
      p(
        'Built on Next.js and React with Supabase and PostgreSQL as the backend. Supabase provides auth, storage, and real-time subscriptions, which drive the instant sync, while Postgres powers the structured search and filtering.',
      ),
    ],
    outcomes: [
      'Live and publicly usable',
      'Real-time sync with fast, filtered search',
      'Analytics and notifications built in',
    ],
  },

  'hexapod-robotic-arm': {
    title: 'Hexapod Robotic Arm',
    description:
      'A robotic arm integrated into a 16-DOF hexapod robot for real-time object manipulation.',
    tech: ['Python', 'OpenCV', 'TensorFlow', 'Raspberry Pi 5'],
    github: 'https://github.com/sravankumar0103',
    slug: 'hexapod-robotic-arm',
    role: 'Robotics & Computer Vision',
    overview:
      'A robotic arm mounted on a 16-degree-of-freedom hexapod, using computer vision and machine learning for adaptive, autonomous object manipulation — with an AR interface for real-time visualization.',
    body: [
      h2('Overview'),
      p(
        'This project integrates a robotic arm into a 16-DOF hexapod platform so the robot can move through its environment and physically manipulate objects, combining locomotion and manipulation in one system.',
      ),
      h2('How it works'),
      p(
        'Computer vision (OpenCV) and machine-learning models (TensorFlow) let the robot perceive its surroundings and adapt its behavior rather than following a fixed script. The control stack runs on a Raspberry Pi 5, and an augmented-reality interface visualizes what the robot sees and plans in real time.',
      ),
      ...bullets([
        '16 degrees of freedom for flexible locomotion',
        'Real-time object detection and manipulation',
        'AI/ML-driven adaptive, autonomous behavior',
        'AR-based interface for live visualization',
      ]),
    ],
    outcomes: [
      'Unified locomotion and manipulation on one platform',
      'Adaptive autonomy via computer vision + ML',
      'AR visualization of perception and planning',
    ],
  },

  'python-utilities': {
    title: 'Python Utilities',
    description: 'A suite of Python utility apps focused on logic and everyday automation.',
    tech: ['Python', 'Automation Scripts'],
    github: 'https://github.com/sravankumar0103',
    slug: 'python-utilities',
    role: 'Developer',
    overview:
      'A collection of small, practical Python tools built to sharpen core programming logic and automate everyday tasks.',
    body: [
      h2('What’s inside'),
      ...bullets([
        'Word Counter — text analysis and counting',
        'Expense Tracker — logging and summarizing spending',
        'Username Generator — rule-based name generation',
      ]),
      h2('Purpose'),
      p(
        'Each utility is a focused exercise in clean logic and automation — small in scope, but a solid foundation in problem-solving and Python fundamentals.',
      ),
    ],
    outcomes: ['Three focused, working utilities', 'Emphasis on clean logic and automation'],
  },

  'web-app-suite': {
    title: 'Web App Suite',
    description:
      'A collection of interactive web applications built during a virtual internship.',
    tech: ['HTML5', 'CSS3', 'JavaScript'],
    github: 'https://github.com/sravankumar0103',
    slug: 'web-app-suite',
    role: 'Frontend Developer (Internship)',
    overview:
      'A set of interactive web apps built during a virtual internship, covering layout, interactivity, and state — the fundamentals of frontend development.',
    body: [
      h2('What’s inside'),
      ...bullets([
        'A responsive landing page',
        'A playable Tic-Tac-Toe game',
        'A functional Stopwatch tool',
      ]),
      h2('Focus'),
      p(
        'Built with vanilla HTML, CSS, and JavaScript to practice responsive layout, DOM interaction, and simple state management from the ground up — no frameworks.',
      ),
    ],
    outcomes: ['Hands-on frontend fundamentals', 'Responsive, interactive, framework-free'],
  },
};
