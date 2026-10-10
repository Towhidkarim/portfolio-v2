'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ExternalLink, Github, Eye } from 'lucide-react';
import Image from 'next/image';

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

interface ProjectModalProps {
  project: Project;
  triggerText?: string;
}

export function ProjectModal({
  project,
  triggerText = 'View Details',
}: ProjectModalProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size='sm' className='gap-2 border border-background/60'>
          <Eye className='h-4 w-4' />
          {triggerText}
        </Button>
      </DialogTrigger>
      <DialogContent className='max-h-[90vh] max-w-4xl overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='text-balance text-2xl font-bold'>
            {project.name}
          </DialogTitle>
        </DialogHeader>

        <div className='space-y-6'>
          {/* Project Image */}
          <div className='relative aspect-video w-full overflow-hidden rounded-lg border bg-muted'>
            {!imageError ? (
              <Image
                src={project.imageUrl || '/placeholder.svg'}
                alt={project.name}
                fill
                className='object-cover'
                onError={() => setImageError(true)}
              />
            ) : (
              <div className='flex h-full items-center justify-center text-muted-foreground'>
                <div className='text-center'>
                  <div className='mb-2 text-4xl'>🖼️</div>
                  <p>Project Preview</p>
                </div>
              </div>
            )}
          </div>

          {/* Project Summary */}
          <Card>
            <CardContent className='pt-6'>
              <h3 className='mb-3 text-lg font-semibold'>Project Overview</h3>
              <p className='text-pretty leading-relaxed text-muted-foreground'>
                {project.summary}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='pt-6'>
              <h3 className='mb-3 text-lg font-semibold'>
                Project Description
              </h3>
              <p className='whitespace-pre text-pretty leading-relaxed text-muted-foreground'>
                {project.description}
              </p>
            </CardContent>
          </Card>

          {/* Technologies Used */}
          {project.tags && project.tags.length > 0 && (
            <div>
              <h3 className='mb-3 text-lg font-semibold'>Technologies Used</h3>
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
          <div className='flex flex-col gap-3 border-t pt-4 sm:flex-row'>
            <Button asChild className='flex-1'>
              <a
                href={project.demoLink}
                target='_blank'
                rel='noopener noreferrer'
                className='gap-2'
              >
                <ExternalLink className='h-4 w-4' />
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
                <Github className='h-4 w-4' />
                View Source Code
              </a>
            </Button>
          </div>

          {/* Project Index Info */}
          {/* <div className='pt-2 border-t text-muted-foreground text-sm text-center'>
            Project #{project.index + 1}
          </div> */}
        </div>
      </DialogContent>
    </Dialog>
  );
}
