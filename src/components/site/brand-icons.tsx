import { Bot, Brain, FileSignature, KeyRound, Library } from 'lucide-react';
import type { Skill } from '@/content/skills';

// lucide-react 1.x ships no brand marks, so they are inline SVG.
export function GithubIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox='0 0 24 24'
      width='20'
      height='20'
      fill='currentColor'
      aria-hidden='true'
      className={className}
    >
      <path d='M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.62 1.59.23 2.76.11 3.05.74.81 1.18 1.83 1.18 3.09 0 4.42-2.7 5.4-5.27 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z' />
    </svg>
  );
}

export function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox='0 0 24 24'
      width='20'
      height='20'
      fill='currentColor'
      aria-hidden='true'
      className={className}
    >
      <path d='M13.5 22v-8.2h2.8l.5-3.4h-3.3V8.3c0-1 .3-1.6 1.7-1.6h1.7V3.6c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.6H7.3v3.4h2.9V22h3.3Z' />
    </svg>
  );
}

const lucideIcons = { Brain, Library, Bot, FileSignature, KeyRound } as const;

/** Logo from public/icons (decorative: the label is the adjacent text) or a lucide icon. */
export function SkillIcon({
  skill,
  size = 20,
}: {
  skill: Skill;
  size?: number;
}) {
  if (skill.lucide) {
    const Icon = lucideIcons[skill.lucide];
    return <Icon aria-hidden='true' width={size} height={size} />;
  }
  return (
    <img
      src={`/icons/${encodeURIComponent(skill.icon ?? '')}`}
      alt=''
      width={size}
      height={size}
      loading='lazy'
      decoding='async'
      className='object-contain'
      style={{ width: size, height: size }}
    />
  );
}
