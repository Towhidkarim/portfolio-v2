'use client';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export default function FloatingObject({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const randomDuration = 1 * Math.random() + 2;
  const randomDelay = 2.5 * Math.random();
  return (
    <motion.div
      className={cn('absolute size-12 rounded-full p-px', className)}
      initial={{}}
      animate={{
        y: -15 - Math.random() * 5,
        // rotate: [0, 10, 15, 15, 15, 10, 0],
      }}
      transition={{
        duration: randomDuration,
        repeat: Infinity,
        repeatType: 'reverse',
        ease: 'easeInOut',
        delay: randomDelay,
      }}
    >
      {children}
    </motion.div>
  );
}
