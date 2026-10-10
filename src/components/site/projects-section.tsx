import { Link, useRouter } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';
import { Reveal } from '@/components/reveal/reveal';
import {
  ProjectCardSkeleton,
  SectionHeader,
} from '@/components/site-primitives/primitives';
import { Button } from '@/components/ui/button';
import { projectsSection } from '@/content/site';
import { ActivityCard, type ContributionData } from './activity-card';
import {
  FeaturedProject,
  ProjectCard,
  type PublicProject,
} from './project-card';

/** Loading, empty and error states shared by the home section and /all-projects. */
export function ProjectsState({
  kind,
}: {
  kind: 'empty' | 'error' | 'loading';
}) {
  const router = useRouter();
  if (kind === 'loading') {
    return (
      <div
        className='grid gap-6 md:grid-cols-2'
        role='status'
        aria-label='Loading projects'
      >
        {[0, 1, 2].map((i) => (
          <ProjectCardSkeleton key={i} />
        ))}
      </div>
    );
  }
  return (
    <div className='rounded-card border border-line bg-card p-10 text-center'>
      <p className='text-[17px] text-ink2'>
        {kind === 'empty' ? projectsSection.empty : projectsSection.error}
      </p>
      {kind === 'error' ? (
        <Button
          variant='outline'
          className='mt-5'
          onClick={() => router.invalidate()}
        >
          {projectsSection.retry}
        </Button>
      ) : null}
    </div>
  );
}

export function ProjectsSection({
  projects,
  failed,
  contributions,
}: {
  projects: PublicProject[];
  failed: boolean;
  contributions: ContributionData;
}) {
  const [featured, ...rest] = projects;
  return (
    <section
      id='projects'
      aria-labelledby='projects-title'
      className='mt-[72px] scroll-mt-24 sm:mt-[120px]'
    >
      <SectionHeader
        id='projects-title'
        eyebrow={projectsSection.eyebrow}
        title={projectsSection.title}
        sub={projectsSection.sub}
      />
      <div className='mt-10'>
        {failed ? (
          <ProjectsState kind='error' />
        ) : !featured ? (
          <ProjectsState kind='empty' />
        ) : (
          <div className='grid gap-6 md:grid-cols-2'>
            <Reveal className='md:col-span-2'>
              <FeaturedProject
                project={featured}
                label={projectsSection.featured}
              />
            </Reveal>
            {rest.slice(0, 2).map((p, i) => (
              <Reveal key={p.id} index={i}>
                <ProjectCard project={p} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
      {!failed && projects.length > 0 ? (
        <div className='mt-9 flex justify-center'>
          <Button asChild variant='outline'>
            <Link to='/all-projects'>
              {projectsSection.viewAll}
              <ArrowRight aria-hidden='true' />
            </Link>
          </Button>
        </div>
      ) : null}
      <Reveal className='mt-8'>
        <ActivityCard data={contributions} />
      </Reveal>
    </section>
  );
}
