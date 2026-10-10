import poppins400 from '@fontsource/poppins/files/poppins-latin-400-normal.woff2?url';
import poppins800 from '@fontsource/poppins/files/poppins-latin-800-normal.woff2?url';
import {
  createRootRoute,
  HeadContent,
  Link,
  Scripts,
} from '@tanstack/react-router';
import { revealInit } from '@/components/reveal/reveal-init';
import { RevealScan } from '@/components/reveal/reveal-scan';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/sonner';
import { themeInit } from '@/lib/theme';
import appCss from '@/styles/globals.css?url';

const SITE_NAME = 'TowhidKarim | Portfolio';
// Owner to confirm (see design/copy.md).
const DESCRIPTION =
  'Towhid Karim, full-stack engineer. React, Next.js, TypeScript and AI-native workflows.';

export const Route = createRootRoute({
  // Safe default: nothing is cached unless a route opts in (see 12-start-best-practices.md).
  headers: () => ({ 'Cache-Control': 'private, no-store' }),
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: SITE_NAME },
      { name: 'description', content: DESCRIPTION },
      {
        name: 'google-site-verification',
        content: 'Tw-2CbT7VPlr65XdSv95FvPmSVgTPbm7mVIBGxUYn3Y',
      },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: SITE_NAME },
      { property: 'og:title', content: SITE_NAME },
      { property: 'og:description', content: DESCRIPTION },
      { property: 'og:image', content: '/opengraph-image.png' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: SITE_NAME },
      { name: 'twitter:description', content: DESCRIPTION },
      { name: 'twitter:image', content: '/opengraph-image.png' },
    ],
    links: [
      { rel: 'icon', href: '/favicon.ico' },
      // preload only the two weights used above the fold
      {
        rel: 'preload',
        as: 'font',
        type: 'font/woff2',
        href: poppins400,
        crossOrigin: 'anonymous',
      },
      {
        rel: 'preload',
        as: 'font',
        type: 'font/woff2',
        href: poppins800,
        crossOrigin: 'anonymous',
      },
      { rel: 'stylesheet', href: appCss },
    ],
    // Order matters: theme first (no flash), then the reveal observer.
    scripts: [{ children: themeInit }, { children: revealInit }],
  }),
  shellComponent: RootDocument,
  notFoundComponent: NotFound,
  errorComponent: ErrorPage,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    // The theme/reveal scripts change classes on <html> before React hydrates.
    <html lang='en' suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <a
          href='#main'
          className='sr-only rounded-control bg-foreground px-4 py-3 text-background focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100]'
        >
          Skip to content
        </a>
        {children}
        <Toaster />
        <RevealScan />
        <Scripts />
      </body>
    </html>
  );
}

function StatusPage({
  code,
  title,
  text,
  children,
}: {
  code: string;
  title: string;
  text: string;
  children?: React.ReactNode;
}) {
  return (
    <main
      id='main'
      className='container flex min-h-screen flex-col items-start justify-center gap-4 py-24'
    >
      <p className='font-mono text-xs uppercase tracking-[0.14em] text-brand-ink'>
        {code}
      </p>
      <h1 className='text-[40px] font-extrabold leading-[1.08] tracking-[-0.03em]'>
        {title}
      </h1>
      <p className='max-w-[520px] text-[17px] leading-[1.65] text-ink2'>
        {text}
      </p>
      <div className='mt-2 flex gap-3'>{children}</div>
    </main>
  );
}

function NotFound() {
  return (
    <StatusPage
      code='404'
      title='Page not found'
      text='That page does not exist or has moved.'
    >
      <Button asChild>
        <Link to='/'>Back to home</Link>
      </Button>
    </StatusPage>
  );
}

function ErrorPage() {
  return (
    <StatusPage
      code='Error'
      title='Something went wrong'
      text='The page could not be loaded. Try again in a moment.'
    >
      <Button onClick={() => window.location.reload()}>Try again</Button>
      <Button asChild variant='outline'>
        <Link to='/'>Back to home</Link>
      </Button>
    </StatusPage>
  );
}
