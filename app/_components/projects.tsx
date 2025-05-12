'use client';
import Reveal from '@/components/framer/Reveal';
import { Button } from '@/components/ui/button';
import SectionTitle from '@/components/ui/section-title';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { Code, CodeXml, Dot, Link2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import MotionDiv from '@/components/framer/MotionDiv';
import { useQuery } from '@tanstack/react-query';
import FetchPublicProjectsAction from '@/lib/global-actions/FetchPublicProjects';
import { queryKeys } from '@/lib/constants';
import Link from 'next/link';
import Image from 'next/image';
import ProjectCardSkeleton from '@/components/ui/project-card-skeleton';

export default function Projects() {
  const [currentTab, setCurrentTab] = useState(0);
  const minIndex = 10;
  const { data: response, isLoading } = useQuery({
    queryFn: () => FetchPublicProjectsAction({ minIndex }),
    queryKey: [queryKeys.publicProjects],
    staleTime: 5 * 60 * 1000,
  });
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
        <h2 className='my-2 font-semibold text-lg text-center'>Categories</h2>
        <div className='flex flex-wrap justify-center items-center gap-3'>
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
                  className='z-10 absolute inset-0 bg-primary rounded-[1rem] size-full'
                />
              )}
              <span className='z-20 relative'>{value.title}</span>
            </Button>
          ))}
        </div>
      </Reveal>
      <div className='place-content-between place-items-center gap-16 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 mx-auto my-20 w-full'>
        {/* <ProjectCardSkeleton /> */}
        {isLoading
          ? [1, 2, 3].map((v, i) => <ProjectCardSkeleton key={i} />)
          : ''}
        {response?.data?.map((item, index) => (
          <Reveal
            key={index}
            disableReveal
            delay={0.1 + 0.1 * index}
            className='rounded-l w-11/12 min-w-[340px]'
          >
            <div className='flex flex-col gap-3 border rounded-lg w-full h-[550px]'>
              <figure className='relative rounded-t-lg w-full h-[50%]'>
                {/* <Skeleton className='rounded-t-l rounded-b-none w-full h-full' /> */}
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  className='rounded-t-lg object-cover'
                  loading='eager'
                  sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                  priority
                  fill
                />
              </figure>
              <div className='px-6 h-[40%]'>
                <Reveal delay={0.25} className='w-full'>
                  <div className='flex justify-between items-center'>
                    <h2 className='font-bold text-xl -translate-y-0.5 shrink-0'>
                      {item.name}
                    </h2>
                    <MotionDiv
                      className='bg-primary mx-2 rounded-full w-full h-1 origin-left'
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 1 + 0.25 * index, duration: 0.5 }}
                    />
                  </div>
                </Reveal>
                <Reveal delay={0.1} className='my-2'>
                  <div className='flex flex-wrap gap-2 my-2'>
                    {item.tags?.map((value, i) => (
                      <Badge
                        key={i}
                        className='pr-2 pb-1 capitalize cursor-default'
                      >
                        {value}
                      </Badge>
                    ))}
                    {/* <Badge>NextJs</Badge> */}
                  </div>
                </Reveal>
                <Reveal delay={0.1} className='max-h-24 overflow-hidden'>
                  {item.summary}
                </Reveal>
              </div>
              <div className='flex justify-center items-center gap-4 mx-auto my-5 px-10 w-full h-[10%]'>
                <Button variant='outline' className='inline-flex gap-1' asChild>
                  <Link
                    href={item.demoLink}
                    target='_blank'
                    className='inline-flex gap-1'
                  >
                    <Link2 size={24} />
                    View Demo
                  </Link>
                </Button>
                <Button variant='outline' className=''>
                  <Link
                    href={item.sourceLink}
                    target='_blank'
                    className='inline-flex gap-1'
                  >
                    <CodeXml />
                    Source Code
                  </Link>
                </Button>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
