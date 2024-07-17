import Link from 'next/link';
import React from 'react';
import { Button } from '../../components/ui/button';
import Reveal from '../../components/framer/Reveal';
import JumpingText from '../../components/framer/JumpingText';
import { AlignRight } from 'lucide-react';

export default function Navbar() {
  const otherOptions = [
    { title: 'Home', url: '/' },
    { title: 'Skills', url: '#skills' },
    { title: 'Projects', url: '#projects' },
    { title: 'About me', url: '#about' },
    { title: 'Contact', url: '#contact' },
  ];

  return (
    <nav
      id='nav'
      className='container z-10 mx-auto flex h-16 flex-row items-center justify-between px-2 md:mt-5'
    >
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
      <Reveal
        className='flex h-full flex-row items-center justify-center'
        delay={0.25}
      >
        <Button variant='ghost' className='md:hidden'>
          <AlignRight strokeWidth={2.5} />
        </Button>
        {otherOptions.map((value, index) => (
          <Button
            variant='ghost'
            className='text-md hidden uppercase md:inline-block'
            key={index}
            asChild
          >
            <Link href={value.url}>{value.title}</Link>
          </Button>
        ))}
      </Reveal>
    </nav>
  );
}
