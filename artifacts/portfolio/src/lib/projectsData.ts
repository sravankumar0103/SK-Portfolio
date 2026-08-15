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
const h3 = (text: string) => ({
  _type: 'block',
  style: 'h3',
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
    live: 'https://arogyalens.vercel.app/',
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
      'An AI health companion that turns a photo of a prescription into a simple spoken explanation.',
    tech: ['React 19', 'Vite', 'FastAPI', 'Google Gemini', 'Supabase', 'gTTS', 'OpenFDA'],
    github: 'https://github.com/sravankumar0103/ArogyaLens',
    live: 'https://arogyalens.vercel.app/',
    slug: 'arogyalens',
    client: 'AI Health Companion',
    role: 'Full-Stack & AI Developer',
    overview:
      'ArogyaLens turns a photo of a prescription, medicine strip, or lab report into a simple explanation you can read or hear — in your own language. It is built for elderly and rural users who struggle to read medical documents.',
    body: [
      h2('The problem'),
      p(
        'Medical documents are written for doctors, not patients. Prescriptions and lab reports are full of abbreviations, dosages, and jargon that leave people unsure of what they are taking or what their results mean. For elderly and rural users — and anyone who does not read English easily — that gap can be dangerous.',
      ),
      h2('What it does'),
      p(
        'Point the camera at a medical document and ArogyaLens identifies it, explains it in plain language, and reads it aloud. The explanation covers what the medicine is for, the dosage, how often to take it, instructions, and side effects.',
      ),
      ...bullets([
        'Scan by camera or upload, with automatic document classification',
        'Plain-language explanation of purpose, dosage, frequency, and side effects',
        'Multilingual — English, Hindi, and Telugu',
        'Text-to-speech playback for users who cannot read the text',
        'Drug-interaction warnings and safety guidance',
        'Mobile OTP login with personal health profiles and scan history',
        'Export and share results as PDF or image',
      ]),
      h2('How it works'),
      p(
        'The pipeline is: capture image → Google Gemini identifies the medicine and drafts an explanation → a curated medical knowledge base validates the clinical facts → results are cached → the app renders a clean summary with audio. NVIDIA NIM vision acts as a fallback for reliability.',
      ),
      h3('Safety-first by design'),
      p(
        'The most important decision: the AI is only allowed to identify the medicine — it never invents dosages. All clinical information comes from a verified knowledge base, and drug interactions are checked against the OpenFDA database. This keeps the advice consistent and prevents AI hallucinations on something as sensitive as medication.',
      ),
      h2('Tech stack'),
      ...bullets([
        'Frontend: React 19 + Vite (deployed on Vercel)',
        'Backend: Python FastAPI, running serverless',
        'AI: Google Gemini for vision + reasoning, gTTS for speech, NVIDIA NIM as fallback',
        'Data: Supabase (PostgreSQL) for profiles, history, and caching',
        'Safety: OpenFDA drug-interaction database',
      ]),
    ],
    outcomes: [
      'Understands a prescription in seconds — no medical knowledge needed',
      'Audio-first and multilingual (English, Hindi, Telugu) for low-literacy access',
      'Verified knowledge base prevents the AI from inventing dosages',
      'Automatic drug-interaction safety checks via OpenFDA',
    ],
  },

  'crm-nuzividu': {
    title: 'CRM Dashboard — Nuzividu Mangoes',
    description:
      'A full-stack CRM built as a freelance project to digitize an end-to-end sales pipeline.',
    tech: ['React', 'TypeScript', 'Express.js', 'Supabase', 'TanStack Query', 'Recharts', 'jsPDF'],
    github: 'https://github.com/sravankumar0103/AdminDashboard-NuzividuMangoes',
    slug: 'crm-nuzividu',
    client: 'Nuzividu Mangoes (Freelance)',
    role: 'Full-Stack Developer',
    timeline: 'Jan 2025 – Apr 2025',
    overview:
      'A comprehensive CRM built for a mango business to replace scattered spreadsheets with a single platform for leads, inventory, and finances. As private client software it is showcased here through its features and screenshots rather than a public link.',
    body: [
      h2('Context'),
      p(
        'Nuzividu Mangoes was running its sales on manual spreadsheets. The goal was one reliable platform that digitizes the whole pipeline — from first lead to fulfilled order and reconciled finances — with analytics on top.',
      ),
      h2('What it does'),
      p(
        'The dashboard manages the full customer lifecycle and connects it to inventory and finance, so a change in one place flows through to the rest.',
      ),
      ...bullets([
        'Lead capture and follow-up tracking across the sales pipeline',
        'Inventory management tied to orders',
        'Finance and payment tracking',
        'Interactive analytics dashboards (charts and trends)',
        'AI-driven campaign and outreach tools',
        'One-click PDF invoices and report exports',
      ]),
      h2('How it works'),
      p(
        'The frontend is a React + TypeScript single-page app (Vite) backed by an Express.js server, with Supabase (PostgreSQL) as the data layer for storage, auth, and real-time updates. TanStack Query handles server state, React Hook Form + Zod power validated forms, Recharts drives the analytics, and jsPDF generates exports.',
      ),
      h2('Why there is no public demo'),
      p(
        'This is real client software containing business data, so it is not publicly hosted. The screenshots and write-up here are the intended way to explore it — a guided walkthrough is available on request.',
      ),
    ],
    outcomes: [
      'Replaced manual spreadsheets with one connected platform',
      'End-to-end pipeline: leads → inventory → finance',
      'Built-in analytics and one-click PDF exports',
      'Delivered as a real, paid freelance engagement',
    ],
  },

  vaultix: {
    title: 'VaultIX',
    description:
      'A secure bookmark and knowledge-management platform for fast, private information retrieval.',
    tech: ['Next.js 16', 'React 19', 'Tailwind CSS 4', 'Supabase', 'Framer Motion', 'Recharts'],
    github: 'https://github.com/sravankumar0103/VaultIX',
    live: 'https://vaultix-sk.vercel.app/',
    slug: 'vaultix',
    role: 'Full-Stack Developer',
    overview:
      'VaultIX centralizes your links, documents, and media into one fast, secure knowledge base — with intelligent organization, millisecond search, and a motion-rich premium interface.',
    body: [
      h2('The idea'),
      p(
        'Saved links pile up until they are impossible to find. VaultIX treats bookmarks as a searchable knowledge base rather than a dumping ground, with speed, security, and a polished experience as the priorities.',
      ),
      h2('Features'),
      ...bullets([
        'Intelligent indexing — automatic metadata extraction and categorization',
        'Smart search with intent recognition for millisecond retrieval',
        'Privacy-first: secure Google auth, data sovereignty, and permanent deletion',
        'Visual analytics tracking collection trends',
        'Motion-heavy premium UI with adaptive theming',
        'Automated onboarding and account-status emails',
      ]),
      h2('How it works'),
      p(
        'VaultIX is built on Next.js 16 (App Router, React 19) with Supabase for auth and database. A custom theme engine syncs preferences across sessions, Nodemailer (Gmail SMTP) handles lifecycle emails, and jsPDF with html2canvas powers export. It is deployed on Vercel and running in production.',
      ),
    ],
    outcomes: [
      'Live and publicly usable, MIT licensed',
      'Millisecond full-text search with intent recognition',
      'Privacy-first with a permanent-deletion policy',
      'Automated email lifecycle and visual analytics',
    ],
  },

  'hexapod-robotic-arm': {
    title: 'Hexapod Robotic Arm',
    description:
      'A robotic arm integrated into a 16-DOF hexapod robot for real-time object manipulation.',
    tech: ['Python', 'OpenCV', 'TensorFlow', 'Raspberry Pi 5', 'AR'],
    github: 'https://github.com/sravankumar0103',
    slug: 'hexapod-robotic-arm',
    role: 'Robotics & Computer Vision',
    overview:
      'A robotic arm mounted on a 16-degree-of-freedom hexapod, using computer vision and machine learning for adaptive, autonomous object manipulation — with an AR interface for real-time visualization.',
    body: [
      h2('Overview'),
      p(
        'This project integrates a robotic arm into a 16-DOF hexapod platform, combining locomotion and manipulation in one system so the robot can move through its environment and physically handle objects.',
      ),
      h2('How it works'),
      p(
        'Computer vision (OpenCV) and machine-learning models (TensorFlow) let the robot perceive its surroundings and adapt rather than follow a fixed script. The control stack runs on a Raspberry Pi 5, and an augmented-reality interface visualizes what the robot sees and plans in real time.',
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
    tech: ['Python'],
    github: 'https://github.com/sravankumar0103',
    slug: 'python-utilities',
    role: 'Developer',
    overview:
      'A collection of small, practical Python tools built to sharpen core programming logic and automate everyday tasks.',
    body: [
      h2('What’s inside'),
      ...bullets([
        'Word Counter — analyzes text and counts words and characters',
        'Expense Tracker — logs spending and summarizes it',
        'Username Generator — rule-based unique username creation',
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
      'A set of interactive web apps built during a virtual internship, covering layout, interactivity, and state — the fundamentals of frontend development, built without frameworks.',
    body: [
      h2('What’s inside'),
      ...bullets([
        'Responsive landing page — mobile-first layout and styling',
        'Tic-Tac-Toe — a playable game with win detection',
        'Stopwatch — a functional timer with start, stop, and reset',
      ]),
      h2('Focus'),
      p(
        'Built with vanilla HTML, CSS, and JavaScript to practice responsive layout, DOM interaction, and simple state management from the ground up — no frameworks, just fundamentals.',
      ),
    ],
    outcomes: ['Hands-on frontend fundamentals', 'Responsive, interactive, framework-free'],
  },
};
