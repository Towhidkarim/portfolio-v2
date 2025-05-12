'use client';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import FadeEffect from '@/components/framer/FadeEffect';
import Image from 'next/image';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import SubmitProjectAction from '../_actions/SubmitProject';
import { ProjectSchema, TProject } from '@/db/schema';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import ModifyProjectAction from '@/lib/global-actions/ModifyProjects';
import { queryKeys } from '@/lib/constants';
import { useRouter } from 'next/navigation';
import { LoaderCircle } from 'lucide-react';
import { DeleteProject } from './DeleteProject';

export default function ProjectSettings({
  defaultValues,
}: {
  defaultValues: TProject;
}) {
  const {
    id,
    projectName,
    summary,
    demoLink,
    description,
    sourceLink,
    imgUrl,
    enabled,
    displayIndex,
    tags: projectTags,
  } = defaultValues;

  const ProjectSubmitSchema = z.object({
    enabled: z.boolean(),
    projectName: z.string().min(3).max(64),
    imgUrl: z.string().url(),
    displayIndex: z.number(),
    tags: z.array(z.string()),
    description: z.string().min(10).max(2048),
    summary: z.string().min(10).max(1024),
    demoLink: z.string().url(),
    sourceLink: z.string().url(),
  });
  const queryClient = useQueryClient();
  // const router = useRouter();
  const { isPending, mutate: ModifyProject } = useMutation({
    mutationFn: ModifyProjectAction,
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.adminProjects],
      });
      if (response.ok) {
        toast('Succes!', { description: response.message });
      } else toast('Error Occured', { description: response.message });
    },
  });

  const [tags, setTags] = useState<string[]>(projectTags ?? []);
  const form = useForm<z.infer<typeof ProjectSubmitSchema>>({
    resolver: zodResolver(ProjectSubmitSchema),
    defaultValues: {
      enabled,
      imgUrl,
      projectName,
      tags,
      description: description ?? '',
      summary,
      demoLink,
      sourceLink,
      displayIndex,
    },
  });

  const formOnSubmit = async (values: z.infer<typeof ProjectSubmitSchema>) => {
    // console.log(tempData);
    const dirty = form.formState.dirtyFields;
    const tempData = {
      enabled: dirty.enabled ? values.enabled : undefined,
      imgUrl: dirty.imgUrl ? values.imgUrl : undefined,
      projectName: dirty.projectName ? values.projectName : undefined,
      tags: dirty.tags ? tags : undefined,
      description: dirty.description ? values.description : undefined,
      summary: dirty.summary ? values.summary : undefined,
      demoLink: dirty.demoLink ? values.demoLink : undefined,
      sourceLink: dirty.sourceLink ? values.sourceLink : undefined,
      displayIndex: dirty.displayIndex ? values.displayIndex : undefined,
    };

    ModifyProject({ id: id ?? '', values: tempData });
  };

  return (
    <section className='p-4 px-5 rounded max-w-[500px]'>
      {/* <h1 className='pb-10 font-semibold text-2xl text-left'></h1> */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(formOnSubmit)} className='space-y-8'>
          <FormField
            control={form.control}
            name='enabled'
            render={({ field }) => (
              <FormItem className='flex flex-row justify-center items-center'>
                <FormLabel
                  className='text-lg cursor-pointer'
                  htmlFor='projectEnableSwitch'
                >
                  Project Display Enabled
                </FormLabel>
                <FormControl className='mx-4 scale-110 -translate-y-1'>
                  <Switch
                    id='projectEnableSwitch'
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
                    className='min-h-28 max-h-44'
                    placeholder='Project Description'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div>
            {/* <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags (Seperate by comma)</FormLabel>
                  <FormControl>
                    <Input
                      className='my-2'
                      type='text'
                      defaultValue={tags?.join(', ')}
                      onChange={(e) => {
                        setTags(e.target.value.trim()?.split(', '));
                        form.setValue('tags', tags);
                      }}
                      placeholder='React, Next.js, etc....'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
            <FormLabel className='mt-4 mb-2'>
              Tags (Seperate by comma)
            </FormLabel>
            <Input
              className='my-2'
              type='text'
              defaultValue={tags?.join(', ')}
              placeholder='React, Next.js, etc....'
              onChange={(e) => {
                setTags(e.target.value.trim()?.split(','));
                form.setValue('tags', tags, { shouldDirty: true });
              }}
            />
          </div>
          <div className='flex flex-wrap gap-2 h-5'>
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
          <br />
          <br />
          <FormLabel className='mt-10'>Project Image</FormLabel>
          <figure className='relative p-4 w-full h-96'>
            <Image
              src={imgUrl}
              alt=''
              className='rounded-3xl object-contain'
              fill
            />
          </figure>
          <FormField
            control={form.control}
            name='displayIndex'
            render={({ field }) => (
              <FormItem className='w-2/4'>
                <FormLabel>Display Index</FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    {...field}
                    onChange={(e) => {
                      field.onChange();
                      form.setValue('displayIndex', Number(e.target.value));
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className='flex gap-3 w-full'>
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
          <Button
            disabled={!form.formState.isDirty || isPending}
            type='submit'
            // onClick={() => console.log(form.formState.errors)}
            className='w-full'
          >
            {isPending && (
              <span className='mx-auto animate-spin'>
                <LoaderCircle size={36} />
              </span>
            )}
            Save Changes
          </Button>
          {/* <DeleteProject projectID={id ?? ''} projectName={projectName} /> */}
        </form>
      </Form>
    </section>
  );
}
