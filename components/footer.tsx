import Reveal from './framer/Reveal';
import { Button } from './ui/button';
import Link from 'next/link';
import JumpingText from './framer/JumpingText';
import { Mail, MapPin, Phone } from 'lucide-react';

export default function Footer() {
  const socials = [
    { title: 'Facebook', url: 'https://fb.me/towhid.karim.1' },
    { title: 'Github', url: 'https://github.com/Towhidkarim/' },
    { title: 'LinkedIn', url: 'https://linkedin.com/in/towhidkarim/' },
    // { title: 'Twitter', url: '#' },
  ];

  const links = [
    { title: 'Home', url: '#' },
    { title: 'Skills', url: '#skills' },
    { title: 'Projects', url: '#projects' },
    { title: 'About', url: '#about' },
    { title: 'Contact', url: '#contact' },
  ];

  const contactInfo = [
    { icon: Mail, label: 'Email', value: 'towhidkarim123@gmail.com' },
    { icon: MapPin, label: 'Location', value: 'Rajshahi, Bangladesh' },
    { icon: Phone, label: 'Phone', value: '+880 1744-161517' },
  ];

  const date = new Date().getFullYear();
  return (
    <footer className='flex min-h-32 w-full flex-col bg-primary pb-8 pt-12 text-primary-foreground selection:bg-background selection:text-primary'>
      <div className='container mx-auto px-6'>
        <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4'>
          <div className='lg:col-span-2'>
            <Reveal>
              <Button
                variant='ghost'
                asChild
                className='mb-4 ml-0 text-2xl font-extrabold md:text-3xl'
              >
                <Link href={'/'}>
                  <JumpingText
                    startDelay={2}
                    totalDurationSeconds={0.5}
                    yframes={[0, -10, 0]}
                    textValue='<Towhid/Karim>'
                  />
                </Link>
              </Button>
            </Reveal>
            <p className='mb-4 max-w-md text-sm leading-relaxed text-primary-foreground/80'>
              Computer Science Engineering student at Varendra University with a
              passion for full-stack development and creating innovative digital
              solutions.
            </p>
            <p className='text-xs text-primary-foreground/60'>
              Currently pursuing CSE • CGPA: 3.99 • Class of 2026
            </p>
          </div>

          <div>
            <h3 className='mb-4 text-lg font-semibold'>Quick Links</h3>
            <ul className='space-y-2'>
              {links.map((item, index) => (
                <li key={index}>
                  <Link
                    className='text-sm text-primary-foreground/80 transition-colors duration-200 hover:text-primary-foreground'
                    href={item.url}
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className='mb-4 text-lg font-semibold'>Get In Touch</h3>
            <div className='mb-4 space-y-2'>
              {contactInfo.map((item, index) => (
                <div
                  key={index}
                  className='flex items-center gap-2 text-sm text-primary-foreground/80'
                >
                  <item.icon className='h-4 w-4' />
                  <span>{item.value}</span>
                </div>
              ))}
            </div>

            <div>
              <h4 className='mb-2 text-sm font-medium'>Follow Me</h4>
              <div className='flex flex-wrap gap-2'>
                {socials.map((item, index) => (
                  <Link
                    key={index}
                    target='_blank'
                    className='rounded-md bg-primary-foreground/10 px-3 py-1 text-xs text-primary-foreground/80 transition-colors duration-200 hover:text-primary-foreground'
                    href={item.url}
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='container mx-auto mt-8 px-6'>
        <hr className='mb-4 h-px border-none bg-primary-foreground/20' />
        <div className='flex flex-col items-center justify-between gap-4 text-sm text-primary-foreground/60 md:flex-row'>
          <p>
            All rights reserved © {date}{' '}
            <span className='font-semibold text-primary-foreground'>
              Towhid Karim
            </span>
          </p>
          <p className='text-xs'>
            Built with Next.js & Tailwind, Drizzle, Redis
          </p>
        </div>
      </div>
    </footer>
  );
}
