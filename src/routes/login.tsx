import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { z } from 'zod';
import { authClient } from '@/lib/auth-client';
import { safeRedirect } from '@/lib/redirect';
import { fetchAdminSession } from '@/server/fns/session.functions';

export const Route = createFileRoute('/login')({
  validateSearch: z.object({ redirect: z.string().optional() }),
  beforeLoad: async ({ search }) => {
    if (await fetchAdminSession()) {
      throw redirect({ to: safeRedirect(search.redirect) });
    }
  },
  head: () => ({
    meta: [
      { title: 'Sign in | Towhid Karim' },
      { name: 'robots', content: 'noindex' },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { redirect: target } = Route.useSearch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setPending(true);
    setError(null);
    const { error } = await authClient.signIn.email({
      email: String(form.get('email') ?? ''),
      password: String(form.get('password') ?? ''),
    });
    if (!error) {
      await navigate({ to: safeRedirect(target), reloadDocument: true });
      return;
    }
    setPending(false);
    // Same message for a wrong password and an unknown email.
    setError(
      error.status === 429
        ? 'Too many attempts. Try again in a minute.'
        : error.status === 401 || error.status === 400
          ? 'Invalid email or password.'
          : 'Could not sign in. Try again.',
    );
  }

  return (
    <main className='mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-6 px-4'>
      <h1 className='text-2xl font-bold'>Sign in</h1>
      <form onSubmit={onSubmit} className='flex flex-col gap-4' noValidate>
        <div className='flex flex-col gap-1.5'>
          <label htmlFor='email' className='text-sm font-medium'>
            Email
          </label>
          <input
            id='email'
            name='email'
            type='email'
            autoComplete='username'
            required
            className='h-12 rounded-xl border px-3'
          />
        </div>
        <div className='flex flex-col gap-1.5'>
          <label htmlFor='password' className='text-sm font-medium'>
            Password
          </label>
          <div className='flex gap-2'>
            <input
              id='password'
              name='password'
              type={showPassword ? 'text' : 'password'}
              autoComplete='current-password'
              required
              className='h-12 flex-1 rounded-xl border px-3'
            />
            <button
              type='button'
              onClick={() => setShowPassword((v) => !v)}
              aria-pressed={showPassword}
              className='h-12 rounded-xl border px-3 text-sm'
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>
        <p
          role='alert'
          aria-live='polite'
          className='min-h-5 text-sm text-red-600'
        >
          {error}
        </p>
        <button
          type='submit'
          disabled={pending}
          className='h-12 rounded-xl bg-black px-5 font-semibold text-white disabled:opacity-60'
        >
          {pending ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </main>
  );
}
