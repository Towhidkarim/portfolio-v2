'use client';
import { useRef, useEffect } from 'react';
import MotionDiv from '../framer/MotionDiv';
import { useAnimation, useInView } from 'framer-motion';
import Reveal from '../framer/Reveal';
import { cn } from '@/lib/utils';

export default function SectionTitle({
  children,
  className,
  revealStartDelay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  revealStartDelay?: number;
}) {
  const variants = {
    slideOut: { scaleX: 1 },
  };
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const controler = useAnimation();

  useEffect(() => {
    if (inView) controler.start('slideOut');
  });

  return (
    <div
      ref={ref}
      className={cn(
        'my-10 flex max-w-full items-center justify-center gap-4',
        className,
      )}
    >
      <div className='grid w-28 place-items-center md:w-36'>
        <MotionDiv
          className='h-3 w-full origin-right rounded-full bg-primary'
          initial={{ scaleX: 0 }}
          animate={controler}
          variants={variants}
          transition={{ delay: 1 }}
        />
      </div>
      <Reveal className='px-2' delay={revealStartDelay}>
        <h1 className='my-1 -translate-y-1 text-center text-3xl font-extrabold sm:text-4xl md:text-5xl'>
          {children}
        </h1>
      </Reveal>
      <div className='grid w-28 place-items-center md:w-36'>
        <MotionDiv
          className='h-3 w-full origin-left rounded-full bg-primary'
          initial={{ scaleX: 0 }}
          animate={controler}
          variants={variants}
          transition={{ delay: 1 }}
        />
      </div>
    </div>
  );
}
