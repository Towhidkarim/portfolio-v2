import { createFileRoute } from '@tanstack/react-router';
import { getDb } from '@/server/db.server';
import { getPublicProjects } from '@/server/queries/projects.server';

const escapeXml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Origin comes from the request until PUBLIC_SITE_URL exists (Phase 8).
export const Route = createFileRoute('/sitemap.xml')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const origin = new URL(request.url).origin;
        const projects = await getPublicProjects(getDb());
        const paths = [
          '/',
          '/all-projects',
          ...projects.map((p) => `/projects/${encodeURIComponent(p.id)}`),
        ];
        const urls = paths
          .map((p) => `  <url><loc>${escapeXml(origin + p)}</loc></url>`)
          .join('\n');
        const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
        return new Response(body, {
          headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            'Cache-Control': 'private, no-store',
          },
        });
      },
    },
  },
});
