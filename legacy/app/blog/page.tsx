import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import { blogPosts } from '@/lib/blogs';

export default function BlogPage() {
  return (
    <div className='min-h-screen bg-background'>
      <div className='container mx-auto max-w-4xl px-4 py-8'>
        {/* Header */}
        <div className='mb-8'>
          <Link
            href='/'
            className='mb-4 inline-flex items-center text-sm text-muted-foreground transition-colors hover:text-foreground'
          >
            <ArrowLeft className='mr-2 h-4 w-4' />
            Back to Portfolio
          </Link>
          <h1 className='text-balance text-3xl font-bold'>Blog</h1>
          <p className='mt-2 text-muted-foreground'>
            Thoughts on web development, programming, and technology
          </p>
        </div>

        {/* Blog Posts */}
        <div className='space-y-6'>
          {blogPosts.map((post) => (
            <Card key={post.slug} className='transition-shadow hover:shadow-md'>
              <CardHeader>
                <div className='mb-2 flex items-center gap-4 text-sm text-muted-foreground'>
                  <div className='flex items-center gap-1'>
                    <Calendar className='h-4 w-4' />
                    {new Date(post.publishedDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </div>
                  <div className='flex items-center gap-1'>
                    <Clock className='h-4 w-4' />
                    {post.readTime}
                  </div>
                </div>
                <CardTitle className='text-xl'>
                  <Link
                    href={`/blog/${post.slug}`}
                    className='transition-colors hover:text-primary hover:underline'
                  >
                    {post.title}
                  </Link>
                </CardTitle>
                <CardDescription className='text-base leading-relaxed'>
                  {post.summary}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='flex flex-wrap gap-2'>
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant='secondary'>
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
