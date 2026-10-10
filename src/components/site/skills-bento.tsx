import { Layers, ShieldCheck, Sparkles, Target } from 'lucide-react';
import { Reveal } from '@/components/reveal/reveal';
import { Chip, SectionHeader } from '@/components/site-primitives/primitives';
import { skillsSection } from '@/content/site';
import {
  alsoWorkedWith,
  principles,
  type SkillGroup,
  skillGroups,
} from '@/content/skills';
import { cn } from '@/lib/utils';
import { AiLoopCard } from './ai-loop-card';
import { SkillIcon } from './brand-icons';

const principleIcons = { Sparkles, ShieldCheck, Layers, Target } as const;

function BentoCard({
  group,
  className,
}: {
  group: SkillGroup;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'rounded-card border border-line bg-card p-[26px]',
        className,
      )}
    >
      <div className='mb-[18px] flex items-baseline justify-between'>
        <h3 className='text-[19px] font-bold tracking-[-0.01em]'>
          {group.title}
        </h3>
        <span className='font-mono text-xs tracking-[0.08em] text-ink3'>
          {String(group.items.length).padStart(2, '0')}
        </span>
      </div>
      <ul className='flex flex-wrap gap-2'>
        {group.items.map((s) => (
          <li key={s.name}>
            <Chip
              size='sm'
              plate={Boolean(s.mono)}
              icon={<SkillIcon skill={s} size={18} />}
            >
              {s.name}
            </Chip>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SkillsBento() {
  const byId = Object.fromEntries(skillGroups.map((g) => [g.id, g])) as Record<
    SkillGroup['id'],
    SkillGroup
  >;
  return (
    <section
      id='skills'
      aria-labelledby='skills-title'
      className='mt-[72px] scroll-mt-24 sm:mt-[120px]'
    >
      <SectionHeader
        id='skills-title'
        eyebrow={skillsSection.eyebrow}
        title={skillsSection.title}
        sub={skillsSection.sub}
      />
      <div className='mt-10 grid gap-4 lg:grid-cols-12'>
        <Reveal className='lg:col-span-8'>
          <BentoCard group={byId.frontend} className='h-full' />
        </Reveal>
        <Reveal index={1} className='lg:col-span-4 lg:row-span-2'>
          <AiLoopCard group={byId.ai} />
        </Reveal>
        <Reveal className='lg:col-span-4'>
          <BentoCard group={byId.backend} className='h-full' />
        </Reveal>
        <Reveal index={1} className='lg:col-span-4'>
          <BentoCard group={byId.database} className='h-full' />
        </Reveal>
        <Reveal className='lg:col-span-5'>
          <BentoCard group={byId.auth} className='h-full' />
        </Reveal>
        <Reveal index={1} className='lg:col-span-7'>
          <BentoCard group={byId.tools} className='h-full' />
        </Reveal>
      </div>

      <Reveal as='p' className='mt-6 text-sm leading-[1.7] text-ink2'>
        <span className='mr-2 font-mono text-xs uppercase tracking-[0.14em] text-ink3'>
          {skillsSection.alsoLabel}
        </span>
        {alsoWorkedWith.join(' · ')}
      </Reveal>

      <Reveal className='mt-10'>
        <h3 className='border-b border-line pb-3 font-mono text-xs font-normal uppercase tracking-[0.14em] text-ink3'>
          {skillsSection.principlesLabel}
        </h3>
        <ul className='mt-5 grid grid-cols-2 gap-x-4 gap-y-5 lg:grid-cols-4'>
          {principles.map((p) => {
            const Icon = principleIcons[p.icon];
            return (
              <li key={p.label} className='flex items-center gap-3.5'>
                <span className='grid size-11 shrink-0 place-items-center rounded-control bg-brand-soft text-brand-ink'>
                  <Icon aria-hidden='true' className='size-5' />
                </span>
                <span className='text-sm font-semibold sm:text-base'>
                  {p.label}
                </span>
              </li>
            );
          })}
        </ul>
      </Reveal>
    </section>
  );
}
