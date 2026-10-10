import { createFileRoute, Link, notFound } from '@tanstack/react-router';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { Reveal } from '@/components/reveal/reveal';
import { GithubIcon } from '@/components/site/brand-icons';
import { BrowserShot } from '@/components/site/project-card';
import { SiteNotFound } from '@/components/site/site-not-found';
import {
  Eyebrow,
  Pill,
  TextSkeleton,
} from '@/components/site-primitives/primitives';
import { Button } from '@/components/ui/button';
import { fetchPublicProject } from '@/server/fns/projects.functions';

export const Route = createFileRoute('/_site/projects/$id')({
  loader: async ({ params }) => {
    const project = await fetchPublicProject({ data: { id: params.id } });
    if (!project) throw notFound();
    return { project };
  },
  pendingComponent: () => (
    <div className='container py-16'>
      <TextSkeleton lines={6} />
    </div>
  ),
  head: ({ loaderData }) => {
    const p = loaderData?.project;
    if (!p) return {};
    const title = `${p.projectName} | TowhidKarim`;
    return {
      meta: [
        { title },
        { name: 'description', content: p.summary },
        { property: 'og:title', content: title },
        { property: 'og:description', content: p.summary },
        { property: 'og:image', content: p.imgUrl },
      ],
    };
  },
  notFoundComponent: SiteNotFound,
  component: ProjectPage,
});

function ProjectPage() {
  const { project } = Route.useLoaderData();
  return (
    <article className='container pt-10 pb-24'>
      <Button asChild variant='ghost' size='sm' className='-ml-4'>
        <Link to='/all-projects'>
          <ArrowLeft aria-hidden='true' />
          All projects
        </Link>
      </Button>
      <header className='mt-4'>
        <Eyebrow>Project</Eyebrow>
        <Reveal
          immediate
          variant='curtain'
          as='h1'
          className='mt-3.5 text-[36px] font-extrabold leading-[1.08] tracking-[-0.03em] sm:text-5xl'
        >
          {project.projectName}
        </Reveal>
        <p className='mt-4 max-w-[62ch] text-[17px] leading-[1.7] text-ink2'>
          {project.summary}
        </p>
      </header>
      <Reveal
        immediate
        index={2}
        className='mt-8 overflow-hidden rounded-project border border-line'
      >
        <BrowserShot
          project={project}
          eager
          heightClass='h-[240px] sm:h-[460px]'
        />
      </Reveal>
      <div className='mt-10 grid gap-10 lg:grid-cols-[1fr_300px]'>
        <div>
          {project.description ? (
            <p className='max-w-[62ch] whitespace-pre-line text-[17px] leading-[1.75] text-ink2'>
              {project.description}
            </p>
          ) : null}
        </div>
        <aside className='space-y-5'>
          {project.tags?.length ? (
            <ul className='flex flex-wrap gap-2'>
              {project.tags.map((t) => (
                <li key={t}>
                  <Pill>{t}</Pill>
                </li>
              ))}
            </ul>
          ) : null}
          <div className='flex flex-wrap gap-2.5'>
            <Button asChild>
              <a
                href={project.demoLink}
                target='_blank'
                rel='noopener noreferrer'
              >
                Live demo
                <ArrowUpRight aria-hidden='true' className='size-4' />
              </a>
            </Button>
            <Button asChild variant='outline'>
              <a
                href={project.sourceLink}
                target='_blank'
                rel='noopener noreferrer'
              >
                <GithubIcon className='size-[18px]' />
                Source code
              </a>
            </Button>
          </div>
        </aside>
      </div>
    </article>
  );
}
