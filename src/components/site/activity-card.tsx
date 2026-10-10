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

const CELL = 12;
const GAP = 3;
const level = (n: number) => `var(--h${n})`;

export function ActivityCard({ data }: { data: ContributionData }) {
  const cols = data.weeks.length;
  return (
    <section
      aria-labelledby='activity-title'
      className='rounded-card border border-line bg-card p-5 sm:p-7'
    >
      <div className='flex flex-wrap items-start justify-between gap-4'>
        <div>
          <h3
            id='activity-title'
            className='text-xl font-bold tracking-[-0.01em]'
          >
            {activity.title}
          </h3>
          <p className='mt-1 text-sm text-ink3'>{activity.line(data.total)}</p>
        </div>
        <Button asChild variant='outline' size='sm' className='h-11'>
          <a href={GITHUB_URL} target='_blank' rel='noopener noreferrer'>
            <GithubIcon className='size-4' />
            {activity.button}
            <ArrowUpRight aria-hidden='true' className='size-4' />
          </a>
        </Button>
      </div>

      {/* decorative: the total above carries the information */}
      <div aria-hidden='true' className='mt-6 overflow-hidden'>
        <div className='flex w-max' style={{ gap: GAP }}>
          {data.weeks.map((week, c) => {
            const month = data.months.find((m) => m.week === c);
            return (
              <div
                // biome-ignore lint/suspicious/noArrayIndexKey: fixed grid, position is identity
                key={c}
                className={cn(
                  'm-hm-col',
                  // phones show the latest 24 weeks
                  c < cols - 24 && 'hidden sm:block',
                )}
                style={{ '--c': c } as CSSProperties}
              >
                <div className='mb-1.5 h-4 w-3 whitespace-nowrap font-mono text-[11px] text-ink3'>
                  {month && c + 2 < cols ? month.label : ''}
                </div>
                <div className='grid' style={{ gap: GAP }}>
                  {week.map((n, d) => (
                    <i
                      // biome-ignore lint/suspicious/noArrayIndexKey: fixed grid
                      key={d}
                      className='block rounded-[3px]'
                      style={{
                        width: CELL,
                        height: CELL,
                        background: level(n),
                      }}
                    />
                  ))}
                </div>
              </div>
            );
          })}
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
