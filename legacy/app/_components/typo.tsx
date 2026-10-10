'use client';
import { TypeAnimation } from 'react-type-animation';

export default function Typo() {
  return (
    <TypeAnimation
      preRenderFirstString
      deletionSpeed={{ type: 'keyStrokeDelayInMs', value: 25 }}
      sequence={[
        // Same substring at the start will only be typed out once, initially
        'A Full-Stack Engineer',
        3000, // wait 1s before replacing "Mice" with "Hamsters"
        'Crafting Scalable Apps with React & Next.js',
        3000,
        // 'A NextJS Dev',
      ]}
      wrapper='span'
      speed={70}
      repeat={Infinity}
    />
  );
}
