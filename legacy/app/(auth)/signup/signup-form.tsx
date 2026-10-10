'use client';
import { Input } from '@/components/ui/input';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
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
import { userNameRegex } from '@/lib/constants';
import { SignUpAction } from './actions';

const loginSchema = z.object({
  email: z.string().email(),
  username: z
    .string()
    .regex(
      userNameRegex,
      "Only characters A-Z, a-z, 0-9 and '_' are  acceptable.",
    ),
  password: z.string().min(6).max(64),
});

export default function SignUpForm() {
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      username: '',
      password: '',
    },
  });

  const formOnSubmit = async (values: z.infer<typeof loginSchema>) => {
    const res = await SignUpAction(values);
    console.log(res);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(formOnSubmit)} className='space-y-8'>
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder='Email' type='email' {...field} />
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
          name='username'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder='Username' type='text' {...field} />
              </FormControl>
              {/* <FormDescription>
                This is your public display name.
              </FormDescription> */}
              <FormMessage className='font-bold text-rose-500' />
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
        <Button type='submit' className='w-full'>
          Sign Up
        </Button>
      </form>
    </Form>
  );
}
