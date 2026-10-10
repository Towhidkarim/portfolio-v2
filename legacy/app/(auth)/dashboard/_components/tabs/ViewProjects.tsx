'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { TProject } from '@/db/schema';

import FetchProjectsAction from '@/lib/global-actions/FetchProjects';
import { useMutation, useQuery } from '@tanstack/react-query';
import { LoaderCircle, Settings } from 'lucide-react';
import { useState } from 'react';
import ProjectSettings from './ProjectSettings';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { queryKeys } from '@/lib/constants';

export default function ViewProjects() {
  // const {data, status, mutate: FetchProjects} = useMutation({ mutationFn: FetchProjectsAction})
  const [currentPage, setCurrentPage] = useState(0);
  const MAX_PER_PAGE = 10;
  const { data, status, isLoading, refetch } = useQuery({
    queryFn: async () =>
      await FetchProjectsAction(MAX_PER_PAGE, MAX_PER_PAGE * currentPage),
    queryKey: [queryKeys.adminProjects],
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    // staleTime: 1000, //5 mins -> ms
    // refetchInterval: 3000,
    // refetchInterval: 2 * 60 * 1000,
  });

  return (
    <section>
      <h1 className='mt-4 text-2xl font-bold'>All Projects </h1>
      <div className='flex flex-row flex-wrap place-items-center gap-5 gap-y-5 px-5 py-5'>
        {isLoading && (
          <span className='mx-auto animate-spin'>
            <LoaderCircle size={36} />
          </span>
        )}
        {data?.map((item, index) => (
          <Card key={index} className='group h-64 w-72 cursor-default'>
            <CardHeader className='flex flex-row items-start justify-between pb-4 pt-4'>
              <div className=''>
                <CardTitle className='capitalize'>
                  <span
                    className={cn(
                      !item.enabled ? 'text-muted-foreground' : 'text-primary',
                    )}
                  ></span>
                  {item.projectName}
                </CardTitle>
                <CardDescription className='flex items-center justify-center gap-2'>
                  <span
                    className={cn(
                      'my-0.5 font-semibold',
                      item.enabled ? 'text-green-500' : 'text-rose-500',
                    )}
                  >
                    {item.enabled ? 'Enabled' : 'Disabled'}
                  </span>
                  •<span>Priority: {item.displayIndex}</span>
                </CardDescription>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant='ghost'
                    className='mt-0 p-1.5 opacity-0 transition hover:rotate-90 hover:opacity-85 group-hover:opacity-75'
                  >
                    <Settings />
                  </Button>
                </DialogTrigger>
                <DialogContent className='max-w-xl'>
                  <ScrollArea className='h-[85vh]'>
                    <DialogHeader className='my-2'>
                      <DialogTitle className='text-xl'>
                        {item.projectName}
                      </DialogTitle>
                      <DialogDescription>Settings</DialogDescription>
                    </DialogHeader>
                    <ProjectSettings defaultValues={item} />
                  </ScrollArea>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button className='w-full' variant='secondary'>
                        Close
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <p>{item.summary}</p>
            </CardContent>
            <CardFooter></CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}
