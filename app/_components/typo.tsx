'use client';
import { TypeAnimation } from 'react-type-animation';

export default function Typo() {
  return (
    <TypeAnimation
      preRenderFirstString
      sequence={[
        // Same substring at the start will only be typed out once, initially
        'A Web Developer',
        3000, // wait 1s before replacing "Mice" with "Hamsters"
        'A Full-Stack Developer',
        3000,
        // 'A NextJS Dev',
      ]}
      wrapper='span'
      speed={25}
      repeat={Infinity}
    />
  );
}
