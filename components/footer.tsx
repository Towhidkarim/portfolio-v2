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
    <footer className='flex flex-col bg-primary selection:bg-primary-foreground pt-12 pb-8 w-full min-h-32 text-primary-foreground selection:text-primary'>
      <div className='mx-auto px-6 container'>
        <div className='gap-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4'>
          <div className='lg:col-span-2'>
            <Reveal>
              <Button
                variant='ghost'
                asChild
                className='mb-4 ml-0 font-extrabold text-2xl md:text-3xl'
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
            <p className='mb-4 max-w-md text-primary-foreground/80 text-sm leading-relaxed'>
              Computer Science Engineering student at Varendra University with a
              passion for full-stack development and creating innovative digital
              solutions.
            </p>
            <p className='text-primary-foreground/60 text-xs'>
              Currently pursuing CSE • CGPA: 3.99 • Class of 2026
            </p>
          </div>

          <div>
            <h3 className='mb-4 font-semibold text-lg'>Quick Links</h3>
            <ul className='space-y-2'>
              {links.map((item, index) => (
                <li key={index}>
                  <Link
                    className='text-primary-foreground/80 hover:text-primary-foreground text-sm transition-colors duration-200'
                    href={item.url}
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className='mb-4 font-semibold text-lg'>Get In Touch</h3>
            <div className='space-y-2 mb-4'>
              {contactInfo.map((item, index) => (
                <div
                  key={index}
                  className='flex items-center gap-2 text-primary-foreground/80 text-sm'
                >
                  <item.icon className='w-4 h-4' />
                  <span>{item.value}</span>
                </div>
              ))}
            </div>

            <div>
              <h4 className='mb-2 font-medium text-sm'>Follow Me</h4>
              <div className='flex flex-wrap gap-2'>
                {socials.map((item, index) => (
                  <Link
                    key={index}
                    target='_blank'
                    className='bg-primary-foreground/10 px-3 py-1 rounded-md text-primary-foreground/80 hover:text-primary-foreground text-xs transition-colors duration-200'
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

      <div className='mx-auto mt-8 px-6 container'>
        <hr className='bg-primary-foreground/20 mb-4 border-none h-px' />
        <div className='flex md:flex-row flex-col justify-between items-center gap-4 text-primary-foreground/60 text-sm'>
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
