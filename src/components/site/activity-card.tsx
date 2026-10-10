import { ArrowUpRight } from 'lucide-react';
import type { CSSProperties } from 'react';
import { Button } from '@/components/ui/button';
import { activity, GITHUB_URL } from '@/content/site';
import { cn } from '@/lib/utils';
import { GithubIcon } from './brand-icons';

export type ContributionData = {
  weeks: number[][];
  months: { week: number; label: string }[];
  total: number;
};

const level = (n: number) => `var(--h${n})`;

// Design: 13 px cells, 4 px gap (11 / 3 on phones), 53 weeks (24 on phones). The
// columns pop in 22 ms apart once the card scrolls into view (see motion.css).
export function ActivityCard({ data }: { data: ContributionData }) {
  const cols = data.weeks.length;
  const hiddenOnPhone = cols - 24;
  // a label this close to the right edge would be clipped
  const months = new Map(
    data.months.filter((m) => m.week + 2 < cols).map((m) => [m.week, m.label]),
  );
  return (
    <section
      aria-labelledby='activity-title'
      className='overflow-hidden rounded-card border border-line bg-card p-5 sm:p-7'
    >
      <div className='mb-5 flex flex-wrap items-center justify-between gap-4'>
        <div>
          <h3
            id='activity-title'
            className='text-lg font-bold tracking-[-0.01em]'
          >
            {activity.title}
          </h3>
          <p className='mt-1 text-sm text-ink3'>{activity.line(data.total)}</p>
        </div>
        <Button asChild variant='outline' size='sm' className='h-[42px]'>
          <a href={GITHUB_URL} target='_blank' rel='noopener noreferrer'>
            <GithubIcon className='size-4' />
            {activity.button}
            <ArrowUpRight aria-hidden='true' className='size-4' />
          </a>
        </Button>
      </div>

      {/* decorative: the total above carries the information */}
      <div
        aria-hidden='true'
        className='overflow-hidden [--cg:3px] [--cs:11px] sm:[--cg:4px] sm:[--cs:13px]'
      >
        <div className='m-hm mt-[26px]'>
          {data.weeks.map((week, c) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: fixed grid, position is identity
              key={c}
              className={cn(
                'm-hm-col',
                c < hiddenOnPhone ? 'hidden sm:grid' : 'grid',
              )}
              style={{ '--c': c } as CSSProperties}
            >
              {months.get(c) ? (
                <span className='absolute -top-[26px] left-0 whitespace-nowrap font-mono text-[11px] text-ink3'>
                  {months.get(c)}
                </span>
              ) : null}
              {week.map((n, d) => (
                <i
                  // biome-ignore lint/suspicious/noArrayIndexKey: fixed grid
                  key={d}
                  className='block rounded-[3px]'
                  style={{ background: level(n) }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div
        aria-hidden='true'
        className='mt-4 flex items-center justify-end gap-1.5 font-mono text-[11px] text-ink3'
      >
        Less
        {[0, 1, 2, 3, 4].map((n) => (
          <i
            key={n}
            className='block size-3 rounded-[3px]'
            style={{ background: level(n) }}
          />
        ))}
        More
      </div>
    </section>
  );
}
