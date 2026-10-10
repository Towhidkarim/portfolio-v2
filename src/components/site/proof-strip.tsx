import { Reveal } from '@/components/reveal/reveal';
import { proof } from '@/content/site';
import { cn } from '@/lib/utils';

export function ProofStrip() {
  return (
    <Reveal
      as='section'
      aria-label='Highlights'
      className='mt-14 grid grid-cols-2 gap-3 lg:mt-[72px] lg:grid-cols-4 lg:gap-0 lg:divide-x lg:divide-line lg:overflow-hidden lg:rounded-card lg:border lg:border-line'
    >
      {proof.map((cell) => (
        <div
          key={cell.label}
          className='rounded-card border border-line bg-card p-5 lg:rounded-none lg:border-0 lg:px-7 lg:py-6'
        >
          <p
            className={cn(
              'flex items-center gap-2.5 font-extrabold tracking-[-0.03em]',
              'word' in cell && cell.word
                ? 'text-lg sm:text-[26px]'
                : 'text-[28px] sm:text-[34px]',
            )}
          >
            {'live' in cell && cell.live ? (
              <span
                aria-hidden='true'
                className='m-live size-2.5 shrink-0 rounded-full bg-brand'
              />
            ) : null}
            {cell.value}
          </p>
          <p className='mt-1.5 text-[13px] font-medium sm:text-sm'>
            {cell.label}
          </p>
          <p className='mt-1 text-[12.5px] text-ink3 sm:text-[13.5px]'>
            {cell.detail}
          </p>
        </div>
      ))}
    </Reveal>
  );
}
