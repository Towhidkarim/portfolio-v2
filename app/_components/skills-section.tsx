import Reveal from '@/components/framer/Reveal';
import SectionTitle from '@/components/ui/section-title';
import Image, { StaticImageData } from 'next/image';
import {
  reactIcon,
  nextIcon,
  tailwindIcon,
  tsIcon,
  redisIcon,
  cssIcon,
  drizzle,
  nodeIcon,
  pyIcon,
  photoshopIcon,
  illustatorIcon,
  unityIcon,
  flaskIcon,
  githubicon,
  docker,
  postgresql,
  zustand,
  jotai,
  mongoDBIcon,
  prismaIcon,
  tanstackQuery,
  shadcn,
  expressIcon,
  postman,
  turso,
  redux,
} from '@/lib/icons';
import {
  CircleGauge,
  CodeXml,
  Component,
  MonitorSmartphone,
  Plus,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
// import bunIcon from '@/public/icons/Bun.svg';
type TSkillprops = { title: string; icon: StaticImageData };

export default function SkillSection() {
  const skillsForWork: { title: string; icon: StaticImageData }[] = [
    { title: 'React', icon: reactIcon },
    { title: 'Next.js', icon: nextIcon },
    { title: 'TailwindCSS', icon: tailwindIcon },
    { title: 'TypeScript', icon: tsIcon },
    { title: 'Drizzle Orm', icon: drizzle },
    { title: 'Docker', icon: docker },
    { title: 'Redis', icon: redisIcon },
    { title: 'NodeJS', icon: nodeIcon },
    { title: 'GitHub', icon: githubicon },
  ];

  const skillsForFun: { title: string; icon: StaticImageData }[] = [
    { title: 'Python', icon: pyIcon },
    { title: 'Flask', icon: flaskIcon },
    { title: 'Photoshop', icon: photoshopIcon },
    { title: 'Illustrator', icon: illustatorIcon },
    { title: 'Unity', icon: unityIcon },
  ];

  const features = [
    { title: 'Responsive Design', icon: <MonitorSmartphone /> },
    { title: 'Clean & Maintainable Code', icon: <CodeXml /> },
    { title: 'Elegant UI/UX', icon: <Component /> },
    { title: 'High Performance', icon: <CircleGauge /> },
  ];

  const subSkills: { title: string; icon: StaticImageData }[] = [
    { title: 'TanStack Query', icon: tanstackQuery },
    { title: 'Shadcn UI', icon: shadcn },
    { title: 'PostgreSQL', icon: postgresql },
    { title: 'Jotai', icon: jotai },
    { title: 'Zustand', icon: zustand },
    { title: 'MongoDB', icon: mongoDBIcon },
    { title: 'Express', icon: expressIcon },
    { title: 'Prisma', icon: prismaIcon },
  ];

  const frontendSkills: TSkillprops[] = [
    { title: 'React', icon: reactIcon },
    { title: 'Next.js', icon: nextIcon },
    { title: 'TypeScript', icon: tsIcon },
    { title: 'TailwindCSS', icon: tailwindIcon },
    { title: 'TanStack Query', icon: tanstackQuery },
    { title: 'Shadcn UI', icon: shadcn },
    { title: 'Jotai', icon: jotai },
    { title: 'Zustand', icon: zustand },
    { title: 'Redux', icon: redux },
  ];

  const backEndSkills: TSkillprops[] = [
    { title: 'NodeJS', icon: nodeIcon },
    { title: 'TypeScript', icon: tsIcon },
    { title: 'Express', icon: expressIcon },
    { title: 'Python', icon: pyIcon },
    { title: 'Flask', icon: flaskIcon },
  ];
  const dborm: TSkillprops[] = [
    { title: 'Drizzle Orm', icon: drizzle },
    { title: 'Redis', icon: redisIcon },
    { title: 'Prisma', icon: prismaIcon },
    { title: 'PostgreSQL', icon: postgresql },
    { title: 'Turso', icon: turso },
    { title: 'MongoDB', icon: mongoDBIcon },
  ];
  const otherSkills: TSkillprops[] = [
    { title: 'Postman', icon: postman },
    { title: 'GitHub', icon: githubicon },
    { title: 'Docker', icon: docker },
  ];

  return (
    <section id='skills'>
      <SectionTitle>Skills</SectionTitle>
      <br />
      <div className='flex w-full flex-col flex-wrap items-start justify-evenly gap-16 gap-y-24 md:flex-row'>
        <div className='flex w-full flex-col items-center justify-center md:w-2/5'>
          <Reveal className='mb-8 mt-2'>
            <h2 className='text-2xl font-bold'>Front End</h2>
            <hr className='mx-auto my-2 h-2 w-3/5 rounded-full bg-primary' />
          </Reveal>
          <div className='grid w-full grid-cols-3 place-items-center gap-12'>
            {frontendSkills.map((value, index) => (
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
            <h2 className='text-2xl font-bold'>Back End</h2>
            <hr className='mx-auto my-2 h-2 w-3/5 rounded-full bg-primary' />
          </Reveal>
          <div className='grid w-full grid-cols-3 place-items-center gap-12'>
            {backEndSkills.map((value, index) => (
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
      <div className='flex flex-row flex-wrap items-start justify-around gap-20'>
        <div>
          <h2 className='mt-10 text-center text-2xl font-bold'>
            Database and ORMs
          </h2>
          <hr className='mx-auto my-2 h-2 w-24 rounded-full bg-primary' />
          <div className='mx-auto my-5 flex w-full max-w-xl flex-row flex-wrap items-center justify-center gap-x-16 gap-y-10'>
            {dborm.map((value, index) => (
              <Reveal
                delay={0.1 * index}
                className='flex max-w-44 flex-row items-center justify-around gap-4 transition hover:scale-105'
                disableReveal
                key={index}
              >
                <div className='mx-auto flex w-full cursor-pointer select-none flex-col items-center justify-center gap-2'>
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
        <div>
          <h2 className='mt-10 text-center text-2xl font-bold'>Other Tools</h2>
          <hr className='mx-auto my-2 h-2 w-24 rounded-full bg-primary' />
          <div className='mx-auto my-5 flex w-full max-w-4xl flex-row flex-wrap items-center justify-center gap-x-16 gap-y-10'>
            {otherSkills.map((value, index) => (
              <Reveal
                delay={0.1 * index}
                className='flex max-w-44 flex-row items-center justify-around gap-4 transition hover:scale-105'
                disableReveal
                key={index}
              >
                <div className='mx-auto flex w-full cursor-pointer select-none flex-col items-center justify-center gap-2'>
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
        <h4 className='text-center text-xl font-semibold'>
          Core Principles I Deliver
        </h4>
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
