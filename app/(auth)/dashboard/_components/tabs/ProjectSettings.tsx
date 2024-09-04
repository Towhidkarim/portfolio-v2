'use client';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Textarea } from '@/components/ui/textarea';
import { ChangeEvent, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import FadeEffect from '@/components/framer/FadeEffect';
import Image from 'next/image';
import DropZone from '../../../../../components/DropZone';
import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
import SubmitProjectAction from '../_actions/SubmitProject';
import { ProjectSchema, TProject } from '@/db/schema';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

export default function ProjectSettings({
  defaultValues,
}: {
  defaultValues: TProject;
}) {
  const {
    projectName,
    summary,
    demoLink,
    description,
    sourceLink,
    imgUrl,
    tags: projectTags,
  } = defaultValues;

  const ProjectSubmitSchema = z.object({
    projectName: z.string().min(3).max(64),
    imgUrl: z.string().url().optional(),
    imgID: z.string().optional(),
    displayIndex: z.number(),
    description: z.string().min(10).max(2048),
    summary: z.string().min(10).max(128),
    demoLink: z.string().url(),
    sourceLink: z.string().url(),
  });

  const form = useForm<z.infer<typeof ProjectSubmitSchema>>({
    resolver: zodResolver(ProjectSubmitSchema),
    defaultValues: {
      projectName,
      description: description ?? '',
      summary,
      demoLink,
      sourceLink,
      displayIndex: 0,
    },
  });
  const [tags, setTags] = useState<string[]>(projectTags ?? []);

  return (
    <section className='rounded p-4 px-5'>
      {/* <h1 className='pb-10 text-left text-2xl font-semibold'></h1> */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(() => {})} className='space-y-8'>
          <FormField
            control={form.control}
            name='projectName'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Name</FormLabel>
                <FormControl>
                  <Input placeholder='Project Name' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='summary'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Sumary</FormLabel>
                <FormControl>
                  <Textarea
                    className='max-h-24'
                    placeholder='Project Sumary'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='description'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Description</FormLabel>
                <FormControl>
                  <Textarea
                    className='max-h-44 min-h-28'
                    placeholder='Project Description'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div>
            <FormLabel className='mb-2 mt-4'>
              Tags (Seperate by comma)
            </FormLabel>
            <Input
              className='my-2'
              type='text'
              defaultValue={tags?.join(', ')}
              onChange={(e) => setTags(e.target.value.trim()?.split(','))}
              placeholder='React, Next.js, etc....'
            />
          </div>
          <div className='flex h-5 gap-2'>
            {tags?.map((item, index) =>
              item.trim() ? (
                <FadeEffect key={index}>
                  <Badge className='capitalize'>{item}</Badge>
                </FadeEffect>
              ) : (
                ''
              ),
            )}
          </div>
          <FormLabel className='-mb-10'>Project Image</FormLabel>
          <div className='w-full'></div>
          {/* <Image src={imgUrl} alt='' fill /> */}
          <div className='flex w-full gap-3'>
            <FormField
              control={form.control}
              name='demoLink'
              render={({ field }) => (
                <FormItem className='w-2/4'>
                  <FormLabel>Demo Link</FormLabel>
                  <FormControl>
                    <Input placeholder='URL' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='sourceLink'
              render={({ field }) => (
                <FormItem className='w-2/4'>
                  <FormLabel>Source Link</FormLabel>
                  <FormControl>
                    <Input placeholder='URL' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={false} type='submit' className='w-full'>
            Submit
          </Button>
        </form>
      </Form>
    </section>
  );
}
