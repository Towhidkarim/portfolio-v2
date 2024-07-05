'use client';
import Reveal from '@/components/framer/Reveal';
import { Button } from '@/components/ui/button';
import SectionTitle from '@/components/ui/section-title';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { Code, CodeXml, Link2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import MotionDiv from '@/components/framer/MotionDiv';

export default function Projects() {
  const [currentTab, setCurrentTab] = useState(0);
  const tabs = [
    { id: 0, title: 'All' },
    { id: 1, title: 'Front-End' },
    { id: 2, title: 'Back-End' },
    { id: 3, title: 'Others' },
  ];
  return (
    <section id='projects' className='my-44'>
      <SectionTitle className=''>My Projects</SectionTitle>
      <br />
      <Reveal className='mx-auto w-full' delay={0.1}>
        <h2 className='my-2 text-center text-lg font-semibold'>Categories</h2>
        <div className='flex flex-wrap items-center justify-center gap-3'>
          {tabs.map((value, index) => (
            <Button
              variant={currentTab === value.id ? 'default' : 'outline'}
              onClick={() => {
                setCurrentTab(value.id);
              }}
              className='relative border transition-all duration-300'
              key={index}
            >
              {currentTab === value.id && (
                <motion.div
                  layoutId='active-tab'
                  className='absolute inset-0 z-10 size-full rounded-[1rem] bg-primary'
                />
              )}
              <span className='relative z-20'>{value.title}</span>
            </Button>
          ))}
        </div>
      </Reveal>
      <div className='mx-auto my-20 grid w-full grid-cols-1 place-content-between place-items-center gap-16 md:grid-cols-2 xl:grid-cols-3'>
        {[1, 2, 3, 4].map((value, index) => (
          <Reveal
            key={index}
            disableReveal
            delay={0.1 + 0.1 * index}
            className='w-11/12 min-w-[350px] rounded-l'
          >
            <div className='flex h-[550px] w-full flex-col gap-3 rounded-lg border'>
              <figure className='h-[50%] w-full rounded-t-lg'>
                <Skeleton className='rounded-t-l h-full w-full rounded-b-none' />
              </figure>
              <div className='h-[40%] px-10'>
                <Reveal delay={0.25} className='w-full'>
                  <div className='flex items-center justify-between'>
                    <h2 className='shrink-0 -translate-y-0.5 text-xl font-bold'>
                      A ver big title
                    </h2>
                    <MotionDiv
                      className='mx-2 h-1 w-full origin-left rounded-full bg-primary'
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 1 + 0.25 * index, duration: 0.5 }}
                    />
                  </div>
                </Reveal>
                <Reveal delay={0.1} className='my-2'>
                  <div className='flex flex-wrap gap-2'>
                    <Badge>React</Badge>
                    <Badge>NextJs</Badge>
                  </div>
                </Reveal>
                <Reveal delay={0.1} className='overflow-hidden'>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod
                  quibusdam reiciendis consectetur exercitationem minus
                </Reveal>
              </div>
              <div className='flex h-[10%] w-full justify-between gap-2 px-10'>
                <Button variant='outline' className='inline-flex gap-1'>
                  <Link2 size={24} />
                  View Demo
                </Button>
                <Button variant='outline' className='inline-flex gap-1'>
                  <CodeXml />
                  Source Code
                </Button>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
