'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CursorFollower() {
  const [isVisible, setIsVisible] = useState(true);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 60, stiffness: 800 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);
  const xSmall = useSpring(mouseX, { damping: 100, stiffness: 1000 });
  const ySmall = useSpring(mouseY, { damping: 100, stiffness: 4000 });

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      mouseX.set(e.clientX - 32); // offset for centering
      mouseY.set(e.clientY - 32);
    };

    const show = () => setIsVisible(true);
    const hide = () => setIsVisible(false);

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseenter', show);
    window.addEventListener('mouseleave', hide);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseenter', show);
      window.removeEventListener('mouseleave', hide);
    };
  }, [mouseX, mouseY]);

  if (!isVisible) return null;

  return (
    <>
      <motion.div
        className='pointer-events-none fixed left-0 top-0 z-[9999] hidden size-16 rounded-full border md:block'
        style={{ x, y }}
      />
      <motion.div
        className='pointer-events-none fixed left-0 top-0 z-[9999] hidden size-16 rounded-full bg-black/15 md:block'
        style={{ x: xSmall, y: ySmall, scale: 0.2 }}
      />
    </>
  );
}
