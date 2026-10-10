import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';

export const Route = createFileRoute('/admin/')({ component: AdminHome });

// Placeholder: Phase 7 replaces this with the real admin panel.
function AdminHome() {
  const { user } = Route.useRouteContext();
  const navigate = useNavigate();
  return (
    <main id='main' className='container py-16'>
      <div className='flex items-start justify-between gap-4'>
        <h1 className='text-[28px] font-extrabold tracking-[-0.03em]'>Admin</h1>
        <ThemeToggle />
      </div>
      <p className='mt-2 text-ink2'>
        Signed in as {user.name} ({user.email}), role {user.role}.
      </p>
      <Button
        variant='outline'
        className='mt-6'
        onClick={async () => {
          await authClient.signOut();
          await navigate({ to: '/login', reloadDocument: true });
        }}
      >
        Sign out
      </Button>
    </main>
  );
}
