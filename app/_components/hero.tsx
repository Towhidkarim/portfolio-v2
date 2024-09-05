import Image from 'next/image';
import heroImage from '@/public/images/hero.svg';
import reactIcon from '@/public/icons/React.svg';
import nextjsIcon from '@/public/icons/nextjs-icon.svg';
import tsIcon from '@/public/icons/TypeScript.svg';
import tailwindIcon from '@/public/icons/Tailwind CSS.svg';
import React from 'react';
import Reveal from '@/components/framer/Reveal';
import JumpingText from '@/components/framer/JumpingText';
import Typo from './typo';
import MotionDiv from '@/components/framer/MotionDiv';
import { Button } from '@/components/ui/button';
import FloatingObject from '@/components/framer/FloatingObject';

export default function Hero() {
  return (
    <section className='my-5 mt-32 flex h-[70vh] w-full flex-col-reverse items-center justify-center gap-4 opacity-90 md:flex-row'>
      <div className='flex w-full flex-col items-center justify-center gap-2 text-center md:w-2/5 md:items-start md:text-left'>
        <Reveal delay={0.15} className=''>
          <span className='= text-xl font-medium text-foreground md:text-2xl'>
            <JumpingText
              textValue={`Hello There! I'm`}
              startDelay={2}
              totalDurationSeconds={0.5}
              //   repeat={Infinity}
            ></JumpingText>
          </span>
        </Reveal>
        <Reveal delay={0.25}>
          <h1 className='text-4xl font-extrabold md:text-5xl lg:text-6xl'>
            Towhid Karim
          </h1>
        </Reveal>
        <Reveal delay={0.3} className=''>
          <h1 className='my-2 text-xl font-extrabold'>
            <Typo />
          </h1>
        </Reveal>
        <Reveal delay={0.4}>
          <Button variant='default'>See More -</Button>
        </Reveal>
      </div>
      <MotionDiv
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ visibility: 'visible', opacity: 1, scale: 1 }}
        transition={{ delay: 0.75, duration: 0.5, ease: 'easeInOut' }}
        className='pointer-events-none relative -z-10 grid select-none place-items-center md:w-2/5'
      >
        <Image src={heroImage} alt='hero' className='max-w-full select-none' />
        <FloatingObject className='left-0 top-1/3'>
          <Image src={reactIcon} alt='' />
        </FloatingObject>
        <FloatingObject className='bottom-1/4 right-0'>
          <Image src={tailwindIcon} alt='' />
        </FloatingObject>
        <FloatingObject className='bottom-[15%] left-20'>
          <Image src={nextjsIcon} alt='' />
        </FloatingObject>
        <FloatingObject className='right-10 top-20'>
          <Image src={tsIcon} alt='' />
        </FloatingObject>
      </MotionDiv>
    </section>
  );
}
