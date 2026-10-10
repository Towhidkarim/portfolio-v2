import { ArrowRight, Sparkles } from 'lucide-react';
import type { CSSProperties } from 'react';
import { skillsSection } from '@/content/site';
import type { SkillGroup } from '@/content/skills';
import { SkillIcon } from './brand-icons';

// Always-dark card. Chips always sit on a light plate (see design/03).
export function AiLoopCard({ group }: { group: SkillGroup }) {
  return (
    <div className='relative h-full overflow-hidden rounded-card bg-panel p-[26px] text-[#F2F5F9]'>
      <div
        aria-hidden='true'
        className='pointer-events-none absolute -top-16 -right-16 size-72 rounded-full bg-[radial-gradient(circle,rgba(52,211,166,.2),transparent_70%)]'
      />
      <div className='relative'>
        <div className='flex items-baseline justify-between'>
          <h3 className='flex items-center gap-2.5 text-[19px] font-bold'>
            <Sparkles aria-hidden='true' className='size-4 text-[#34D3A6]' />
            {group.title}
          </h3>
          <span className='font-mono text-xs tracking-[0.08em] text-[#8D9BAD]'>
            {String(group.items.length).padStart(2, '0')}
          </span>
        </div>
        <p className='mt-3 text-[15px] leading-[1.65] text-[#A5B1C0]'>
          {skillsSection.aiSub}
        </p>
        <ol
          className='mt-5 flex flex-wrap items-center gap-2'
          aria-label='AI workflow'
        >
          {skillsSection.aiLoop.map((step, i) => (
            <li key={step} className='flex items-center gap-2'>
              <span
                className='m-step inline-flex h-9 items-center rounded-full border border-[#2A3644] px-3.5 text-[13px] font-semibold text-[#C5D0DD]'
                style={
                  {
                    '--stepbg': '#34D3A6',
                    '--steplit': '#06241C',
                    animationDelay: `${i * 1.5 - 6}s`,
                  } as CSSProperties
                }
              >
                {step}
              </span>
              {i < skillsSection.aiLoop.length - 1 ? (
                <ArrowRight
                  aria-hidden='true'
                  className='size-3.5 text-[#8392A5]'
                />
              ) : null}
            </li>
          ))}
        </ol>
        <ul className='mt-6 flex flex-wrap gap-2'>
          {group.items.map((s) => (
            <li
              key={s.name}
              className='inline-flex h-10 items-center gap-2 rounded-control border border-[#2A3644] bg-[#0E161E] pr-3.5 pl-[7px] text-[13.5px] font-medium'
            >
              <span className='grid size-[26px] place-items-center rounded-lg bg-[#F8FAFC] text-[#0E6B58]'>
                <SkillIcon skill={s} size={18} />
              </span>
              {s.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
