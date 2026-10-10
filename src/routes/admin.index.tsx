import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { authClient } from '@/lib/auth-client';

export const Route = createFileRoute('/admin/')({ component: AdminHome });

// Placeholder: Phase 7 replaces this with the real admin panel.
function AdminHome() {
  const { user } = Route.useRouteContext();
  const navigate = useNavigate();
  return (
    <main className='mx-auto max-w-xl px-4 py-16'>
      <h1 className='text-2xl font-bold'>Admin</h1>
      <p className='mt-2'>
        Signed in as {user.name} ({user.email}), role {user.role}.
      </p>
      <button
        type='button'
        className='mt-6 h-12 rounded-xl border px-5 font-semibold'
        onClick={async () => {
          await authClient.signOut();
          await navigate({ to: '/login', reloadDocument: true });
        }}
      >
        Sign out
      </button>
    </main>
  );
}
