import { createFileRoute } from '@tanstack/react-router';
import { getAuth } from '@/server/auth.server';

// Auth responses are per-user: never let a shared cache keep them.
async function handle(request: Request) {
  const res = await getAuth().handler(request);
  const out = new Response(res.body, res);
  out.headers.set('Cache-Control', 'private, no-store');
  return out;
}

export const Route = createFileRoute('/api/auth/$')({
  server: {
    handlers: {
      GET: ({ request }) => handle(request),
      POST: ({ request }) => handle(request),
    },
  },
});
