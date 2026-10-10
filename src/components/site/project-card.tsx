import { Link } from '@tanstack/react-router';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Pill } from '@/components/site-primitives/primitives';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { GithubIcon } from './brand-icons';

// Plain shape: what the public server functions return (dates/JSON already plain).
export type PublicProject = {
  id: string;
  projectName: string;
  summary: string;
  description: string | null;
  imgUrl: string;
  tags: string[] | null;
  demoLink: string;
  sourceLink: string;
};

const host = (url: string) => {
  try {
    return new URL(url).host;
  } catch {
    return url;
  }
};

/** Browser-chrome frame around the screenshot. Decorative chrome, meaningful image. */
export function BrowserShot({
  project,
  eager,
  heightClass,
}: {
  project: PublicProject;
  eager?: boolean;
  heightClass: string;
}) {
  return (
    <div
      className={cn(
        'relative overflow-hidden bg-gradient-to-b from-brand-soft to-transparent px-4 pt-4 sm:px-6 sm:pt-6',
        heightClass,
      )}
    >
      <div className='shot h-full overflow-hidden rounded-t-xl border border-b-0 border-line bg-card shadow-[0_18px_40px_-26px_rgba(2,8,23,.35)]'>
        <div
          aria-hidden='true'
          className='flex h-9 items-center gap-1.5 border-b border-line px-3.5'
        >
          {[0, 1, 2].map((i) => (
            <i key={i} className='block size-2 rounded-full bg-pill' />
          ))}
          <span className='ml-3 max-w-[60%] truncate rounded-full bg-surface px-2.5 py-0.5 font-mono text-[11px] text-ink3'>
            {host(project.demoLink)}
          </span>
        </div>
        <img
          src={project.imgUrl}
          alt={`Screenshot of ${project.projectName}`}
          width={1280}
          height={800}
          loading={eager ? 'eager' : 'lazy'}
          decoding='async'
          className='size-full object-cover object-top'
        />
      </div>
    </div>
  );
}

export function ProjectActions({ project }: { project: PublicProject }) {
  return (
    <div className='relative z-10 mt-5 flex flex-wrap items-center gap-2.5'>
      <Button asChild>
        <Link to='/projects/$id' params={{ id: project.id }}>
          View Details
          <ArrowRight aria-hidden='true' />
        </Link>
      </Button>
      <Button asChild variant='outline'>
        <a href={project.demoLink} target='_blank' rel='noopener noreferrer'>
          Live demo
          <ArrowUpRight aria-hidden='true' className='size-4' />
        </a>
      </Button>
      <Button asChild variant='outline' size='icon'>
        <a
          href={project.sourceLink}
          aria-label={`Source code for ${project.projectName}`}
          target='_blank'
          rel='noopener noreferrer'
        >
          <GithubIcon />
        </a>
      </Button>
    </div>
  );
}

function Title({
  project,
  className,
}: {
  project: PublicProject;
  className?: string;
}) {
  return (
    <div className='flex items-center gap-4'>
      <h3 className={cn('font-bold tracking-[-0.02em]', className)}>
        <Link
          to='/projects/$id'
          params={{ id: project.id }}
          // stretched link: the whole card is clickable, inner buttons stay independent
          className='after:absolute after:inset-0 after:content-[""] focus-visible:outline-none after:focus-visible:rounded-project after:focus-visible:outline-2 after:focus-visible:outline-offset-3 after:focus-visible:outline-brand'
        >
          {project.projectName}
        </Link>
      </h3>
      <span aria-hidden='true' className='h-0.5 min-w-8 flex-1 bg-brand' />
    </div>
  );
}

function Tags({ tags }: { tags: string[] | null }) {
  if (!tags?.length) return null;
  return (
    <ul className='mt-4 flex flex-wrap gap-2'>
      {tags.map((t) => (
        <li key={t}>
          <Pill>{t}</Pill>
        </li>
      ))}
    </ul>
  );
}

export function ProjectCard({
  project,
  eager,
}: {
  project: PublicProject;
  eager?: boolean;
}) {
  return (
    <article className='group relative flex h-full flex-col overflow-hidden rounded-project border border-line bg-card transition-[translate,transform,box-shadow,border-color] duration-[350ms] hover:border-brand hover:shadow-card motion-safe:hover:-translate-y-1'>
      <div className='[&_.shot]:origin-center [&_.shot]:transition-transform [&_.shot]:duration-[600ms] group-hover:[&_.shot]:scale-[1.03]'>
        <BrowserShot
          project={project}
          eager={eager}
          heightClass='h-[190px] sm:h-[230px]'
        />
      </div>
      <div className='flex flex-1 flex-col p-6 pt-6'>
        <Title project={project} className='text-[22px] leading-[1.2]' />
        <p className='mt-3 text-[15px] leading-[1.65] text-ink2'>
          {project.summary}
        </p>
        <Tags tags={project.tags} />
        <div className='mt-auto'>
          <ProjectActions project={project} />
        </div>
      </div>
    </article>
  );
}

export function FeaturedProject({
  project,
  label,
}: {
  project: PublicProject;
  label: string;
}) {
  return (
    <article className='group relative grid overflow-hidden rounded-project border border-line bg-card transition-[translate,transform,box-shadow,border-color] duration-[350ms] hover:border-brand hover:shadow-card motion-safe:hover:-translate-y-1 lg:grid-cols-[1.15fr_1fr]'>
      <div className='[&_.shot]:origin-center [&_.shot]:transition-transform [&_.shot]:duration-[600ms] group-hover:[&_.shot]:scale-[1.03]'>
        <BrowserShot
          project={project}
          eager
          heightClass='h-[210px] sm:h-[380px]'
        />
      </div>
      <div className='flex flex-col justify-center p-6 sm:p-9'>
        <p className='font-mono text-xs uppercase tracking-[0.14em] text-brand-ink'>
          {label}
        </p>
        <div className='mt-3'>
          <Title
            project={project}
            className='text-2xl leading-[1.2] sm:text-[30px]'
          />
        </div>
        <p className='mt-4 text-base leading-[1.7] text-ink2 sm:text-[17px]'>
          {project.summary}
        </p>
        <Tags tags={project.tags} />
        <ProjectActions project={project} />
      </div>
    </article>
  );
}
