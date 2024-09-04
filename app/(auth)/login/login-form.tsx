'use client';
import { Input } from '@/components/ui/input';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useMutation, useQuery } from '@tanstack/react-query';
import { SignInAction } from './actions';
import { LoaderCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { routes } from '@/lib/constants';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(64),
});

export default function LoginForm() {
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const router = useRouter();

  const {
    mutate: SignIn,
    data,
    isPending,
  } = useMutation({
    mutationFn: SignInAction,
    onSuccess: (data) => {
      // console.log(data);
      if (data.ok) {
        toast('Login Successful', {
          description: 'Redirecting...',
          duration: 4000,
          action: {
            label: 'Close',
            onClick: () => {},
          },
        });
        router.push(routes.dashboard);
      } else
        toast('Error Occured', {
          description: data.message,
          action: {
            label: 'Close',
            onClick: () => {},
          },
        });
    },
  });
  // const formOnSubmit =  (values: z.infer<typeof loginSchema>) => {
  //   SignIn(values);
  //   //  if(data?.ok)
  // };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => SignIn(values))}
        className='space-y-8'
      >
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder='Email' {...field} />
              </FormControl>
              {/* <FormDescription>
                This is your public display name.
              </FormDescription> */}
              <FormMessage className='h-2 font-bold text-rose-500' />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder='Password' type='password' {...field} />
              </FormControl>
              {/* <FormDescription>
                This is your public display name.
              </FormDescription> */}
              <FormMessage className='font-bold text-rose-500' />
            </FormItem>
          )}
        />
        <Button
          disabled={isPending}
          type='submit'
          className='inline-flex w-full gap-2'
        >
          {isPending && (
            <span className='animate-spin'>
              <LoaderCircle />
            </span>
          )}
          Login
        </Button>
      </form>
    </Form>
  );
}
