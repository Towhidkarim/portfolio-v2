import React from 'react';
import Reveal from './framer/Reveal';
import { Button } from './ui/button';
import Link from 'next/link';
import JumpingText from './framer/JumpingText';

export default function Footer() {
  const socials = [
    { title: 'Facebook', url: 'https://fb.me/towhid.karim.1' },
    { title: 'Github', url: 'https://github.com/Towhidkarim/' },
  ];

  const links = [
    { title: 'Home', url: '/' },
    { title: 'Skills', url: '#skills' },
    { title: 'Projects', url: '#projects' },
    { title: 'About', url: '#about' },
    { title: 'Contact', url: '#contact' },
  ];

  const date = new Date().getFullYear();
  return (
    <footer className='flex min-h-32 w-full flex-col bg-primary pb-5 pt-10 text-primary-foreground'>
      <div className='flex flex-col items-center justify-around gap-10 opacity-90 md:flex-row md:items-start'>
        <Reveal>
          <Button
            variant='ghost'
            asChild
            className='ml-0 text-2xl font-extrabold md:py-6 md:text-3xl'
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
        <div className='flex w-full justify-around gap-20 md:w-auto'>
          <ul className='flex flex-col gap-2'>
            <li>
              <b className='text-lg'>Socials</b>
            </li>
            {socials.map((item, index) => (
              <li key={index}>
                <Link
                  target='_blank'
                  className='transition-opacity hover:opacity-75'
                  href={item.url}
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
          <ul className='flex flex-col gap-2'>
            <li>
              <b className='text-lg'>Links</b>
            </li>
            {links.map((item, index) => (
              <li key={index}>
                <Link
                  className='transition-opacity hover:opacity-75'
                  href={item.url}
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <hr className='mx-auto mb-1 mt-4 h-px w-10/12 border-none bg-muted-foreground' />
      <h1 className='my-2 text-center text-sm'>
        All rights reserved © {date} <b>Towhid Karim</b>
      </h1>
    </footer>
  );
}
