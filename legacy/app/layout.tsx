import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import Providers from '@/lib/Providers';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'] });
const poppins = Poppins({
  weight: ['200', '300', '400', '500', '600', '700', '800'],
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'TowhidKarim | Portfolio',
  description: 'Portfolio',
  metadataBase: new URL('https://towhidkarim.vercel.app'),
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en-US',
    },
  },
  openGraph: {
    images: '/og-image.png',
  },
  other: {
    'google-site-verification': 'Tw-2CbT7VPlr65XdSv95FvPmSVgTPbm7mVIBGxUYn3Y',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={cn(poppins)}>
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
