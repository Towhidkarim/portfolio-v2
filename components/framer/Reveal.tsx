'use client';

import { cn } from '@/lib/utils';
import { useState, useEffect, useRef } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';

export default function Reveal({
  children,
  className,
  delay = 0,
  disableReveal = false,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: 0 | number;
  disableReveal?: boolean;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const animator = useAnimation();
  const slider = useAnimation();

  useEffect(() => {
    if (inView) {
      animator.start('revealedState');
      slider.start('slide');
    }
  }, [inView]);

  return (
    <div ref={ref} className={cn('relative w-fit overflow-hidden', className)}>
      <motion.div
        variants={{
          initialState: { opacity: 0, y: 50 },
          revealedState: { opacity: 1, y: 0 },
        }}
        initial='initialState'
        animate={animator}
        transition={{
          duration: 0.45,
          delay: 0.2 + delay,
          staggerChildren: 0.15,
        }}
      >
        {children}
      </motion.div>
      <motion.div
        className='absolute right-0 top-0 h-full w-full rounded-sm bg-primary'
        variants={{
          initialState: { width: disableReveal ? '0%' : '100%' },
          slide: { width: '0%' },
        }}
        initial='initialState'
        animate={slider}
        transition={{ duration: 0.35, ease: 'easeInOut', delay: 0 + delay }}
      ></motion.div>
    </div>
  );
}
