import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';
import { Reveal } from '@/components/reveal/reveal';
import { ProjectCard } from '@/components/site/project-card';
import { ProjectsState } from '@/components/site/projects-section';
import { SectionHeader } from '@/components/site-primitives/primitives';
import { Button } from '@/components/ui/button';
import { projectsSection } from '@/content/site';
import { fetchPublicProjects } from '@/server/fns/projects.functions';

export const Route = createFileRoute('/_site/all-projects')({
  loader: async () => {
    const projects = await fetchPublicProjects().catch(() => null);
    return { projects: projects ?? [], failed: projects === null };
  },
  // shown on client navigations only; the first load is server-rendered
  pendingComponent: () => (
    <div className='container py-16'>
      <ProjectsState kind='loading' />
    </div>
  ),
  head: () => ({
    meta: [
      { title: 'All projects | TowhidKarim' },
      {
        name: 'description',
        content: 'Every project Towhid Karim has built and shipped.',
      },
    ],
  }),
  component: AllProjects,
});

function AllProjects() {
  const { projects, failed } = Route.useLoaderData();
  return (
    <div className='container pt-10 pb-24'>
      <Button asChild variant='ghost' size='sm' className='-ml-4'>
        <Link to='/'>
          <ArrowLeft aria-hidden='true' />
          Back to home
        </Link>
      </Button>
      <SectionHeader
        as='h1'
        eyebrow={projectsSection.eyebrow}
        title='All Projects'
        sub={projectsSection.sub}
        className='mt-4'
      />
      <div className='mt-10'>
        {failed ? (
          <ProjectsState kind='error' />
        ) : projects.length === 0 ? (
          <ProjectsState kind='empty' />
        ) : (
          <div className='grid gap-6 md:grid-cols-2'>
            {projects.map((p, i) => (
              <Reveal key={p.id} index={i % 2}>
                <ProjectCard project={p} eager={i < 2} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
