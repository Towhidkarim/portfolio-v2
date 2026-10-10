import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { Reveal } from '@/components/reveal/reveal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

/** Mono uppercase label with a 28 px rule before it: "02 · Selected work". */
export function Eyebrow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 font-mono text-xs uppercase tracking-[0.14em] text-brand-ink',
        className,
      )}
    >
      <i aria-hidden='true' className='block h-px w-7 bg-brand' />
      {children}
    </div>
  );
}

/** Eyebrow, curtain heading, draw bar and a sub line. Content comes from props. */
export function SectionHeader({
  eyebrow,
  title,
  sub,
  id,
  as: Heading = 'h2',
  className,
}: {
  eyebrow: string;
  title: string;
  sub?: string;
  id?: string;
  as?: 'h1' | 'h2';
  className?: string;
}) {
  return (
    <header className={className}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <Reveal
        as={Heading}
        variant='curtain'
        id={id}
        className='mt-3.5 text-[40px] font-extrabold leading-[1.08] tracking-[-0.03em]'
      >
        {title}
      </Reveal>
      <Reveal
        variant='draw'
        delay={0.2}
        aria-hidden='true'
        className='mt-[18px] h-1 w-14 rounded bg-brand'
      />
      {sub ? (
        <p className='mt-3.5 max-w-[560px] text-[17px] leading-[1.65] text-ink2'>
          {sub}
        </p>
      ) : null}
    </header>
  );
}

/** Non-clickable stack chip: icon plate + label, lifts on hover. */
export function Chip({
  icon,
  plate = true,
  children,
  className,
}: {
  icon?: ReactNode;
  /** light plate behind the icon in dark mode (monochrome logos) */
  plate?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex h-[46px] cursor-default items-center gap-2.5 rounded-control border border-line bg-card pr-4 pl-[9px] text-sm font-medium text-foreground transition-[border-color,transform,box-shadow] duration-250 hover:border-brand hover:shadow-[0_10px_22px_-14px_var(--brand)] motion-safe:hover:-translate-y-0.5',
        className,
      )}
    >
      {icon ? (
        <span
          className={cn(
            'grid size-[30px] place-items-center rounded-lg text-brand-ink dark:text-[#0E6B58]',
            plate && 'bg-plate',
          )}
        >
          {icon}
        </span>
      ) : null}
      {children}
    </span>
  );
}

/** Small tag. Same look as the design `.pill`. */
export function Pill({
  children,
  tone = 'default',
  className,
}: {
  children: ReactNode;
  tone?: 'default' | 'brand';
  className?: string;
}) {
  return (
    <Badge
      variant={tone === 'brand' ? 'brand' : 'default'}
      className={className}
    >
      {children}
    </Badge>
  );
}

const formatTime = (timeZone: string) =>
  new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone,
  }).format(new Date());

/**
 * "Open to new roles | Rajshahi 14:05". The clock only exists in the browser:
 * the server renders `--:--`, so cached HTML never shows a stale time.
 */
export function StatusPill({
  label,
  place,
  timeZone = 'Asia/Dhaka',
  className,
}: {
  label: string;
  place: string;
  timeZone?: string;
  className?: string;
}) {
  const [time, setTime] = useState('--:--');
  useEffect(() => {
    const tick = () => setTime(formatTime(timeZone));
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, [timeZone]);
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2.5 rounded-full border border-line bg-card px-3.5 py-2 text-[13.5px] font-medium text-ink2',
        className,
      )}
    >
      <span
        aria-hidden='true'
        className='m-live size-2 rounded-full bg-brand'
      />
      {label}
      <span aria-hidden='true' className='text-line'>
        |
      </span>
      {place}
      <time className='tnum font-mono text-ink3' suppressHydrationWarning>
        {time}
      </time>
    </span>
  );
}

/** 44 px round icon button. `label` is the accessible name and is required. */
export function IconButton({
  label,
  href,
  external,
  children,
  className,
  onClick,
}: {
  label: string;
  href?: string;
  external?: boolean;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  if (href) {
    return (
      <Button asChild variant='outline' size='icon' className={className}>
        <a
          href={href}
          aria-label={label}
          {...(external
            ? { target: '_blank', rel: 'noopener noreferrer' }
            : {})}
        >
          {children}
        </a>
      </Button>
    );
  }
  return (
    <Button
      variant='outline'
      size='icon'
      aria-label={label}
      className={className}
      onClick={onClick}
    >
      {children}
    </Button>
  );
}

/** Loading placeholders. */
export function ProjectCardSkeleton() {
  return (
    <div
      aria-hidden='true'
      className='overflow-hidden rounded-project border border-line bg-card'
    >
      <Skeleton className='aspect-[16/10] w-full rounded-none' />
      <div className='space-y-3 p-6'>
        <Skeleton className='h-5 w-2/3' />
        <Skeleton className='h-4 w-full' />
        <Skeleton className='h-4 w-5/6' />
        <div className='flex gap-2 pt-1'>
          <Skeleton className='h-6 w-16 rounded-full' />
          <Skeleton className='h-6 w-20 rounded-full' />
        </div>
      </div>
    </div>
  );
}

export function TextSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div aria-hidden='true' className='space-y-2.5'>
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton
          // biome-ignore lint/suspicious/noArrayIndexKey: static placeholder lines
          key={i}
          className={cn('h-4', i === lines - 1 ? 'w-2/3' : 'w-full')}
        />
      ))}
    </div>
  );
}

export function ChipSkeleton() {
  return (
    <Skeleton aria-hidden='true' className='h-[46px] w-32 rounded-control' />
  );
}
