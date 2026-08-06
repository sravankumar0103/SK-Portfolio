// Plain Node script (no Sanity deps) that writes an NDJSON file for `sanity dataset import`.
import { writeFileSync } from 'node:fs';

const docs = [
  {
    _id: 'siteSettings',
    _type: 'siteSettings',
    heroFirstName: 'Sravan Kumar',
    heroLastName: 'Diddi',
    heroRole: 'AI & Full - Stack Developer',
    heroLocation: 'Hyderabad, India · Open to opportunities',
    aboutPara1:
      'I am an AI & Full-Stack Developer focused on building smart, high-quality applications. I combine the power of Artificial Intelligence with full-stack development to create tools that actually solve problems.',
    aboutHighlight: "I don't just write code; I build solutions that work.",
    aboutPara2:
      'Based in Hyderabad, I have a B.Tech in Artificial Intelligence from Vidya Jyothi Institute of Technology. My work includes everything from smart computer vision and robotics to secure websites and automated apps. I focus on writing clean, reliable code for projects that are built to perform well and grow easily.',
    statCgpa: '7.45',
    statProjects: '4+',
    statCertifications: '3',
    statExperience: '1 yr',
    resumeUrl:
      'https://drive.google.com/file/d/1FYafM1kLa7HjkBhlbMHYuurJAcEY0n38/view?usp=sharing',
    contactEmail: 'sravankumar0103@gmail.com',
    socials: [
      { _key: 's1', platform: 'github', url: 'https://github.com/sravankumar0103' },
      { _key: 's2', platform: 'linkedin', url: 'https://linkedin.com/in/diddi-sravan-kumar' },
    ],
  },
  {
    _id: 'project-arogyalens',
    _type: 'project',
    title: 'ArogyaLens',
    description:
      'An AI-powered medical document decoder designed to bridge the healthcare literacy gap. It utilizes OCR, LLMs, and TTS to instantly translate complex prescriptions and lab reports into ultra-simple, multilingual audio summaries with built-in drug safety checks.',
    tech: ['React', 'LLM APIs', 'OCR', 'OpenFDA'],
    github: 'https://github.com/sravankumar0103/ArogyaLens',
    order: 1,
    visible: true,
  },
  {
    _id: 'project-crm-nuzividu',
    _type: 'project',
    title: 'CRM Dashboard - Nuzividu Mangoes',
    description:
      'A comprehensive, full-stack Customer Relationship Management (CRM) platform built as a freelance project for Nuzividu Mangoes. It digitizes the end-to-end sales pipeline—handling leads, follow-ups, inventory, and finances—while featuring integrated analytics and AI-driven campaign tools.',
    tech: ['React', 'TypeScript', 'Express.js', 'Supabase'],
    github: 'https://github.com/sravankumar0103/AdminDashboard-NuzividuMangoes',
    order: 2,
    visible: true,
  },
  {
    _id: 'project-vaultix',
    _type: 'project',
    title: 'VaultIX',
    description:
      'Secure Bookmark & Knowledge Management platform designed for efficient information storage and retrieval. Features real-time synchronization, advanced search filtering, integrated analytics, and automated notification systems.',
    tech: ['Next.js', 'React', 'Supabase', 'PostgreSQL'],
    github: 'https://github.com/sravankumar0103/VaultIX',
    live: 'https://vaultix-sk.vercel.app/',
    order: 3,
    visible: true,
  },
  {
    _id: 'project-hexapod',
    _type: 'project',
    title: 'Hexapod Robotic Arm',
    description:
      'Integrated a robotic arm into a 16-DOF hexapod robot for real-time object manipulation and automated task execution. Utilized AI, ML, and Computer Vision for adaptive autonomous behavior. Included an AR-based interface for real-time visualization.',
    tech: ['Python', 'OpenCV', 'TensorFlow', 'Raspberry Pi 5'],
    github: 'https://github.com/sravankumar0103',
    order: 4,
    visible: true,
  },
  {
    _id: 'project-python-utilities',
    _type: 'project',
    title: 'Python Utilities',
    description:
      'Suite of Python utility applications focusing on logic and automation: Word Counter, Expense Tracker, and a Username Generator.',
    tech: ['Python', 'Automation Scripts'],
    github: 'https://github.com/sravankumar0103',
    order: 5,
    visible: true,
  },
  {
    _id: 'project-web-app-suite',
    _type: 'project',
    title: 'Web App Suite',
    description:
      'A collection of interactive web applications built during virtual internship, including a responsive landing page, Tic-Tac-Toe game, and a Stopwatch tool.',
    tech: ['HTML5', 'CSS3', 'JavaScript'],
    github: 'https://github.com/sravankumar0103',
    order: 6,
    visible: true,
  },
  {
    _id: 'experience-motioncut',
    _type: 'experience',
    role: 'Python Programming Intern',
    company: 'MotionCut',
    date: 'Jan 2025 – Feb 2025',
    description:
      'Automated real-world tasks with Python resulting in a 30% effort reduction. Solved 10+ problem statements.',
    order: 1,
  },
  {
    _id: 'experience-prodigy',
    _type: 'experience',
    role: 'Web Development Intern',
    company: 'Prodigy InfoTech',
    date: 'Jun 2024 – Jul 2024',
    description:
      'Built 3+ responsive web apps with HTML/CSS/JS. Collaborated effectively within a 5+ member team.',
    order: 2,
  },
  {
    _id: 'skill-languages',
    _type: 'skillGroup',
    category: 'Languages',
    items: ['Python', 'Java', 'SQL', 'JavaScript', 'HTML5', 'CSS3'],
    order: 1,
  },
  {
    _id: 'skill-frameworks',
    _type: 'skillGroup',
    category: 'Frameworks & Libraries',
    items: ['Next.js', 'React', 'TensorFlow', 'OpenCV', 'Bootstrap', 'Tailwind CSS'],
    order: 2,
  },
  {
    _id: 'skill-tools',
    _type: 'skillGroup',
    category: 'Tools & Infrastructure',
    items: ['Git', 'Supabase', 'PostgreSQL', 'Tableau', 'Raspberry Pi', 'Vercel'],
    order: 3,
  },
  {
    _id: 'cert-google-cybersecurity',
    _type: 'certification',
    name: 'Google Cybersecurity',
    issuer: 'Google / Coursera',
    date: '2024',
    link: 'https://www.coursera.org/account/accomplishments/professional-cert/HZXL29HPYAK2',
    order: 1,
  },
  {
    _id: 'cert-ibm-ml-ai',
    _type: 'certification',
    name: 'Machine Learning & Artificial Intelligence',
    issuer: 'IBM',
    date: '2023',
    order: 2,
  },
  {
    _id: 'cert-aws-ml',
    _type: 'certification',
    name: 'Machine Learning, Data Engineering, Cloud Architecting',
    issuer: 'AWS Academy',
    date: '2023',
    order: 3,
  },
];

const ndjson = docs.map((d) => JSON.stringify(d)).join('\n') + '\n';
writeFileSync(new URL('./seed.ndjson', import.meta.url), ndjson);
console.log(`Wrote ${docs.length} documents to seed.ndjson`);
