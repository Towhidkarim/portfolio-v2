import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { z } from 'zod';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
    <main
      id='main'
      className='relative flex min-h-screen items-center justify-center px-5'
    >
      <div className='absolute top-5 right-5'>
        <ThemeToggle />
      </div>
      <div className='w-full max-w-sm rounded-card border border-line bg-card p-8'>
        <p className='font-mono text-xs uppercase tracking-[0.14em] text-brand-ink'>
          Admin
        </p>
        <h1 className='mt-2 text-[28px] font-extrabold tracking-[-0.03em]'>
          Sign in
        </h1>
        <form
          onSubmit={onSubmit}
          className='mt-6 flex flex-col gap-4'
          noValidate
        >
          <div>
            <Label htmlFor='email'>Email</Label>
            <Input
              id='email'
              name='email'
              type='email'
              autoComplete='username'
              required
              aria-invalid={error ? true : undefined}
            />
          </div>
          <div>
            <Label htmlFor='password'>Password</Label>
            <div className='flex gap-2'>
              <Input
                id='password'
                name='password'
                type={showPassword ? 'text' : 'password'}
                autoComplete='current-password'
                required
                aria-invalid={error ? true : undefined}
              />
              <Button
                variant='outline'
                onClick={() => setShowPassword((v) => !v)}
                aria-pressed={showPassword}
                className='px-4'
              >
                {showPassword ? 'Hide' : 'Show'}
              </Button>
            </div>
          </div>
          <p
            role='alert'
            aria-live='polite'
            className='min-h-5 text-sm text-danger'
          >
            {error}
          </p>
          <Button type='submit' disabled={pending} className='w-full'>
            {pending ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>
      </div>
    </main>
  );
}
