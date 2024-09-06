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
        {/* <ProjectCardSkeleton /> */}
        {isLoading ?? [1, 2, 3].map((v, i) => <ProjectCardSkeleton key={i} />)}
        {response?.data?.map((item, index) => (
          <Reveal
            key={index}
            disableReveal
            delay={0.1 + 0.1 * index}
            className='w-11/12 min-w-[340px] rounded-l'
          >
            <div className='flex h-[550px] w-full flex-col gap-3 rounded-lg border'>
              <figure className='relative h-[50%] w-full rounded-t-lg'>
                {/* <Skeleton className='rounded-t-l h-full w-full rounded-b-none' /> */}
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  className='rounded-t-lg object-cover'
                  loading='eager'
                  priority
                  fill
                />
              </figure>
              <div className='h-[40%] px-6'>
                <Reveal delay={0.25} className='w-full'>
                  <div className='flex items-center justify-between'>
                    <h2 className='shrink-0 -translate-y-0.5 text-xl font-bold'>
                      {item.name}
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
                  <div className='my-2 flex flex-wrap gap-2'>
                    {item.tags?.map((value, i) => (
                      <Badge
                        key={i}
                        className='cursor-default pb-1 pr-2 capitalize'
                      >
                        {value}
                      </Badge>
                    ))}
                    {/* <Badge>NextJs</Badge> */}
                  </div>
                </Reveal>
                <Reveal delay={0.1} className='overflow-hidden'>
                  {item.summary}
                </Reveal>
              </div>
              <div className='mx-auto my-5 flex h-[10%] w-full items-center justify-center gap-4 px-10'>
                <Button variant='outline' className='inline-flex gap-1' asChild>
                  <Link href={item.demoLink} className='inline-flex gap-1'>
                    <Link2 size={24} />
                    View Demo
                  </Link>
                </Button>
                <Button variant='outline' className=''>
                  <Link href={item.sourceLink} className='inline-flex gap-1'>
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
