import { Award, Check, GraduationCap } from 'lucide-react';
import { Reveal } from '@/components/reveal/reveal';
import { Pill, SectionHeader } from '@/components/site-primitives/primitives';
import { educationSection } from '@/content/site';

const icons = { graduation: GraduationCap, award: Award } as const;

export function Education() {
  return (
    <section
      id='education'
      aria-labelledby='education-title'
      className='mt-[72px] scroll-mt-24 sm:mt-[120px]'
    >
      <SectionHeader
        id='education-title'
        eyebrow={educationSection.eyebrow}
        title={educationSection.title}
        sub={educationSection.sub}
      />
      <ul className='mt-10 grid gap-4 md:grid-cols-2'>
        {educationSection.items.map((item, i) => {
          const Icon = icons[item.icon];
          return (
            <Reveal as='li' key={item.title} index={i}>
              <div className='h-full rounded-card border border-line bg-card p-6 sm:p-7'>
                <div className='flex items-start justify-between gap-3'>
                  <div className='flex min-w-0 items-start gap-3.5'>
                    <span className='grid size-11 shrink-0 place-items-center rounded-control bg-brand-soft text-brand-ink'>
                      <Icon aria-hidden='true' className='size-5' />
                    </span>
                    <div className='min-w-0'>
                      <h3 className='text-lg font-bold leading-snug tracking-[-0.01em]'>
                        {item.title}
                      </h3>
                      <p className='mt-1 text-sm text-ink3'>{item.org}</p>
                    </div>
                  </div>
                  <Pill tone='brand' className='shrink-0'>
                    {item.badge}
                  </Pill>
                </div>
                <p className='mt-6 flex items-baseline gap-2'>
                  <span className='text-[44px] font-extrabold leading-none tracking-[-0.03em] sm:text-[52px]'>
                    {item.value}
                  </span>
                  <span className='text-sm text-ink3'>{item.unit}</span>
                </p>
                <div
                  aria-hidden='true'
                  className='mt-4 h-1.5 overflow-hidden rounded-full bg-pill'
                >
                  <div
                    className='h-full'
                    style={{ width: `${item.progress}%` }}
                  >
                    <Reveal
                      variant='draw'
                      delay={0.3}
                      className='h-full rounded-full bg-brand'
                    />
                  </div>
                </div>
                <p className='mt-4 flex items-center gap-2 text-sm text-ink2'>
                  <Check aria-hidden='true' className='size-4 text-brand-ink' />
                  {item.line}
                </p>
                <ul className='mt-4 flex flex-wrap gap-2'>
                  {item.pills.map((p) => (
                    <li key={p}>
                      <Pill>{p}</Pill>
                    </li>
                  ))}
                  <li>
                    <Pill>+{item.more} more</Pill>
                  </li>
                </ul>
              </div>
            </Reveal>
          );
        })}
      </ul>
    </section>
  );
}
