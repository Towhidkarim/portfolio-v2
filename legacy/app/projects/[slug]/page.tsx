import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Github } from 'lucide-react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { db } from '@/db';
import { projects } from '@/db/schema';
import { eq } from 'drizzle-orm';

interface Project {
  name: string;
  summary: string;
  description: string | null;
  tags: string[] | null;
  demoLink: string;
  sourceLink: string;
  index: number;
  imageUrl: string;
}

// Mock function to fetch project data - replace with your actual data fetching logic
async function getProject(id: string): Promise<Project | null> {
  // This is where you would fetch from your database or API
  // For now, returning mock data based on ID
  const mockProjects: Record<string, Project> = {
    '1': {
      name: 'E-commerce Platform',
      summary:
        'A full-stack e-commerce solution built with Next.js and TypeScript',
      description:
        'This comprehensive e-commerce platform features user authentication, product catalog, shopping cart functionality, and payment processing. Built with modern web technologies for optimal performance and user experience.',
      tags: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Stripe', 'PostgreSQL'],
      demoLink: 'https://example-ecommerce.vercel.app',
      sourceLink: 'https://github.com/username/ecommerce-platform',
      index: 0,
      imageUrl: '/placeholder.svg?height=400&width=800',
    },
    '2': {
      name: 'Task Management App',
      summary:
        'A collaborative task management application with real-time updates',
      description:
        'Feature-rich task management application that allows teams to collaborate effectively. Includes drag-and-drop functionality, real-time updates, user roles, and comprehensive project tracking.',
      tags: ['React', 'Node.js', 'Socket.io', 'MongoDB', 'Express'],
      demoLink: 'https://example-tasks.vercel.app',
      sourceLink: 'https://github.com/username/task-manager',
      index: 1,
      imageUrl: '/placeholder.svg?height=400&width=800',
    },
  };

  return mockProjects[id] || null;
}

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export default async function page({ params }: ProjectPageProps) {
  const { slug } = await params;
  //   const project = await getProject(slug);
  const [project] = await db
    .select()
    .from(projects)
    .where(eq(projects.id, slug));

  if (!project) {
    notFound();
  }

  return (
    <div className='mx-auto px-4 py-8 max-w-4xl container'>
      {/* Page Header */}
      <div className='mb-8'>
        <h1 className='mb-2 font-bold text-3xl text-balance'>
          {project.projectName}
        </h1>
        <p className='text-muted-foreground'>Project Details</p>
      </div>

      <div className='space-y-6'>
        {/* Project Image */}
        <div className='relative bg-muted border rounded-lg w-full aspect-video overflow-hidden'>
          <Image
            src={project.imgUrl || '/placeholder.svg'}
            alt={project.projectName}
            fill
            className='object-cover'
          />
        </div>

        {/* Project Summary */}
        <Card>
          <CardContent className='pt-6'>
            <h2 className='mb-3 font-semibold text-lg'>Project Overview</h2>
            <p className='text-muted-foreground text-pretty leading-relaxed'>
              {project.summary}
            </p>
          </CardContent>
        </Card>

        {/* Project Description */}
        {project.description && (
          <Card>
            <CardContent className='pt-6'>
              <h2 className='mb-3 font-semibold text-lg'>
                Project Description
              </h2>
              <p className='text-muted-foreground text-pretty leading-relaxed whitespace-pre-wrap'>
                {project.description}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Technologies Used */}
        {project.tags && project.tags.length > 0 && (
          <div>
            <h2 className='mb-3 font-semibold text-lg'>Technologies Used</h2>
            <div className='flex flex-wrap gap-2'>
              {project.tags.map((tag, index) => (
                <Badge key={index} variant='secondary' className='text-sm'>
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Project Links */}
        <div className='flex sm:flex-row flex-col gap-3 pt-6 border-t'>
          <Button asChild className='flex-1'>
            <a
              href={project.demoLink}
              target='_blank'
              rel='noopener noreferrer'
              className='gap-2'
            >
              <ExternalLink className='w-4 h-4' />
              View Live Demo
            </a>
          </Button>
          <Button asChild variant='outline' className='flex-1 bg-transparent'>
            <a
              href={project.sourceLink}
              target='_blank'
              rel='noopener noreferrer'
              className='gap-2'
            >
              <Github className='w-4 h-4' />
              View Source Code
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
