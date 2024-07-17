import React from 'react';
import { Metadata } from 'next';
import { Input } from '@/components/ui/input';
import LoginForm from './login-form';

export const metadata: Metadata = {
  title: 'Login',
  description: 'Login page',
};

export default async function Home() {
  return (
    <main className='grid h-svh w-screen place-items-center bg-background'>
      <div className='w-96 max-w-[90%] rounded-xl border p-5'>
        <LoginForm />
      </div>
    </main>
  );
}
