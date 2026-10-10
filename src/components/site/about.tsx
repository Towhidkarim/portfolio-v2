import { MapPin } from 'lucide-react';
import { Reveal } from '@/components/reveal/reveal';
import { SectionHeader } from '@/components/site-primitives/primitives';
import { Button } from '@/components/ui/button';
import {
  aboutSection,
  FACEBOOK_URL,
  GITHUB_URL,
  LOCATION,
} from '@/content/site';
import { FacebookIcon, GithubIcon } from './brand-icons';

export function About() {
  const [lead, body] = aboutSection.paragraphs;
  return (
    <section
      id='about'
      aria-labelledby='about-title'
      className='mt-[72px] scroll-mt-24 sm:mt-[120px]'
    >
      <SectionHeader
        id='about-title'
        eyebrow={aboutSection.eyebrow}
        title={aboutSection.title}
        sub={aboutSection.sub}
      />
      <div className='mt-10 grid gap-10 lg:grid-cols-[420px_1fr] lg:gap-[72px]'>
        <Reveal>
          <div className='relative h-[420px] overflow-hidden rounded-[28px] border border-line bg-pill sm:h-[540px]'>
            <img
              src='/images/dp.jpg'
              alt={aboutSection.photoAlt}
              width={720}
              height={960}
              loading='lazy'
              decoding='async'
              className='size-full object-cover'
            />
            <span className='absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-[rgba(2,8,23,.72)] px-3.5 py-2 text-[13px] font-medium text-white backdrop-blur-sm'>
              <MapPin aria-hidden='true' className='size-3.5' />
              {LOCATION}
            </span>
          </div>
          <div className='mt-4 grid grid-cols-2 gap-3'>
            <Button asChild>
              <a href={GITHUB_URL} target='_blank' rel='noopener noreferrer'>
                <GithubIcon className='size-[18px]' />
                Github
              </a>
            </Button>
            <Button asChild variant='outline'>
              <a href={FACEBOOK_URL} target='_blank' rel='noopener noreferrer'>
                <FacebookIcon className='size-[18px]' />
                Facebook
              </a>
            </Button>
          </div>
        </Reveal>
        <div className='min-w-0 self-center'>
          <Reveal
            as='p'
            className='max-w-[62ch] text-[17px] leading-[1.7] sm:text-[19px]'
          >
            {lead}
          </Reveal>
          <Reveal
            as='p'
            index={1}
            className='mt-5 max-w-[62ch] text-base leading-[1.75] text-ink2 sm:text-[17px]'
          >
            {body}
          </Reveal>
          <Reveal index={2}>
            <dl className='mt-9 grid grid-cols-1 gap-x-8 sm:grid-cols-2'>
              {aboutSection.facts.map(([label, value]) => (
                <div key={label} className='border-t border-line py-4'>
                  <dt className='font-mono text-[11.5px] uppercase tracking-[0.14em] text-ink3'>
                    {label}
                  </dt>
                  <dd className='mt-1.5 text-[17px] font-semibold'>{value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
