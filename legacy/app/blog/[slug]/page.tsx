import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import { blogPosts } from '@/lib/blogs';

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <div className='min-h-screen bg-background'>
      <div className='container mx-auto max-w-3xl px-4 py-8'>
        {/* Navigation */}
        <Link
          href='/blog'
          className='mb-8 inline-flex items-center text-sm text-muted-foreground transition-colors hover:text-foreground'
        >
          <ArrowLeft className='mr-2 h-4 w-4' />
          Back to Blog
        </Link>

        {/* Article Header */}
        <header className='mb-8'>
          <div className='mb-4 flex items-center gap-4 text-sm text-muted-foreground'>
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

          <h1 className='mb-4 text-balance text-4xl font-bold'>{post.title}</h1>

          <p className='mb-6 text-lg leading-relaxed text-muted-foreground'>
            {post.summary}
          </p>

          <div className='flex flex-wrap gap-2'>
            {post.tags.map((tag) => (
              <Badge key={tag} variant='secondary'>
                {tag}
              </Badge>
            ))}
          </div>
        </header>

        {/* Article Content */}
        <article className='dark:prose-invert prose prose-gray max-w-none'>
          <div
            className='leading-relaxed'
            dangerouslySetInnerHTML={{
              __html: post.content
                .split('\n')
                .map((line) => {
                  if (line.startsWith('# ')) {
                    return `<h1 class="mt-8 mb-4 font-bold text-3xl">${line.slice(2)}</h1>`;
                  }
                  if (line.startsWith('## ')) {
                    return `<h2 class="mt-6 mb-3 font-semibold text-2xl">${line.slice(3)}</h2>`;
                  }
                  if (line.startsWith('### ')) {
                    return `<h3 class="mt-4 mb-2 font-medium text-xl">${line.slice(4)}</h3>`;
                  }
                  if (line.startsWith('- ')) {
                    return `<li class="ml-4">${line.slice(2)}</li>`;
                  }
                  if (line.match(/^\d+\./)) {
                    return `<li class="ml-4">${line.replace(/^\d+\.\s*/, '')}</li>`;
                  }
                  if (line.trim() === '') {
                    return '<br>';
                  }
                  return `<p class="mb-4">${line}</p>`;
                })
                .join(''),
            }}
          />
        </article>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return {
      title: 'Blog Post Not Found',
    };
  }

  return {
    title: post.title,
    description: post.summary,
  };
}
