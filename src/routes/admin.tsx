import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { fetchAdminSession } from '@/server/fns/session.functions';

export const Route = createFileRoute('/admin')({
  // Run the guard on the server for the first request (so unauthenticated
  // visitors get a redirect, never admin HTML) but render the UI on the client
  // only, which keeps SSR CPU off the free plan's budget.
  ssr: 'data-only',
  beforeLoad: async ({ location }) => {
    const session = await fetchAdminSession();
    if (!session) {
      throw redirect({ to: '/login', search: { redirect: location.href } });
    }
    return { user: session.user };
  },
  head: () => ({
    meta: [
      { title: 'Admin | Towhid Karim' },
      { name: 'robots', content: 'noindex' },
    ],
  }),
  component: () => <Outlet />,
});
