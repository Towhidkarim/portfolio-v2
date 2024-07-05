import Reveal from '@/components/framer/Reveal';
import SectionTitle from '@/components/ui/section-title';
import Image, { StaticImageData } from 'next/image';
import reactIcon from '@/public/icons/React.svg';
import nextIcon from '@/public/icons/nextjs-icon.svg';
import tailwindIcon from '@/public/icons/Tailwind CSS.svg';
import tsIcon from '@/public/icons/TypeScript.svg';
import htmlIcon from '@/public/icons/HTML5.svg';
import cssIcon from '@/public/icons/CSS3.svg';
import drizzle from '@/public/icons/drizzle.png';
import nodeIcon from '@/public/icons/Node.js.svg';
import bunIcon from '@/public/icons/Bun.svg';
import pyIcon from '@/public/icons/Python.svg';
import photoshopIcon from '@/public/icons/photoshop.svg';
import illustatorIcon from '@/public/icons/illustrator.svg';
import unityIcon from '@/public/icons/Unity.svg';
import flaskIcon from '@/public/icons/Flask.svg';
import {
  CircleGauge,
  CodeXml,
  Component,
  MonitorSmartphone,
  Plus,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
// import bunIcon from '@/public/icons/Bun.svg';

export default function SkillSection() {
  const skillsForWork: { title: string; icon: StaticImageData }[] = [
    { title: 'React', icon: reactIcon },
    { title: 'Next.js', icon: nextIcon },
    { title: 'TailwindCSS', icon: tailwindIcon },
    { title: 'TypeScript', icon: tsIcon },
    { title: 'Drizzle Orm', icon: drizzle },
    { title: 'HTML5', icon: htmlIcon },
    { title: 'CSS3', icon: cssIcon },
    { title: 'NojeJS', icon: nodeIcon },
    { title: 'BunJS', icon: bunIcon },
  ];

  const skillsForFun: { title: string; icon: StaticImageData }[] = [
    { title: 'Python', icon: pyIcon },
    { title: 'Flask', icon: flaskIcon },
    { title: 'Photoshop', icon: photoshopIcon },
    { title: 'Illustrator', icon: illustatorIcon },
    { title: 'Unity', icon: unityIcon },
  ];

  const features = [
    { title: 'Responsiveness', icon: <MonitorSmartphone /> },
    { title: 'Clean Code', icon: <CodeXml /> },
    { title: 'Elegancy', icon: <Component /> },
    { title: 'Performance', icon: <CircleGauge /> },
  ];

  return (
    <section id='skills'>
      <SectionTitle>Skills</SectionTitle>
      <br />
      <div className='flex w-full flex-col items-start justify-evenly gap-16 gap-y-24 md:flex-row'>
        <div className='flex w-full flex-col items-center justify-center md:w-2/5'>
          <Reveal className='mb-8 mt-2'>
            <h2 className='text-2xl font-bold'>Use at Work</h2>
            <hr className='mx-auto my-2 h-2 w-3/5 rounded-full bg-primary' />
          </Reveal>
          <div className='grid w-full grid-cols-3 place-items-center gap-12'>
            {skillsForWork.map((value, index) => (
              <Reveal
                delay={0.1 * index}
                disableReveal
                key={index}
                className='transition duration-300 hover:scale-105'
              >
                <div className='flex cursor-pointer select-none flex-col items-center justify-center gap-2'>
                  <Image
                    src={value.icon}
                    alt={value.title}
                    width={48}
                    height={48}
                    className='pointer-events-none w-12'
                  />
                  <span className='text-center font-bold opacity-90'>
                    {value.title}
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
        <div className='flex w-full flex-col items-center justify-center md:w-2/5'>
          <Reveal className='mb-8 mt-2'>
            <h2 className='text-2xl font-bold'>Other Skills</h2>
            <hr className='mx-auto my-2 h-2 w-3/5 rounded-full bg-primary' />
          </Reveal>
          <div className='grid w-full grid-cols-3 place-items-center gap-12'>
            {skillsForFun.map((value, index) => (
              <Reveal
                delay={0.1 * index}
                className='transition hover:scale-105'
                disableReveal
                key={index}
              >
                <div className='flex cursor-pointer select-none flex-col items-center justify-center gap-2'>
                  <Image
                    src={value.icon}
                    alt={value.title}
                    width={48}
                    height={48}
                    className='pointer-events-none w-12'
                  />
                  <span className='font-bold opacity-90'>{value.title}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
      <br />
      <br />
      <Reveal className='mx-auto mb-6 mt-12'>
        <h4 className='text-center text-xl font-semibold'>Focusing On</h4>
        <hr className='mx-auto my-2 h-2 w-3/5 rounded-full bg-primary' />
      </Reveal>
      <div className='mx-auto grid grid-cols-1 place-content-start place-items-center gap-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-4'>
        {features.map((value, index) => (
          <Reveal delay={0.15 * index} key={index} className='w-full p-4'>
            <div className='flex h-6 flex-col items-center justify-center gap-2 p-6 text-center text-lg'>
              <span className='scale-125'>{value.icon}</span>
              <span className='font-semibold'>{value.title}</span>
            </div>
          </Reveal>
        ))}
      </div>
      <br />
      <div className='mx-auto my-5 mt-5 flex items-center justify-center gap-1 text-xl font-bold'>
        <span>
          <Plus size={30} strokeWidth={3} />
        </span>
        More
      </div>
    </section>
  );
}
