import { Metadata } from 'next';
import SignUpForm from './signup-form';

export const metadata: Metadata = {
  title: 'Sign up',
  description: 'Sign up page',
};

export default function Home() {
  return (
    <main className='grid h-svh w-screen place-items-center bg-background'>
      <div className='w-96 max-w-[90%] rounded-xl border p-5'>
        <SignUpForm />
      </div>
    </main>
  );
}
