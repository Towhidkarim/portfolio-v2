import { Check, Copy, Mail, MapPin, Phone } from 'lucide-react';
import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Reveal } from '@/components/reveal/reveal';
import { Eyebrow } from '@/components/site-primitives/primitives';
import {
  contactSection,
  EMAIL,
  FACEBOOK_URL,
  GITHUB_URL,
  LOCATION,
  PHONE,
} from '@/content/site';
import { FacebookIcon, GithubIcon } from './brand-icons';

const ContactForm = lazy(() =>
  import('./contact-form').then((m) => ({ default: m.ContactForm })),
);

const rowIcon =
  'grid size-11 shrink-0 place-items-center rounded-control bg-[rgba(52,211,166,.12)] text-[#34D3A6]';
const darkIconButton =
  'grid size-11 place-items-center rounded-full border border-[#2A3644] text-[#F2F5F9] transition-colors hover:border-[#34D3A6]';

function CopyEmail() {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error('Could not copy', { description: EMAIL });
    }
  };
  return (
    <>
      <button
        type='button'
        onClick={copy}
        aria-label={contactSection.copyLabel}
        className='ml-auto grid size-11 shrink-0 place-items-center rounded-full border border-[#2A3644] text-[#A5B1C0] transition-colors hover:border-[#34D3A6] hover:text-[#F2F5F9]'
      >
        {copied ? (
          <Check aria-hidden='true' className='size-[18px] text-[#34D3A6]' />
        ) : (
          <Copy aria-hidden='true' className='size-[18px]' />
        )}
      </button>
      <span role='status' aria-live='polite' className='sr-only'>
        {copied ? 'Email address copied' : ''}
      </span>
    </>
  );
}

// Always dark, full bleed. Turnstile is added in Phase 8.
export function ContactBand() {
  return (
    <section
      id='contact'
      aria-labelledby='contact-title'
      className='relative mt-[72px] scroll-mt-0 overflow-hidden bg-panel py-[72px] text-[#F2F5F9] sm:mt-[120px] sm:py-[100px]'
    >
      <div
        aria-hidden='true'
        className='pointer-events-none absolute -top-40 -right-40 size-[560px] rounded-full bg-[radial-gradient(circle,rgba(52,211,166,.14),transparent_65%)]'
      />
      <div className='container relative grid gap-12 lg:grid-cols-2 lg:gap-16'>
        <div className='min-w-0'>
          <Eyebrow className='text-[#34D3A6] [&>i]:bg-[#34D3A6]'>
            {contactSection.eyebrow}
          </Eyebrow>
          <Reveal
            as='h2'
            variant='curtain'
            id='contact-title'
            className='mt-3.5 text-[40px] font-extrabold leading-[1.08] tracking-[-0.03em] sm:text-5xl'
          >
            {contactSection.title}
          </Reveal>
          <Reveal
            variant='draw'
            delay={0.2}
            aria-hidden='true'
            className='mt-[18px] h-1 w-14 rounded bg-[#34D3A6]'
          />
          <p className='mt-3.5 max-w-[460px] text-[17px] leading-[1.65] text-[#A5B1C0]'>
            {contactSection.sub}
          </p>
          <ul className='mt-9 space-y-4'>
            <li className='flex items-center gap-3.5'>
              <span className={rowIcon}>
                <Mail aria-hidden='true' className='size-5' />
              </span>
              <a
                href={`mailto:${EMAIL}`}
                className='min-w-0 truncate text-[15px] font-medium sm:text-base'
              >
                {EMAIL}
              </a>
              <CopyEmail />
            </li>
            <li className='flex items-center gap-3.5'>
              <span className={rowIcon}>
                <MapPin aria-hidden='true' className='size-5' />
              </span>
              <span className='text-[15px] font-medium sm:text-base'>
                {LOCATION}
              </span>
            </li>
            <li className='flex items-center gap-3.5'>
              <span className={rowIcon}>
                <Phone aria-hidden='true' className='size-5' />
              </span>
              <a
                href={`tel:${PHONE.replace(/[^+\d]/g, '')}`}
                className='text-[15px] font-medium sm:text-base'
              >
                {PHONE}
              </a>
            </li>
          </ul>
          <div className='mt-8 flex gap-3'>
            <a
              href={GITHUB_URL}
              aria-label='GitHub profile'
              target='_blank'
              rel='noopener noreferrer'
              className={darkIconButton}
            >
              <GithubIcon />
            </a>
            <a
              href={FACEBOOK_URL}
              aria-label='Facebook profile'
              target='_blank'
              rel='noopener noreferrer'
              className={darkIconButton}
            >
              <FacebookIcon />
            </a>
          </div>
        </div>
        <Reveal className='min-w-0'>
          <Suspense
            fallback={
              <div className='min-h-[420px] rounded-project border border-[#1D2733] bg-[#0E161E]' />
            }
          >
            <ContactForm />
          </Suspense>
        </Reveal>
      </div>
    </section>
  );
}
