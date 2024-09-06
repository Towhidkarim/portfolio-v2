import Link from 'next/link';
import React from 'react';
import { Button } from '../../components/ui/button';
import Reveal from '../../components/framer/Reveal';
import JumpingText from '../../components/framer/JumpingText';
import { AlignRight } from 'lucide-react';

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

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
      className='fixed left-1/2 z-50 h-14 w-full -translate-x-1/2 bg-primary-foreground/10 px-2 backdrop-blur-lg'
    >
      <div className='container mx-auto flex flex-row items-center justify-between'>
        <Reveal>
          <Button
            variant='ghost'
            asChild
            className='ml-0 text-2xl font-extrabold md:py-6 md:text-3xl'
          >
            <Link href={'/'}>
              {/* <JumpingText
              startDelay={2}
              totalDurationSeconds={0.5}
              yframes={[0, -10, 0]}
              textValue='<Towhid/Karim>'
            /> */}
              {`<Towhid/Karim>`}
            </Link>
          </Button>
        </Reveal>
        <Reveal
          className='flex h-full flex-row items-center justify-center'
          delay={0.25}
        >
          <Sheet>
            <SheetTrigger asChild>
              <Button variant='ghost' className='md:hidden'>
                <AlignRight strokeWidth={2.5} />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle className='text-center text-2xl'>Menu</SheetTitle>
              </SheetHeader>
              <div className='flex size-full flex-col items-center justify-center gap-4'>
                {otherOptions.map((value, index) => (
                  <SheetClose asChild>
                    <Button
                      variant='ghost'
                      className='text-md p-8 uppercase md:inline-block'
                      key={index}
                      asChild
                    >
                      <Link href={value.url}>{value.title}</Link>
                    </Button>
                  </SheetClose>
                ))}
              </div>
            </SheetContent>
          </Sheet>
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
      </div>
    </nav>
  );
}
