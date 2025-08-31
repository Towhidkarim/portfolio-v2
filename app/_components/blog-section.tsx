'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Calendar, BookOpen } from 'lucide-react';
import SectionTitle from '@/components/ui/section-title';

export function BlogSection() {
  const blogPost = {
    title: 'Understanding TypeScript: A Deep Dive',
    summary:
      "Exploring some basic concepts of TypeScript, Explain the difference between any, unknown, and never types in TypeScript and it's impact on projects",
    publishedDate: '2025',
    readTime: '2 min read',
    githubUrl:
      'https://github.com/Towhidkarim/b5-assignment-1?tab=readme-ov-file#explain-the-difference-between-any-unknown-and-never-types-in-typescript',
    tags: ['TypeScript', 'JavaScript', 'Web Development', 'Programming'],
  };

  const handleBlogClick = () => {
    window.open(blogPost.githubUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <section className='mx-auto w-full max-w-3xl'>
      <div className='mb-12 text-center'>
        <SectionTitle>Blog</SectionTitle>
      </div>

      <div className='grid gap-6'>
        <Card
          className='group relative cursor-pointer overflow-hidden transition-all duration-300 hover:scale-[1.01] hover:shadow-lg'
          onClick={handleBlogClick}
        >
          <div className='absolute left-0 top-0 h-full w-1 bg-primary' />

          <CardHeader className='pb-4'>
            <div className='flex items-start justify-between gap-4'>
              <div className='flex-1'>
                <div className='mb-2 flex items-center gap-2'>
                  <BookOpen className='h-5 w-5 text-primary' />
                  <span className='text-sm font-medium text-muted-foreground'>
                    Technical Article
                  </span>
                </div>
                <h3 className='mb-2 text-xl font-semibold transition-colors group-hover:text-primary'>
                  {blogPost.title}
                </h3>
                <p className='text-sm leading-relaxed text-muted-foreground'>
                  {blogPost.summary}
                </p>
              </div>
              <ExternalLink className='h-5 w-5 flex-shrink-0 text-muted-foreground transition-colors group-hover:text-primary' />
            </div>
          </CardHeader>

          <CardContent className='pt-0'>
            <div className='mb-4 flex items-center justify-between'>
              <div className='flex items-center gap-4 text-sm text-muted-foreground'>
                <div className='flex items-center gap-1'>
                  <Calendar className='h-4 w-4' />
                  <span>{blogPost.publishedDate}</span>
                </div>
                <span>{blogPost.readTime}</span>
              </div>
            </div>

            <div className='flex flex-wrap gap-2'>
              {blogPost.tags.map((tag) => (
                <Badge key={tag} variant='secondary' className='text-xs'>
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className='mt-8 text-center'>
        <p className='text-sm text-muted-foreground'>
          More articles coming soon...
        </p>
      </div>
    </section>
  );
}
