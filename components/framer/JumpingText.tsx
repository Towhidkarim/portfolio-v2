'use client';
import { motion } from 'framer-motion';

export default function JumpingText({
  textValue,
  startDelay = 0,
  totalDurationSeconds = 1,
  yframes = [0, -5, -10, -5, 0],
  repeat = 0,
}: {
  textValue: string;
  startDelay?: number;
  totalDurationSeconds?: number;
  yframes?: number[];
  repeat?: number;
}) {
  const chars = textValue.split('');
  const totalDurtionSeconds = totalDurationSeconds || 1;

  return (
    <div>
      {chars.map((value, index) => (
        <motion.span
          className='inline-block'
          key={index}
          animate={{
            y: yframes,
          }}
          transition={{
            delay: (totalDurtionSeconds / chars.length) * index + startDelay,
            repeat,
            repeatDelay: 2,
            // duration: 2,
          }}
        >
          {value === ' ' ? <span>&nbsp;</span> : value}
        </motion.span>
      ))}
    </div>
  );
}
