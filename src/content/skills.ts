// Skills data. `icon` is a file in public/icons; `lucide` names a lucide icon
// for items without a logo. `plate: 'mono'` marks single-colour logos that need
// a light plate in dark mode (see --plate).

export type Skill = {
  name: string;
  icon?: string;
  lucide?: 'Brain' | 'Library' | 'Bot';
  mono?: boolean;
};

export type SkillGroup = {
  id: 'frontend' | 'backend' | 'database' | 'ai' | 'tools';
  title: string;
  items: Skill[];
};

export const skillGroups: SkillGroup[] = [
  {
    id: 'frontend',
    title: 'Front End',
    items: [
      { name: 'React', icon: 'React.svg' },
      { name: 'Next.js', icon: 'nextjs-icon.svg', mono: true },
      { name: 'TanStack Start', icon: 'tanstack.png' },
      { name: 'React Native', icon: 'reactnative.svg' },
      { name: 'TypeScript', icon: 'TypeScript.svg' },
      { name: 'Tailwind CSS', icon: 'Tailwind CSS.svg' },
      { name: 'TanStack Query', icon: 'tanstack.png' },
      { name: 'Zustand', icon: 'zustand.jpg' },
      { name: 'shadcn/ui', icon: 'shadcn.png', mono: true },
    ],
  },
  {
    id: 'backend',
    title: 'Back End',
    items: [
      { name: 'Node.js', icon: 'Node.js.svg' },
      { name: 'Bun', icon: 'Bun.svg' },
      { name: 'Express', icon: 'express.png', mono: true },
      { name: 'Hono', icon: 'hono.svg' },
      { name: 'Cloudflare Workers', icon: 'cloudflareworkers.svg' },
      { name: 'Redis', icon: 'redis.webp' },
    ],
  },
  {
    id: 'database',
    title: 'Database & ORMs',
    items: [
      { name: 'Drizzle ORM', icon: 'drizzle.png', mono: true },
      { name: 'Prisma', icon: 'prisma.png', mono: true },
      { name: 'PostgreSQL', icon: 'postgresql.png', mono: true },
      { name: 'MongoDB', icon: 'mongo.webp' },
      { name: 'Turso', icon: 'turso.png' },
    ],
  },
  {
    id: 'ai',
    title: 'AI',
    items: [
      { name: 'Vercel AI SDK', icon: 'vercel.svg' },
      { name: 'Python', icon: 'Python.svg' },
      { name: 'LLM workflows', lucide: 'Brain' },
      { name: 'RAG', lucide: 'Library' },
      { name: 'Agentic loops', lucide: 'Bot' },
    ],
  },
  {
    id: 'tools',
    title: 'Tools & DevOps',
    items: [
      { name: 'Git', icon: 'git.svg' },
      { name: 'GitHub', icon: 'github.png', mono: true },
      { name: 'GitHub Actions', icon: 'githubactions.svg' },
      { name: 'Docker', icon: 'docker.png' },
      { name: 'Cloudflare', icon: 'cloudflare.svg' },
      { name: 'Claude', icon: 'claude.svg' },
      { name: 'Codex', icon: 'codex.svg' },
      { name: 'Cursor', icon: 'cursor.png', mono: true },
    ],
  },
];

// Marquee order from design/copy.md.
export const marquee: Skill[] = [
  'React',
  'Next.js',
  'TypeScript',
  'Tailwind CSS',
  'TanStack Query',
  'TanStack Start',
  'Zustand',
  'Node.js',
  'Bun',
  'Hono',
  'Cloudflare Workers',
  'Redis',
  'Drizzle ORM',
  'Prisma',
  'PostgreSQL',
  'Docker',
  'Cloudflare',
  'Claude',
  'Codex',
  'Cursor',
  'Vercel AI SDK',
  'Python',
]
  .map((name) =>
    skillGroups.flatMap((g) => g.items).find((s) => s.name === name),
  )
  .filter((s): s is Skill => Boolean(s));

export const principles = [
  { icon: 'Sparkles', label: 'AI-Native Velocity' },
  { icon: 'ShieldCheck', label: 'Type-Safe Reliability' },
  { icon: 'Layers', label: 'Scalable Systems Design' },
  { icon: 'Target', label: 'Real-World Impact' },
] as const;
