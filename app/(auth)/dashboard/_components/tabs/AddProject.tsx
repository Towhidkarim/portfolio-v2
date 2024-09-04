'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
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

// import { ProjectSubmitSchema } from '@/db/schema';
import { Textarea } from '@/components/ui/textarea';
import { ChangeEvent, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import FadeEffect from '@/components/framer/FadeEffect';
import Image from 'next/image';
import DropZone from '../../../../../components/DropZone';
import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
import SubmitProjectAction from '../_actions/SubmitProject';
import { ProjectSchema } from '@/db/schema';

export default function AddProject() {
  // const [displayImageUrl, setDisplayImageUrl] = useState('');
  const [projectImageInfo, setProjectImageInfo] = useState<{
    url: string;
    id: string;
  }>();

  const ProjectSubmitSchema = z.object({
    projectName: z.string().min(3).max(64),
    imgUrl: z.string().url().optional(),
    imgID: z.string().optional(),
    displayIndex: z.number(),
    description: z.string().min(10).max(2048).optional(),
    summary: z.string().min(10).max(128),
    demoLink: z.string().url().optional(),
    sourceLink: z.string().url().optional(),
  });

  const {
    data: responseData,
    isPending,
    mutate: SubmitProject,
  } = useMutation({
    mutationFn: SubmitProjectAction,
    onSuccess: (data) => {
      if (!data.ok) {
        toast('Error Occured', { description: data.message });
      } else toast('Added Successfully!', { description: data.message });
    },
    onError: (errorText) => toast(errorText.message),
  });
  const form = useForm<z.infer<typeof ProjectSubmitSchema>>({
    resolver: zodResolver(ProjectSubmitSchema),
    defaultValues: {
      projectName: '',
      summary: '',
      displayIndex: 0,
      description: '',
    },
  });
  const [tags, setTags] = useState<string[]>([]);

  const formOnSubmit = async (
    formData: z.infer<typeof ProjectSubmitSchema>,
  ) => {
    if (!projectImageInfo) {
      form.setError('root.random', {
        type: 'custom',
        message: 'Project Image not selected',
      });
      toast('Error', {
        description: 'Project Image not selected',
        duration: 3000,
      });
    } else {
      form.clearErrors();
      const tempData = formData;
      tempData.imgUrl = projectImageInfo.url;
      tempData.imgID = projectImageInfo.id;
      const { data, success } = ProjectSchema.safeParse(tempData);
      if (!success) {
        toast('Error', { description: 'Data Validation Faild' });
        return;
      }
      SubmitProject({ data });
    }
  };
  return (
    <section className='mx-auto max-w-lg rounded p-4'>
      <h1 className='pb-10 text-left text-2xl font-semibold'>
        Add New Project
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(formOnSubmit)} className='space-y-8'>
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
          {/* <FormField
            control={form.control}
            name='imageFile'
            render={({ field: { onChange, value, ...field } }) => (
              <FormItem>
                <FormLabel>Project Image</FormLabel>
                <FormControl>
                  <Input
                    type='file'
                    multiple={false}
                    accept='image/*'
                    disabled={form.formState.isSubmitting}
                    className='cursor-pointer'
                    {...field}
                    onChange={(e) => {
                      if (!e.target.files || e.target.files?.length <= 0) {
                        setDisplayImageUrl('');
                        return;
                      }
                      const { displayUrl, file } = getImageInfo(e);
                      setDisplayImageUrl(displayUrl);
                      onChange(file);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}
          <FormLabel className='-mb-10'>Project Image</FormLabel>
          <DropZone setFile={setProjectImageInfo} />
          {/* <div className='relative h-44'>
            <Image
              src={displayImageUrl}
              alt='temp'
              className='object-contain'
              fill
            />
          </div> */}
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
          <Button disabled={isPending} type='submit' className='w-full'>
            Submit
          </Button>
        </form>
      </Form>
    </section>
  );
}
