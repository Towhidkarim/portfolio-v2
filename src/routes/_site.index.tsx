import { createFileRoute } from '@tanstack/react-router';
import { About } from '@/components/site/about';
import { ContactBand } from '@/components/site/contact-band';
import { Education } from '@/components/site/education';
import { Hero } from '@/components/site/hero';
import { ProjectsSection } from '@/components/site/projects-section';
import { ProofStrip } from '@/components/site/proof-strip';
import { SkillsBento } from '@/components/site/skills-bento';
import { StackMarquee } from '@/components/site/stack-marquee';
import { SITE } from '@/content/site';
import { getContributions } from '@/server/fns/contributions.functions';
import { fetchPublicProjects } from '@/server/fns/projects.functions';

export const Route = createFileRoute('/_site/')({
  loader: async () => {
    const [projects, contributions] = await Promise.all([
      // a failed project query must not take the whole page down: show the error state
      fetchPublicProjects().catch(() => null),
      getContributions(),
    ]);
    return {
      projects: projects ?? [],
      failed: projects === null,
      contributions,
    };
  },
  head: () => ({
    scripts: [
      {
        type: 'application/ld+json',
        children: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: SITE.name,
          jobTitle: SITE.jobTitle,
          sameAs: SITE.sameAs,
        }),
      },
    ],
  }),
  component: Home,
});

function Home() {
  const { projects, failed, contributions } = Route.useLoaderData();
  return (
    <>
      <div className='container'>
        <Hero />
        <ProofStrip />
        <StackMarquee />
        <SkillsBento />
        <ProjectsSection
          projects={projects}
          failed={failed}
          contributions={contributions}
        />
        <Education />
        <About />
      </div>
      <ContactBand />
    </>
  );
}
