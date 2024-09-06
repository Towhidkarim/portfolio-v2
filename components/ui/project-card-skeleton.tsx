import React from 'react';
import { Skeleton } from './skeleton';

export default function ProjectCardSkeleton() {
  return (
    <div className='w-11/12 min-w-[340px] rounded-l'>
      <div className='flex h-[550px] w-full flex-col gap-3 rounded-lg border'>
        <figure className='relative h-[50%] w-full rounded-t-lg'>
          <Skeleton className='rounded-t-l h-full w-full rounded-b-none' />
        </figure>
        <div className='h-[40%] px-6'>
          <div className='w-full'>
            <div className='flex items-center justify-between'>
              <Skeleton className='my-2 h-7 w-full shrink-0 -translate-y-0.5 text-xl font-bold' />
            </div>
          </div>
          <div className='my-2'>
            <div className='my-2 flex flex-wrap gap-2'>
              {[1, 2, 3, 4].map((value, i) => (
                <Skeleton
                  key={i}
                  className='h-6 w-14 cursor-default rounded-full pb-1 pr-2'
                />
              ))}
              {/* <Badge>NextJs</Badge> */}
            </div>
          </div>
          <Skeleton className='mt-4 h-24 w-full' />
        </div>
        <div className='mx-auto my-5 flex h-[10%] w-full items-center justify-between gap-4 px-10'>
          <Skeleton className='h-8 w-24' />
          <Skeleton className='h-8 w-24' />
        </div>
      </div>
    </div>
  );
}
