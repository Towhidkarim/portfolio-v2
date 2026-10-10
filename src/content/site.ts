// All page copy lives here, not in JSX. Source: docs/migration/design/copy.md.
// Items marked "owner to confirm" there are not final.

export const GITHUB_URL = 'https://github.com/Towhidkarim/';
export const FACEBOOK_URL = 'https://fb.me/towhid.karim.1';
export const EMAIL = 'towhidkarim123@gmail.com';
export const PHONE = '+880 1744-161517';
export const LOCATION = 'Rajshahi, Bangladesh';

const RESUME_ID = '1V4gZ9QlCVPAIJSlIguyUdw0F9NiC78nw';
export const RESUME_PREVIEW_URL = `https://drive.google.com/file/d/${RESUME_ID}/view`;
export const RESUME_DOWNLOAD_URL = `https://drive.google.com/uc?export=download&id=${RESUME_ID}`;

export const nav = {
  logo: ['Towhid', 'Karim'],
  links: [
    { id: 'home', label: 'Home' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'about', label: 'About me' },
    { id: 'contact', label: 'Contact' },
  ],
  cta: 'Hire me',
} as const;

export const hero = {
  status: 'Open to new roles',
  place: 'Rajshahi',
  hello: "Hello there! I'm",
  name: 'Towhid Karim',
  roles: [
    'A Full-Stack Engineer',
    'Crafting Scalable Apps with React & Next.js',
  ],
  intro:
    "I'm a full-stack engineer passionate about building high performant applications and solving problems with elegant solutions.",
  preview: 'Preview Resume',
  download: 'Download Resume',
} as const;

export const proof = [
  {
    value: '3.99',
    label: 'CGPA of 4.00',
    detail: 'BSc in CSE, Varendra University',
  },
  {
    value: '100%',
    label: 'Assignments',
    detail: 'Programming Hero Level 2, Batch 5',
  },
  {
    value: 'AI-native',
    label: 'LLM workflows, RAG',
    detail: 'and agentic loops in the stack',
    word: true,
  },
  {
    value: 'Open to roles',
    label: 'Rajshahi, Bangladesh',
    detail: 'GMT+6',
    word: true,
    live: true,
  },
] as const;

export const skillsSection = {
  eyebrow: '01 · The stack',
  title: 'Skills',
  sub: 'The tools I reach for, grouped by where they sit in a product.',
  principlesLabel: 'Core principles I deliver',
  aiSub: 'Models in the loop, from first prompt to reviewed code.',
  aiLoop: ['Prompt', 'Plan', 'Build', 'Review'],
} as const;

export const projectsSection = {
  eyebrow: '02 · Selected work',
  title: 'My Projects',
  sub: 'What I have built and shipped. Every card opens a full write-up.',
  viewAll: 'View all projects',
  empty: 'No projects yet.',
  error: 'Projects could not be loaded. Try again.',
  retry: 'Retry',
  featured: 'Featured',
} as const;

export const activity = {
  title: 'Open-source activity',
  // Static stub until the owner picks a source (R-21). See getContributions().
  line: (n: number) => `${n} contributions in the last year, live from GitHub`,
  button: 'Towhidkarim',
} as const;

export const educationSection = {
  eyebrow: '03 · Academics',
  title: 'Education',
  sub: 'My academic journey and achievements.',
  items: [
    {
      icon: 'graduation',
      title: 'BSc in Computer Science & Engineering',
      org: 'Varendra University · 2022 - 2026',
      badge: 'Completed',
      value: '3.99',
      unit: '/ 4.00 CGPA',
      progress: 99.75,
      line: 'Graduated with honors',
      pills: [
        'Data Structures',
        'OOP',
        'Databases',
        'Software Eng.',
        'Machine Learning',
      ],
      more: 3,
    },
    {
      icon: 'award',
      title: 'Next Level Web Development, Level 2',
      org: 'Programming Hero · Batch 5',
      badge: 'Top performer',
      value: '100%',
      unit: 'on all assignments',
      progress: 100,
      line: 'Top performer in Batch 5',
      pills: ['TypeScript', 'Next.js', 'Node.js', 'PostgreSQL', 'Docker'],
      more: 4,
      href: 'https://web.programming-hero.com/verification?validationNumber=PHL2B5L2B5-00611098',
    },
  ],
} as const;

export const aboutSection = {
  eyebrow: '04 · The person',
  title: 'About Me',
  sub: 'A little about who is behind the code.',
  paragraphs: [
    "I'm a passionate web developer with a knack for transforming innovative ideas into functional and visually captivating digital experiences. My coding journey started with a fascination for how logic could bring pixels to life.",
    'With a solid foundation in React, Next.js, and Tailwind, I create responsive user interfaces and seamless user experiences, blending aesthetics with functionality. As an avid problem solver, I thrive on tackling new challenges head-on. When not coding, I explore the latest design trends or brainstorm my next project over a cup of coffee.',
  ],
  facts: [
    ['Name', 'Towhid Karim'],
    ['Status', 'Looking for employment'],
    ['Education', 'BSc in CSE'],
    ['Focus', 'Full-stack, AI-native'],
  ],
  photoAlt: 'Portrait of Towhid Karim',
} as const;

export const contactSection = {
  eyebrow: '05 · Contact',
  title: 'Get in Touch',
  sub: 'Have a role or a project in mind? Send a message and I will get back to you.',
  copyLabel: 'Copy email address',
  fields: {
    name: { label: 'Name', placeholder: 'Your name' },
    email: { label: 'Email', placeholder: 'you@company.com' },
    message: { label: 'Message', placeholder: 'How can I help?' },
  },
  submit: 'Send message',
  sending: 'Sending…',
  success: { title: 'Message sent', description: 'Thanks, I will reply soon.' },
  failure: 'Could not send',
} as const;

export const footer = {
  copyright: '© 2026 Towhid Karim',
  middle: 'BSc in CSE • CGPA 3.99 • Class of 2026',
  top: 'Back to top',
} as const;

export const SITE = {
  name: 'Towhid Karim',
  jobTitle: 'Full-Stack Engineer',
  sameAs: [GITHUB_URL, FACEBOOK_URL],
} as const;
