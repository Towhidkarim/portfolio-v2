import Reveal from '@/components/framer/Reveal';
import SectionTitle from '@/components/ui/section-title';
import Image, { StaticImageData } from 'next/image';
import {
  reactIcon,
  nextIcon,
  tailwindIcon,
  tsIcon,
  drizzle,
  nodeIcon,
  bunIcon,
  githubicon,
  docker,
  postgresql,
  zustand,
  mongoDBIcon,
  prismaIcon,
  tanstackQuery,
  shadcn,
  redisIcon,
  expressIcon,
  turso,
  cloudflareIcon,
  githubActionsIcon,
  gitIcon,
  reactNativeIcon,
  vercelIcon,
  honoIcon,
  cursorIcon,
} from '@/lib/icons';
import {
  Bot,
  Brain,
  Layers,
  Library,
  LucideIcon,
  Plus,
  ShieldCheck,
  Sparkles,
  Target,
} from 'lucide-react';
import { ReactNode } from 'react';

type SkillIcon = StaticImageData | LucideIcon;

type TSkillprops = {
  title: string;
  icon: SkillIcon;
};

type SkillCategory = {
  title: string;
  skills: TSkillprops[];
};

function isImageIcon(icon: SkillIcon): icon is StaticImageData {
  return typeof icon === 'object' && icon !== null && 'src' in icon;
}

function SkillItem({ title, icon }: TSkillprops) {
  return (
    <div className='flex cursor-pointer select-none flex-col items-center justify-center gap-2'>
      {isImageIcon(icon) ? (
        <Image
          src={icon}
          alt={title}
          width={48}
          height={48}
          className='pointer-events-none h-12 w-12 object-contain'
        />
      ) : (
        (() => {
          const Icon = icon;
          return (
            <Icon
              className='h-12 w-12 text-foreground'
              strokeWidth={1.5}
              aria-hidden
            />
          );
        })()
      )}
      <span className='text-center text-sm font-bold opacity-90'>{title}</span>
    </div>
  );
}

function CategoryBlock({
  title,
  skills,
  className = '',
}: {
  title: string;
  skills: TSkillprops[];
  className?: string;
}) {
  return (
    <div className={`flex w-full flex-col items-center justify-center ${className}`}>
      <Reveal className='mb-8 mt-2'>
        <h2 className='text-2xl font-bold'>{title}</h2>
        <hr className='mx-auto my-2 h-2 w-3/5 rounded-full bg-primary' />
      </Reveal>
      <div className='grid w-full grid-cols-3 place-items-center gap-x-8 gap-y-12'>
        {skills.map((value, index) => (
          <Reveal
            delay={0.08 * index}
            disableReveal
            key={value.title}
            className='transition duration-300 hover:scale-105'
          >
            <SkillItem {...value} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}

export default function SkillSection() {
  const features = [
    { title: 'AI-Native Velocity', icon: <Sparkles /> },
    { title: 'Type-Safe Reliability', icon: <ShieldCheck /> },
    { title: 'Scalable Systems Design', icon: <Layers /> },
    { title: 'Real-World Impact', icon: <Target /> },
  ];

  const categories: SkillCategory[] = [
    {
      title: 'Front End',
      skills: [
        { title: 'React', icon: reactIcon },
        { title: 'Next.js', icon: nextIcon },
        { title: 'React Native', icon: reactNativeIcon },
        { title: 'TypeScript', icon: tsIcon },
        { title: 'TailwindCSS', icon: tailwindIcon },
        { title: 'TanStack Query', icon: tanstackQuery },
        { title: 'Zustand', icon: zustand },
        { title: 'Shadcn UI', icon: shadcn },
      ],
    },
    {
      title: 'Back End',
      skills: [
        { title: 'Node.js', icon: nodeIcon },
        { title: 'Bun', icon: bunIcon },
        { title: 'Express', icon: expressIcon },
        { title: 'Hono', icon: honoIcon },
        { title: 'Redis', icon: redisIcon },
      ],
    },
    {
      title: 'AI',
      skills: [
        { title: 'Vercel AI SDK', icon: vercelIcon },
        { title: 'LLM Workflows', icon: Brain },
        { title: 'RAG', icon: Library },
        { title: 'Agentic Loops', icon: Bot },
      ],
    },
    {
      title: 'Database & ORMs',
      skills: [
        { title: 'Drizzle ORM', icon: drizzle },
        { title: 'Prisma', icon: prismaIcon },
        { title: 'PostgreSQL', icon: postgresql },
        { title: 'MongoDB', icon: mongoDBIcon },
        { title: 'Turso', icon: turso },
      ],
    },
    {
      title: 'Tools & DevOps',
      skills: [
        { title: 'Git', icon: gitIcon },
        { title: 'GitHub', icon: githubicon },
        { title: 'GitHub Actions', icon: githubActionsIcon },
        { title: 'Docker', icon: docker },
        { title: 'Cloudflare', icon: cloudflareIcon },
        { title: 'Cursor', icon: cursorIcon },
      ],
    },
  ];

  const topRow = categories.slice(0, 2);
  const midRow = categories.slice(2, 4);
  const tools = categories[4];

  return (
    <section id='skills'>
      <SectionTitle>Skills</SectionTitle>
      <br />

      <div className='flex w-full flex-col flex-wrap items-start justify-evenly gap-16 gap-y-24 md:flex-row'>
        {topRow.map((cat) => (
          <CategoryBlock
            key={cat.title}
            title={cat.title}
            skills={cat.skills}
            className='md:w-2/5'
          />
        ))}
      </div>

      <br />
      <br />

      <div className='flex w-full flex-col flex-wrap items-start justify-evenly gap-16 gap-y-24 md:flex-row'>
        {midRow.map((cat) => (
          <CategoryBlock
            key={cat.title}
            title={cat.title}
            skills={cat.skills}
            className='md:w-2/5'
          />
        ))}
      </div>

      <br />
      <br />

      <CategoryBlock
        title={tools.title}
        skills={tools.skills}
        className='mx-auto max-w-3xl'
      />

      <br />
      <br />

      <Reveal className='mx-auto mb-6 mt-12'>
        <h4 className='text-center text-xl font-semibold'>
          Core Principles I Deliver
        </h4>
        <hr className='mx-auto my-2 h-2 w-3/5 rounded-full bg-primary' />
      </Reveal>
      <div className='mx-auto grid grid-cols-1 place-content-start place-items-center gap-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-4'>
        {features.map((value, index) => (
          <Reveal delay={0.15 * index} key={value.title} className='w-full p-4'>
            <div className='flex h-6 flex-col items-center justify-center gap-2 p-6 text-center text-lg'>
              <span className='scale-125'>{value.icon as ReactNode}</span>
              <span className='font-semibold'>{value.title}</span>
            </div>
          </Reveal>
        ))}
      </div>
      <br />
      <div className='mx-auto my-5 mt-5 flex items-center justify-center gap-1 text-xl font-bold'>
        <span>
          <Plus size={30} strokeWidth={3} />
        </span>
        More
      </div>
    </section>
  );
}
