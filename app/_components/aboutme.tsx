import SectionTitle from '@/components/ui/section-title';
import Image from 'next/image';
import dp from '@/public/images/dp.jpg';
import Reveal from '@/components/framer/Reveal';
import MotionDiv from '@/components/framer/MotionDiv';
import { Button } from '@/components/ui/button';
import { Facebook, Github } from 'lucide-react';
import Link from 'next/link';

export default function AboutMe() {
  return (
    <section id='about' className='my-44'>
      <SectionTitle className='mb-20'>About Me</SectionTitle>
      <div className='flex flex-col items-start justify-evenly md:flex-row'>
        <MotionDiv
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75 }}
          className='w-full md:w-2/5'
        >
          <Image
            src={dp}
            alt=''
            className='pointer-events-none mx-auto h-[450px] w-auto select-none rounded-lg object-contain'
            loading='eager'
          />
          <br />
          <h4 className='font-lg mb-2 mt-5 text-center text-lg font-semibold'>
            Find me on
          </h4>
          <div className='mx-auto mb-5 flex justify-around gap-2 md:w-4/5'>
            <Button asChild>
              <Link
                target='_blank'
                href='https://fb.me/towhid.karim.1'
                className='inline-flex w-32 gap-2'
              >
                <Facebook />
                Facebook
              </Link>
            </Button>
            <Button asChild>
              <Link
                target='_blank'
                href='https://github.com/Towhidkarim/'
                className='inline-flex w-32 gap-2'
              >
                <Github />
                Github
              </Link>
            </Button>
          </div>
        </MotionDiv>
        <br />
        <br />
        <div className='w-full md:w-2/5'>
          <article className='text-lg leading-relaxed dark:text-muted-foreground'>
            <Reveal>
              <b className='text-2xl font-extrabold'>I'm&nbsp;</b>a passionate
              web developer with a knack for transforming innovative ideas into
              functional and visually captivating digital experiences. My coding
              journey started with a fascination for how logic could bring
              pixels to life.
            </Reveal>
            <br />
            <Reveal delay={0.15}>
              With a solid foundation in React, Next.js, and Tailwind, I create
              responsive user interfaces and seamless user experiences, blending
              aesthetics with functionality. As an avid problem solver, I thrive
              on tackling new challenges head-on. When not coding, I explore the
              latest design trends or brainstorm my next project over a cup of
              coffee.
            </Reveal>
            <br />
            <Reveal delay={0.25}>
              Welcome to my portfolio, where I showcase my dedication and
              passion for web development.
            </Reveal>
          </article>
          <div className='flex w-full grid-cols-2 flex-wrap items-start justify-between gap-x-5 gap-y-4 py-10'>
            <Reveal delay={0.45} className='w-5/12'>
              <b className='text-lg'>Name</b>
              <br /> Towhid Karim
            </Reveal>
            <Reveal delay={0.5} className='w-1/3'>
              <b className='text-lg'>Employment</b>
              <br /> Looking for Employment
            </Reveal>
            <Reveal delay={0.6} className='w-5/12'>
              <b className='text-lg'>Education</b>
              <br /> BSc in CSE (Ongoing)
            </Reveal>
            <Reveal delay={0.7} className='w-1/3'>
              <b className='text-lg'>Experience</b>
              <br /> Adept
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
