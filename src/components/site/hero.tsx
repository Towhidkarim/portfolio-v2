import { Download, Eye } from 'lucide-react';
import type { CSSProperties } from 'react';
// Inlined, so it follows the light/dark class with no extra request. Built by
// `bun run illustration:build` (scripts/hero-illustration).
import illustration from '@/assets/hero-illustration.svg?raw';
import { Reveal } from '@/components/reveal/reveal';
import { StatusPill } from '@/components/site-primitives/primitives';
import { Button } from '@/components/ui/button';
import { hero, RESUME_DOWNLOAD_URL, RESUME_PREVIEW_URL } from '@/content/site';

const floating = [
  {
    name: 'React',
    src: '/icons/React.svg',
    cls: 'm-float left-0 top-[34%]',
  },
  {
    name: 'TypeScript',
    src: '/icons/TypeScript.svg',
    cls: 'm-float-2 right-[2%] top-[2%]',
  },
  {
    name: 'Claude',
    src: '/icons/claude.svg',
    cls: 'm-float-3 right-[-2%] top-[62%]',
  },
  {
    name: 'Next.js',
    src: '/icons/nextjs-icon.svg',
    cls: 'm-float-4 bottom-[3%] left-[8%]',
    mono: true,
  },
] as const;

const phraseLength = (s: string) => ({ '--n': s.length }) as CSSProperties;

export function Hero() {
  const [first, second] = hero.roles;
  return (
    <section
      id='home'
      aria-labelledby='hero-title'
      className='relative grid min-h-0 scroll-mt-24 items-center gap-8 pt-10 lg:min-h-[520px] lg:grid-cols-[1.1fr_.9fr] lg:gap-[30px] lg:pt-11'
    >
      <div className='min-w-0'>
        <Reveal immediate>
          <StatusPill label={hero.status} place={hero.place} />
        </Reveal>
        <Reveal
          immediate
          index={1}
          as='p'
          className='mt-6 text-[19px] text-ink2 sm:text-[23px]'
        >
          {hero.hello}
        </Reveal>
        <Reveal
          immediate
          variant='curtain'
          as='h1'
          id='hero-title'
          delay={0.1}
          className='mt-1 text-[44px] font-extrabold leading-[1.02] tracking-[-0.04em] sm:text-[60px] lg:text-[72px]'
        >
          {hero.name}
        </Reveal>
        <Reveal immediate index={3} className='mt-4 min-w-0'>
          {/* Phrase two is 43 characters and cannot wrap: smaller type on phones */}
          <div
            className='typer min-w-0 overflow-hidden text-base sm:text-[22px]'
            role='img'
            aria-label={first}
          >
            <div className='typer-ph typer-a' style={phraseLength(first)}>
              <span className='typer-tx'>{first}</span>
              <span className='typer-cr'>
                <i />
              </span>
            </div>
            <div
              className='typer-ph typer-b'
              style={phraseLength(second)}
              aria-hidden='true'
            >
              <span className='typer-tx'>{second}</span>
              <span className='typer-cr'>
                <i />
              </span>
            </div>
          </div>
        </Reveal>
        <Reveal
          immediate
          index={4}
          as='p'
          className='mt-6 max-w-[520px] text-[16px] leading-[1.75] text-ink2 sm:text-[17px]'
        >
          {hero.intro}
        </Reveal>
        <Reveal
          immediate
          index={5}
          className='mt-8 flex flex-col gap-3 sm:flex-row'
        >
          <Button asChild size='lg' className='sm:h-12'>
            <a
              href={RESUME_PREVIEW_URL}
              target='_blank'
              rel='noopener noreferrer'
            >
              <Eye aria-hidden='true' />
              {hero.preview}
            </a>
          </Button>
          <Button asChild size='lg' variant='outline' className='sm:h-12'>
            <a href={RESUME_DOWNLOAD_URL} download='Towhid_karim_resume.pdf'>
              <Download aria-hidden='true' />
              {hero.download}
            </a>
          </Button>
        </Reveal>
      </div>

      {/* no Reveal here: the illustration plays its own entrance */}
      <div className='relative mx-auto aspect-square w-[330px] max-w-full sm:w-[420px] lg:w-[500px]'>
        <div
          aria-hidden='true'
          className='relative size-full [&>svg]:size-full'
          // biome-ignore lint/security/noDangerouslySetInnerHtml: our own build-time SVG, no user input
          dangerouslySetInnerHTML={{ __html: illustration }}
        />
        {floating.map((f) => (
          <span
            key={f.name}
            className={`${f.cls} absolute grid size-[52px] place-items-center rounded-2xl border border-line bg-card shadow-card sm:size-[60px]`}
          >
            <span
              className={`grid size-9 place-items-center rounded-lg ${'mono' in f ? 'bg-plate' : ''}`}
            >
              <img
                src={encodeURI(f.src)}
                alt=''
                width={30}
                height={30}
                decoding='async'
                className='size-[30px] object-contain'
              />
            </span>
          </span>
        ))}
      </div>
    </section>
  );
}
