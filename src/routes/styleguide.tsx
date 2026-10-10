import { createFileRoute } from '@tanstack/react-router';
import { ArrowRight, Mail } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Reveal } from '@/components/reveal/reveal';
import {
  Chip,
  ChipSkeleton,
  Eyebrow,
  IconButton,
  Pill,
  ProjectCardSkeleton,
  SectionHeader,
  StatusPill,
  TextSkeleton,
} from '@/components/site-primitives/primitives';
import { ThemeToggle } from '@/components/theme-toggle';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

// Hidden QA page: not linked, noindex, never cached (root default is no-store).
export const Route = createFileRoute('/styleguide')({
  head: () => ({
    meta: [
      { title: 'Styleguide | Towhid Karim' },
      { name: 'robots', content: 'noindex, nofollow' },
    ],
  }),
  component: Styleguide,
});

const swatches = [
  ['bg', 'Background'],
  ['surface', 'Surface'],
  ['ink', 'Ink'],
  ['ink2', 'Ink 2'],
  ['ink3', 'Ink 3'],
  ['line', 'Line'],
  ['brand', 'Brand'],
  ['brandink', 'Brand ink'],
  ['brandsoft', 'Brand soft'],
  ['curtain', 'Curtain'],
  ['card', 'Card'],
  ['pill', 'Pill'],
  ['panel', 'Panel'],
] as const;

const GithubIcon = () => (
  <svg
    viewBox='0 0 24 24'
    width='20'
    height='20'
    fill='currentColor'
    aria-hidden='true'
  >
    <path d='M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.62 1.59.23 2.76.11 3.05.74.81 1.18 1.83 1.18 3.09 0 4.42-2.7 5.4-5.27 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z' />
  </svg>
);

function Block({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className='border-t border-line py-12' aria-label={title}>
      <Eyebrow>{title}</Eyebrow>
      <div className={className ?? 'mt-6'}>{children}</div>
    </section>
  );
}

function Styleguide() {
  const [run, setRun] = useState(0);
  useEffect(() => {
    // new elements mount without data-in; ask the page observer to pick them up
    if (run > 0) window.__revealScan?.();
  }, [run]);

  return (
    <main id='main' className='container pt-12 pb-32'>
      <div className='flex items-start justify-between gap-4'>
        <div>
          <Eyebrow>QA page</Eyebrow>
          <h1 className='mt-3.5 text-[40px] font-extrabold leading-[1.08] tracking-[-0.03em]'>
            Styleguide
          </h1>
          <p className='mt-3.5 max-w-[560px] text-[17px] leading-[1.65] text-ink2'>
            Every shared component in light and dark. Compare against the
            screens in docs/migration/design.
          </p>
        </div>
        <ThemeToggle />
      </div>

      <Block
        title='Colour tokens'
        className='mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7'
      >
        {swatches.map(([token, label]) => (
          <div key={token} className='rounded-control border border-line p-2'>
            <div
              className='h-12 rounded-lg border border-line'
              style={{ background: `var(--${token})` }}
            />
            <p className='mt-2 text-[13px] font-medium'>{label}</p>
            <p className='font-mono text-[11px] text-ink3'>--{token}</p>
          </div>
        ))}
      </Block>

      <Block title='Type'>
        <p className='text-[72px] font-extrabold leading-[1.02] tracking-[-0.04em]'>
          Display 72
        </p>
        <p className='mt-6 text-[40px] font-extrabold leading-[1.08] tracking-[-0.03em]'>
          H2 section title 40
        </p>
        <p className='mt-6 text-[26px] font-bold leading-[1.2] tracking-[-0.02em]'>
          H3 card title 26
        </p>
        <p className='mt-6 max-w-[62ch] text-[17px] leading-[1.7] text-ink2'>
          Body 17/1.7 in Poppins 400, colour ink2. Lines stay under about 62
          characters so paragraphs stay comfortable to read.
        </p>
        <p className='mt-6 font-mono text-xs uppercase tracking-[0.14em] text-brand-ink'>
          Eyebrow, JetBrains Mono 12
        </p>
        <p className='tnum mt-3 font-mono text-[13px] text-ink3'>
          0123456789 mono and tabular numbers
        </p>
      </Block>

      <Block title='Buttons' className='mt-6 flex flex-wrap items-center gap-3'>
        <Button>
          Primary <ArrowRight aria-hidden='true' />
        </Button>
        <Button variant='outline'>Secondary</Button>
        <Button variant='secondary'>Subtle</Button>
        <Button variant='ghost'>Ghost</Button>
        <Button variant='destructive'>Delete</Button>
        <Button variant='link'>Link button</Button>
        <Button disabled>Disabled</Button>
        <Button size='sm'>Small</Button>
        <Button size='lg'>Large</Button>
        <IconButton
          label='GitHub'
          href='https://github.com/Towhidkarim/'
          external
        >
          <GithubIcon />
        </IconButton>
        <IconButton label='Email' onClick={() => toast('Clicked')}>
          <Mail aria-hidden='true' />
        </IconButton>
        <div className='rounded-card bg-panel p-4'>
          <Button variant='brand'>On the dark panel</Button>
        </div>
      </Block>

      <Block
        title='Chips, pills, status'
        className='mt-6 flex flex-wrap items-center gap-3'
      >
        <Chip icon={<span className='font-mono text-xs'>TS</span>}>
          TypeScript
        </Chip>
        <Chip icon={<span className='font-mono text-xs'>Rx</span>}>React</Chip>
        <Pill>React</Pill>
        <Pill tone='brand'>Featured</Pill>
        <Badge variant='outline'>Outline</Badge>
        <Badge variant='destructive'>Error</Badge>
        <StatusPill label='Software Engineer at Chorcha' place='Rajshahi' />
      </Block>

      <Block title='Section header (curtain, bar, sub)'>
        <SectionHeader
          eyebrow='02 · Selected work'
          title='My Projects'
          sub='What I have built and shipped. Every card opens a full write-up.'
          key={run}
        />
        <div className='mt-6'>
          <Button variant='outline' onClick={() => setRun((n) => n + 1)}>
            Replay reveals
          </Button>
        </div>
      </Block>

      <Block title='Reveal variants' className='mt-6 grid gap-4 md:grid-cols-3'>
        {(['rise', 'draw', 'curtain'] as const).map((variant) => (
          <div
            key={`${variant}-${run}`}
            className='rounded-card border border-line bg-card p-6'
          >
            <p className='font-mono text-xs uppercase tracking-[0.14em] text-ink3'>
              {variant}
            </p>
            {variant === 'rise' && (
              <Reveal className='mt-4'>
                <p className='text-lg font-semibold'>
                  Rises 12 px and fades in
                </p>
                <p className='mt-1 text-sm text-ink2'>
                  Cards, paragraphs, stats.
                </p>
              </Reveal>
            )}
            {variant === 'draw' && (
              <Reveal
                variant='draw'
                aria-hidden='true'
                className='mt-6 h-1 w-full rounded bg-brand'
              />
            )}
            {variant === 'curtain' && (
              <Reveal
                as='p'
                variant='curtain'
                className='mt-4 text-3xl font-extrabold tracking-[-0.03em]'
              >
                Curtain wipe
              </Reveal>
            )}
          </div>
        ))}
      </Block>

      <Block title='Ambient motion' className='mt-6 grid gap-6 md:grid-cols-2'>
        <div
          className='typer min-w-0 overflow-hidden text-base sm:text-[22px]'
          role='img'
          aria-label='A Full-Stack Engineer'
        >
          <div
            className='typer-ph typer-a'
            style={{ '--n': 21 } as React.CSSProperties}
          >
            <span className='typer-tx'>A Full-Stack Engineer</span>
            <span className='typer-cr'>
              <i />
            </span>
          </div>
          <div
            className='typer-ph typer-b'
            style={{ '--n': 43 } as React.CSSProperties}
            aria-hidden='true'
          >
            <span className='typer-tx'>
              Crafting Scalable Apps with React &amp; Next.js
            </span>
            <span className='typer-cr'>
              <i />
            </span>
          </div>
        </div>
        <div className='flex min-w-0 gap-4'>
          {['m-float', 'm-float-2', 'm-float-3', 'm-float-4'].map((cls, i) => (
            <span
              key={cls}
              className={`${cls} grid size-[60px] place-items-center rounded-2xl border border-line bg-card font-mono text-sm`}
            >
              {['Re', 'Tw', 'Nx', 'Ts'][i]}
            </span>
          ))}
        </div>
        <div className='m-marquee md:col-span-2'>
          <div className='m-marquee-track'>
            {[0, 1].map((copy) => (
              <div
                key={copy}
                className='flex gap-3 pr-3'
                aria-hidden={copy === 1 ? true : undefined}
              >
                {[
                  'React',
                  'Next.js',
                  'TypeScript',
                  'Tailwind',
                  'Node.js',
                  'Drizzle',
                  'Cloudflare',
                  'PostgreSQL',
                ].map((n) => (
                  <span
                    key={n}
                    className='inline-flex h-12 items-center rounded-full border border-line bg-card px-5 text-sm font-medium text-ink2'
                  >
                    {n}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
        <Reveal
          key={`hm-${run}`}
          className='m-hm overflow-hidden [--cg:3px] [--cs:12px]'
          aria-hidden='true'
        >
          {Array.from({ length: 26 }, (_, c) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: static decorative grid
              key={c}
              className='m-hm-col grid'
              style={{ '--c': c } as React.CSSProperties}
            >
              {Array.from({ length: 7 }, (_, r) => (
                <i
                  // biome-ignore lint/suspicious/noArrayIndexKey: static decorative grid
                  key={r}
                  className='block size-3 rounded-[3px]'
                  style={{ background: `var(--h${(c * 7 + r * 3) % 5})` }}
                />
              ))}
            </div>
          ))}
        </Reveal>
        <div className='flex flex-wrap gap-2 rounded-card bg-panel p-4'>
          {['Prompt', 'Plan', 'Build', 'Review'].map((s, i) => (
            <span
              key={s}
              className='m-step inline-flex h-9 items-center rounded-full border border-[#2A3644] px-3.5 text-[13px] font-semibold text-[#C5D0DD]'
              style={
                {
                  '--stepbg': '#34D3A6',
                  '--steplit': '#06241C',
                  animationDelay: `${i * 1.5 - 6}s`,
                } as React.CSSProperties
              }
            >
              {s}
            </span>
          ))}
        </div>
      </Block>

      <Block
        title='Project card (sample)'
        className='mt-6 grid gap-6 md:grid-cols-2'
      >
        <article className='group overflow-hidden rounded-project border border-line bg-card transition-[translate,transform,box-shadow,border-color] duration-300 hover:border-brand hover:shadow-card motion-safe:hover:-translate-y-1'>
          <div className='aspect-[16/10] overflow-hidden bg-pill'>
            <div className='size-full bg-pill transition-transform duration-500 group-hover:scale-[1.03]' />
          </div>
          <div className='p-6'>
            <h3 className='text-[22px] font-bold tracking-[-0.02em]'>
              [Project name]
            </h3>
            <p className='mt-2 text-[15px] leading-[1.65] text-ink2'>
              [One line on what it does and who it is for.]
            </p>
            <div className='mt-4 flex flex-wrap gap-2'>
              <Pill>React</Pill>
              <Pill>TypeScript</Pill>
            </div>
            <div className='mt-5 flex items-center gap-2'>
              <Button size='sm'>View Details</Button>
              <Button size='sm' variant='outline'>
                Live demo
              </Button>
              <IconButton
                label='Source code'
                href='https://github.com/Towhidkarim/'
                external
                className='size-10'
              >
                <GithubIcon />
              </IconButton>
            </div>
          </div>
        </article>
        <ProjectCardSkeleton />
      </Block>

      <Block title='Form fields' className='mt-6 grid gap-6 md:grid-cols-2'>
        <form className='space-y-4' onSubmit={(e) => e.preventDefault()}>
          <div>
            <Label htmlFor='sg-name'>Name</Label>
            <Input id='sg-name' placeholder='Your name' />
          </div>
          <div>
            <Label htmlFor='sg-mail'>Email</Label>
            <Input
              id='sg-mail'
              type='email'
              placeholder='you@company.com'
              aria-invalid
            />
          </div>
          <div>
            <Label htmlFor='sg-msg'>Message</Label>
            <Textarea id='sg-msg' placeholder='How can I help?' />
          </div>
          <div className='flex items-center gap-3'>
            <Switch id='sg-sw' defaultChecked />
            <Label htmlFor='sg-sw' className='mb-0'>
              Enabled
            </Label>
          </div>
        </form>
        <div className='rounded-card bg-panel p-6 text-[#F2F5F9]'>
          <p className='font-mono text-xs uppercase tracking-[0.14em] text-[#34D3A6]'>
            05 · Contact (always dark)
          </p>
          <form className='mt-4 space-y-4' onSubmit={(e) => e.preventDefault()}>
            <div>
              <Label tone='panel' htmlFor='sg-pn'>
                Name
              </Label>
              <Input tone='panel' id='sg-pn' placeholder='Your name' />
            </div>
            <div>
              <Label tone='panel' htmlFor='sg-pm'>
                Message
              </Label>
              <Textarea tone='panel' id='sg-pm' placeholder='How can I help?' />
            </div>
            <Button variant='brand' type='submit'>
              Send message
            </Button>
          </form>
        </div>
      </Block>

      <Block
        title='Overlays, tabs, toast'
        className='mt-6 flex flex-wrap items-start gap-4'
      >
        <Dialog>
          <DialogTrigger asChild>
            <Button variant='outline'>Open dialog</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Dialog title</DialogTitle>
              <DialogDescription>
                Radius 22, line border, focus is trapped.
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
        <Button
          variant='outline'
          onClick={() =>
            toast.success('Message sent', {
              description: 'Thanks, I will reply soon.',
            })
          }
        >
          Show toast
        </Button>
        <Tabs defaultValue='a' className='w-72'>
          <TabsList>
            <TabsTrigger value='a'>Inbox</TabsTrigger>
            <TabsTrigger value='b'>Archived</TabsTrigger>
          </TabsList>
          <TabsContent value='a' className='text-sm text-ink2'>
            Inbox content
          </TabsContent>
          <TabsContent value='b' className='text-sm text-ink2'>
            Archived content
          </TabsContent>
        </Tabs>
      </Block>

      <Block title='Skeletons' className='mt-6 space-y-4'>
        <TextSkeleton lines={3} />
        <div className='flex gap-3'>
          <ChipSkeleton />
          <ChipSkeleton />
        </div>
      </Block>
    </main>
  );
}
