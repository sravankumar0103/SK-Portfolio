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
      'A six-legged robot with an integrated servo-driven robotic arm for real-time pick-and-place. Controlled wirelessly over Bluetooth from an ESP32, with an AI/ML layer that adapts gait and grip to terrain and objects, plus an AR interface for visualization. Final-year B.Tech AI major project.',
    tech: ['ESP32', 'Servo Motors', 'Arduino / C++', 'AI / ML', 'AR'],
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
    role: 'Full-Stack & AI Developer',
    overview:
      'ArogyaLens turns a photo of a prescription, medicine strip, or lab report into a simple explanation you can read or hear — in your own language. It is built for elderly and rural users who struggle to read medical documents.',
    body: [
      h2('The problem'),
      p(
        'Medical documents are written for doctors, not patients. Prescriptions and lab reports are full of abbreviations, dosages, and jargon that leave people unsure of what they are taking or what their results mean. For elderly and rural users — and anyone who does not read English easily — that gap can be dangerous.',
      ),
      p(
        'The stakes are not abstract. A misread dosage, an unnoticed drug interaction, or an expired medicine can cause real harm. ArogyaLens exists to close that comprehension gap the moment a document is in someone’s hands — without needing a doctor, a pharmacist, or the ability to read English.',
      ),

      h2('What it does'),
      p(
        'Point the camera at a medical document and ArogyaLens identifies it, explains it in plain language, and reads it aloud. It auto-detects whether it is looking at a medicine strip, a prescription, or a lab report, then tailors the explanation — covering what the medicine is for, the dosage, how often to take it, instructions, and side effects.',
      ),
      h3('Core capabilities'),
      ...bullets([
        'Document scanning by camera capture or file upload, with automatic document-type detection (medicine, prescription, lab report)',
        'Plain-language explanations of purpose, dosage, frequency, instructions, and side effects',
        'Multilingual output — English, Hindi, and Telugu',
        'Audio playback (text-to-speech) so users who cannot read the text can still understand it',
        'Safety intelligence — drug-interaction warnings, expiry dates, and storage guidance',
        'Verified medicine knowledge base — no hallucinated dosages',
      ]),
      h3('Accounts and history'),
      ...bullets([
        'Mobile OTP login with personal health profiles',
        'Cloud scan history — past scans are stored and retrievable',
        'Export and share any result as a PDF or image',
      ]),

      h2('How it works'),
      p(
        'The processing flow is a deliberate pipeline: image input → Google Gemini identifies the medicine and drafts an explanation → a verified knowledge base and safety layer validate the clinical facts → a universal cache stores the result → the app renders a clean card UI with audio output.',
      ),
      h3('Architecture'),
      ...bullets([
        'Frontend: a React 19 + Vite single-page app, hosted on Vercel',
        'Backend: a Python FastAPI service running as Vercel serverless functions',
        'Knowledge base, cache, and safety checks live server-side, keeping clinical logic off the client',
        'A universal cache means repeat scans of a common medicine return instantly instead of re-querying the AI',
      ]),
      h3('Resilience'),
      p(
        'AI vision can fail on a blurry photo or a rate limit. NVIDIA NIM vision serves as an automatic fallback, so identification keeps working even when the primary model is unavailable — the user never sees a dead end.',
      ),

      h3('Safety-first by design'),
      p(
        'The most important decision: the AI is only allowed to identify the medicine — it never invents dosages. All clinical information comes from a verified knowledge base, and drug interactions are checked against the OpenFDA database. This keeps the advice consistent and prevents AI hallucinations on something as sensitive as medication.',
      ),

      h2('Tech stack'),
      ...bullets([
        'Frontend: React 19 + Vite (deployed on Vercel)',
        'Backend: Python FastAPI, running serverless on Vercel',
        'AI: Google Gemini for vision + reasoning, Google gTTS for speech synthesis, NVIDIA NIM as fallback',
        'Data: Supabase (PostgreSQL) for profiles, scan history, and the universal cache',
        'Safety: OpenFDA drug-interaction database',
      ]),
    ],
    outcomes: [
      'Understands a prescription in seconds — no medical knowledge needed',
      'Audio-first and multilingual (English, Hindi, Telugu) for low-literacy access',
      'Verified knowledge base prevents the AI from inventing dosages',
      'Automatic drug-interaction safety checks via OpenFDA',
      'Resilient by design — NVIDIA NIM fallback keeps scanning working when the primary model fails',
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
    timeline: 'May 2025',
    overview:
      'A comprehensive CRM built for a mango business to replace scattered spreadsheets with a single platform for leads, inventory, and finances. As private client software it is showcased here through its features and screenshots rather than a public link.',
    body: [
      h2('Context'),
      p(
        'Nuzividu Mangoes was running its sales on manual spreadsheets. Leads lived in one file, stock in another, and payments in a third — nothing reconciled, and nothing gave a live picture of the business. The goal was one reliable platform that digitizes the whole pipeline — from first lead to fulfilled order and reconciled finances — with analytics on top.',
      ),

      h2('What it does'),
      p(
        'The dashboard manages the full customer lifecycle and connects it to inventory and finance, so a change in one place flows through to the rest — an order dropping stock, a payment closing a lead, a shipment updating a customer’s record.',
      ),

      h3('Sales & CRM'),
      ...bullets([
        'Lead capture with source tracking',
        'Follow-up scheduling and status tracking across the pipeline',
        'Full customer lifecycle from first contact to repeat order',
      ]),
      h3('Inventory & orders'),
      ...bullets([
        'Inventory management tied directly to orders',
        'Stock levels that update as orders are placed and fulfilled',
      ]),
      h3('Finance'),
      ...bullets([
        'Payment and finance tracking against each order',
        'One-click PDF invoices and report exports',
      ]),
      h3('Intelligence'),
      ...bullets([
        'Interactive analytics dashboards with charts and trends',
        'AI-driven campaign and outreach tools',
      ]),

      h2('How it works'),
      p(
        'The frontend is a React + TypeScript single-page app (Vite) backed by an Express.js server, with Supabase (PostgreSQL) as the data layer for storage, auth, and real-time updates.',
      ),
      h3('Engineering choices'),
      ...bullets([
        'TanStack Query manages server state and keeps the UI in sync with the database',
        'React Hook Form + Zod give every form typed, schema-validated input',
        'Recharts powers the analytics dashboards',
        'jsPDF generates invoices and report exports on demand',
        'TypeScript end-to-end for type safety across the client and server',
      ]),

      h2('Why there is no public demo'),
      p(
        'This is real client software containing live business data, so it is not publicly hosted. The screenshots and write-up here are the intended way to explore it — a guided walkthrough is available on request.',
      ),
    ],
    outcomes: [
      'Replaced manual spreadsheets with one connected platform',
      'End-to-end pipeline: leads → inventory → finance, all reconciled in real time',
      'Built-in analytics and one-click PDF exports',
      'Type-safe, schema-validated data entry across the app',
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
        'Intelligent indexing — automatic metadata extraction and categorization powered by a context-aware architecture',
        'Smart search — full-text retrieval that locates resources within milliseconds',
        'Privacy-focused authentication — secure Google sign-in with data sovereignty',
        'Data deletion policy — permanent, irreversible removal of user information',
        'Visual analytics — interactive charts for collection insights and trend analysis',
        'Premium interface — motion-driven design with animations and adaptive theming',
        'Automated email system — onboarding and account-status notifications',
      ]),

      h2('How it works'),
      p(
        'VaultIX is built on Next.js 16 (App Router, React 19) with Supabase for auth and database. It is organized in clear layers: the app directory handles routing, layouts, and API endpoints; a components layer holds reusable UI and visualization modules; and utility libraries encapsulate the cross-cutting logic.',
      ),
      h3('Key modules'),
      ...bullets([
        'authSession.ts — Google OAuth flow and session handling',
        'accountEmails.ts — lifecycle notification automation via Nodemailer (Gmail SMTP)',
        'themePreferences.ts — a theme engine that syncs preferences across sessions',
      ]),
      h3('Export & analytics'),
      p(
        'jsPDF with html2canvas powers export of collections and views, while Recharts and Lucide React drive the visual analytics and iconography. TypeScript interfaces and Supabase migrations keep the data model and schema explicit.',
      ),

      h2('Running it'),
      p(
        'VaultIX is deployed on Vercel and running in production. It is MIT licensed and self-hostable — it needs Node.js 20+, a Supabase project, and a Gmail app password for the email system. The experience is best on desktop, with a mobile-compatible responsive design included.',
      ),
    ],
    outcomes: [
      'Live and publicly usable, MIT licensed and self-hostable',
      'Millisecond full-text search across your whole collection',
      'Privacy-first with a permanent-deletion policy and Google-only auth',
      'Automated email lifecycle, cross-session theming, and visual analytics',
    ],
  },

  'hexapod-robotic-arm': {
    title: 'Hexapod Robotic Arm',
    description:
      'A Bluetooth-controlled six-legged robot with an integrated robotic arm for real-time pick-and-place, built on an ESP32 with an AI/ML adaptive-control layer.',
    tech: ['ESP32', 'Servo Motors', 'Arduino / C++', 'Bluetooth', 'Python', 'OpenCV', 'TensorFlow', 'AR'],
    github: 'https://github.com/sravankumar0103',
    slug: 'hexapod-robotic-arm',
    client: 'B.Tech Major Project · Vidya Jyothi Institute of Technology',
    clientLabel: 'Project',
    role: 'AI & Robotics Developer',
    timeline: '2024 – 2025',
    overview:
      'A six-legged (hexapod) robot with a servo-driven robotic arm mounted on top, combining locomotion and object manipulation on one platform. It is controlled wirelessly over Bluetooth from an ESP32 microcontroller, with an AI/ML layer that adapts gait and grip in real time and an augmented-reality interface for visualization and human-robot collaboration. Built as a final-year B.Tech Artificial Intelligence major project with a team of five.',
    body: [
      h2('Overview'),
      p(
        'Most legged robots either move well or manipulate objects — rarely both. This project integrates a servo-driven robotic arm into a six-legged hexapod platform so a single machine can navigate uneven terrain and then pick up, carry, and place objects when it arrives. The whole system runs on an ESP32 microcontroller and is operated wirelessly over Bluetooth, with a machine-learning layer for adaptive, semi-autonomous behaviour.',
      ),

      h2('The problem'),
      p(
        'Industries like logistics, healthcare, disaster relief, and agriculture increasingly need robots that can handle complex tasks in real time. But many existing systems are rigid — pre-programmed for fixed environments, poor at adapting to changing terrain, object sizes, or unexpected obstacles. Wheeled robots struggle on rough ground, and most hexapods focus only on walking, with no way to interact with objects around them.',
      ),
      p(
        'The goal was a versatile, cost-effective platform that unites stable six-legged mobility with real-time object manipulation, controlled through an interface simple enough to use without deep programming knowledge.',
      ),

      h2('What it does'),
      p(
        'The robot runs in a dual-mode control model — it can be driven manually over Bluetooth from a smartphone app or joystick, or hand control to an onboard AI/ML layer that adapts its actions to the environment.',
      ),
      ...bullets([
        'Six-legged locomotion across smooth, inclined, rough, and uneven terrain',
        'Servo-driven robotic arm for pick, lift, carry, and place operations',
        'Dual-mode control — manual Bluetooth operation or AI-driven autonomy',
        'Ultrasonic obstacle detection that halts movement to avoid collisions',
        'Real-time feedback through LED indicators and mobile-app status updates',
        'Modular design with expansion headers for future sensors and grippers',
      ]),

      h2('System architecture'),
      p(
        'The ESP32 is the brain of the system. It receives Bluetooth commands, decides how to act (either by direct mapping in manual mode or through ML inference in autonomous mode), and drives every servo through PWM signals. The control flow is a clear pipeline: user command → ESP32 processing → servo actuation → real-time feedback, looping continuously.',
      ),
      h3('Hardware'),
      ...bullets([
        'ESP32 (dual-core, Wi-Fi + Bluetooth) as the central controller',
        'Servo motors (MG995 / SG90) — three per leg across six legs, plus base, elbow, and gripper servos on the arm',
        'LiPo battery (7.4 V / 11.1 V, 2200–5000 mAh) for untethered field operation',
        'LM2596 buck converter regulating the battery down to a stable 5 V rail',
        'Ultrasonic sensor for obstacle detection; LED indicators for status',
        'Lightweight acrylic / aluminium frame for a strength-to-mobility balance',
      ]),
      h3('Software & control'),
      p(
        'The firmware is written in C++ on the Arduino toolchain. It initializes the servos and Bluetooth link, then listens for commands — mapping high-level task commands such as PICK_OBJECT, TRANSPORT_OBJECT, and PLACE_OBJECT to coordinated servo routines, while the ultrasonic sensor continuously watches for obstacles and can stop the robot mid-task.',
      ),

      h2('Locomotion'),
      p(
        'The six-legged design follows the tripod gait principle — three legs stay grounded while the other three move, keeping the robot stable even on inclines or rocky ground. The system supports multiple gaits (tripod, wave, and ripple) and, in autonomous mode, selects among them based on terrain. Inverse kinematics calculates the joint angles for each leg to place a foot precisely and adapt the walking pattern to obstacles.',
      ),

      h2('The robotic arm'),
      p(
        'Mounted on top of the hexapod, the arm uses dedicated servos for base rotation, an elbow joint, and a gripper. Under manual control it reliably handled objects of 100–200 grams, with the grip tuned for cylindrical and rectangular items. In AI mode, learned models adjust grip strength and joint angles to the object’s shape and size, extending the range of things it can pick up autonomously.',
      ),

      h2('AI & machine learning'),
      p(
        'The intelligence layer is what lifts the robot above a fixed script. It combines several techniques so the platform can perceive, decide, and improve over time:',
      ),
      ...bullets([
        'Reinforcement learning for task adaptation — learning gait and grasp strategies from reward feedback',
        'CNN-based object recognition to detect and classify objects before planning a grasp',
        'Inverse kinematics and motion planning (A*, RRT) for precise leg and arm movement',
        'Transfer learning from pre-trained models to shorten training for new tasks',
        'A path toward SLAM-based navigation and mapping in unknown environments',
      ]),
      p(
        'Datasets such as YCB, ShapeNet, and Dex-Net informed the object-recognition and grasping work, providing 3D models, physical attributes, and optimal grasp points for training.',
      ),

      h2('Augmented reality interface'),
      p(
        'An augmented-reality interface sits on top of the perception stack, combining AI-driven object recognition with spatial mapping to give the operator a live view of what the robot sees and plans. Rather than reading raw telemetry, the user gets spatial awareness and task guidance overlaid in real time — turning the robot’s internal decision-making into something visible and intuitive.',
      ),
      ...bullets([
        'Real-time visualization of perception, mapping, and planned actions',
        'AI-driven object recognition and spatial mapping surfaced to the operator',
        'Improved precision and on-the-fly task adjustments during operation',
        'Stronger human-robot collaboration through shared spatial awareness',
      ]),

      h2('Results'),
      p(
        'The system was tested across multiple terrains and object-handling scenarios. Key outcomes from evaluation:',
      ),
      ...bullets([
        'Stable, smooth locomotion with terrain-adaptive gait selection in AI mode',
        'Reliable pick-and-place of 100–200 g objects with secure grip during transport',
        'Bluetooth control stable within ~10 m at roughly 100 ms latency',
        'AI mode outperformed manual control at adapting to sudden terrain changes',
      ]),
      p(
        'Honest limitations surfaced too: grasping highly irregular or deformable objects remained hard, and Bluetooth latency rose in high-interference environments during data-heavy autonomous operation — pointing toward multi-fingered grippers and Wi-Fi/RF communication in future work.',
      ),

      h2('Future scope'),
      ...bullets([
        'Upgrade wireless from Bluetooth to Wi-Fi, RF, or IoT for longer range and stability',
        'Add LiDAR and vision-based sensing for fully autonomous navigation and mapping',
        'Adaptive multi-fingered or pneumatic grippers with tactile/force feedback',
        'Smart power management and alternative energy sources for longer runtime',
        'Multi-agent swarm coordination for distributed, cooperative tasks',
      ]),
    ],
    outcomes: [
      'Unified six-legged locomotion and object manipulation on one ESP32-based platform',
      'Dual-mode control: real-time manual Bluetooth operation plus an AI/ML adaptive layer',
      'Terrain-adaptive gaits (tripod, wave, ripple) with inverse-kinematics leg control',
      'Validated pick-and-place of 100–200 g objects; ~10 m Bluetooth range at ~100 ms latency',
      'Built as a final-year B.Tech AI major project (team of five, VJIT, 2024–2025)',
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
      h3('Word Counter'),
      p(
        'Analyzes a block of text and reports counts — words and characters — a small exercise in string parsing and clean input handling.',
      ),
      h3('Expense Tracker'),
      p(
        'Logs spending entries and summarizes them, practicing data storage, aggregation, and simple reporting logic.',
      ),
      h3('Username Generator'),
      p(
        'Creates unique usernames from a set of rules — a focused look at rule-based generation and constraint handling.',
      ),

      h2('Purpose'),
      p(
        'Each utility is a focused exercise in clean logic and automation — small in scope, but a solid foundation in problem-solving and Python fundamentals. Together they cover the core building blocks: parsing input, storing and summarizing data, and generating output from rules.',
      ),
    ],
    outcomes: [
      'Three focused, working utilities',
      'Covers parsing, aggregation, and rule-based generation',
      'Emphasis on clean logic and everyday automation',
    ],
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
      h3('Responsive landing page'),
      p(
        'A mobile-first layout built with semantic HTML and CSS, focused on responsive design that adapts cleanly from phone to desktop.',
      ),
      h3('Tic-Tac-Toe'),
      p(
        'A fully playable game with turn handling and win detection — a hands-on exercise in event handling and game state.',
      ),
      h3('Stopwatch'),
      p(
        'A functional timer with start, stop, and reset, practicing timers, live DOM updates, and state that changes over time.',
      ),

      h2('Focus'),
      p(
        'Built with vanilla HTML, CSS, and JavaScript to practice responsive layout, DOM interaction, and simple state management from the ground up — no frameworks, just fundamentals. Each app targets one core skill: layout, interactivity, and state.',
      ),
    ],
    outcomes: [
      'Hands-on frontend fundamentals: layout, interactivity, and state',
      'Responsive, interactive, and framework-free',
    ],
  },
};
