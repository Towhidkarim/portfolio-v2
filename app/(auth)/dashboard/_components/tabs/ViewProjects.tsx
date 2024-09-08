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
  // const data: TProject[] = [
  //   {
  //     projectName: 'Personal Portfolio',
  //     imgUrl: 'https://example.com/images/portfolio.jpg',
  //     imgID: 'img123',
  //     id: 'proj1',
  //     displayIndex: 1,
  //     tags: ['React', 'CSS', 'HTML'],
  //     summary: 'A personal portfolio showcasing my projects and skills.',
  //     description:
  //       'This project is a fully responsive personal portfolio website built using React and styled-components. It includes sections like About, Projects, and Contact.',
  //     demoLink: 'https://example.com/portfolio',
  //     sourceLink: 'https://github.com/user/portfolio',
  //   },
  //   {
  //     projectName: 'E-commerce Website',
  //     imgUrl: 'https://example.com/images/ecommerce.jpg',
  //     imgID: 'img124',
  //     id: 'proj2',
  //     displayIndex: 2,
  //     tags: ['Next.js', 'TailwindCSS', 'Node.js'],
  //     summary:
  //       'An e-commerce platform with a modern UI and payment integration.',
  //     description:
  //       'A fully functional e-commerce website built with Next.js, featuring product listings, a shopping cart, and Stripe payment integration.',
  //     demoLink: 'https://example.com/ecommerce',
  //     sourceLink: 'https://github.com/user/ecommerce',
  //   },
  //   {
  //     projectName: 'Social Media App',
  //     imgUrl: 'https://example.com/images/social.jpg',
  //     imgID: 'img125',
  //     id: 'proj3',
  //     displayIndex: 3,
  //     tags: ['React Native', 'Firebase', 'Redux'],
  //     summary:
  //       'A mobile app for social networking with real-time chat and notifications.',
  //     description:
  //       'This project is a social media app developed using React Native and Firebase. It includes features like user authentication, real-time messaging, and push notifications.',
  //     demoLink: 'https://example.com/socialapp',
  //     sourceLink: 'https://github.com/user/socialapp',
  //   },
  //   {
  //     projectName: 'Task Management Tool',
  //     imgUrl: 'https://example.com/images/task.jpg',
  //     imgID: 'img126',
  //     id: 'proj4',
  //     displayIndex: 4,
  //     tags: ['Vue.js', 'Vuetify', 'Node.js'],
  //     summary:
  //       'A web application to manage tasks and projects with team collaboration.',
  //     description:
  //       'A task management tool built with Vue.js and Vuetify, offering features like task assignment, project timelines, and team collaboration.',
  //     demoLink: 'https://example.com/taskmanager',
  //     sourceLink: 'https://github.com/user/taskmanager',
  //   },
  //   {
  //     projectName: 'Weather Dashboard',
  //     imgUrl: 'https://example.com/images/weather.jpg',
  //     imgID: 'img127',
  //     id: 'proj5',
  //     displayIndex: 5,
  //     tags: ['React', 'API', 'Chart.js'],
  //     summary: 'A dashboard to display weather data for different cities.',
  //     description:
  //       'This project is a weather dashboard built using React and Chart.js, fetching real-time weather data from an external API and displaying it in a user-friendly interface.',
  //     demoLink: 'https://example.com/weatherdashboard',
  //     sourceLink: 'https://github.com/user/weatherdashboard',
  //   },
  // ];

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
                <CardDescription>
                  <span
                    className={cn(
                      'my-0.5 font-semibold',
                      item.enabled ? 'text-green-500' : 'text-rose-500',
                    )}
                  >
                    {item.enabled ? 'Enabled' : 'Disabled'}
                  </span>
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
