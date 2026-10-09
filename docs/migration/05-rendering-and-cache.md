# Rendering and edge cache

Goal: public pages are served from Cloudflare's edge in a few milliseconds with **no database call per visit**, and an edit in the admin shows up for visitors **immediately**.

> **PENDING RESEARCH R-03** governs most of this file. Every API shape below is intent. Run the Phase 5 spike on a real custom domain before building on it.

## Model

1. Public routes are server-rendered by the Worker on a cache miss: `/`, `/all-projects`, `/projects/$id`, `/blog`, `/blog/$slug`, `/sitemap.xml`, `/robots.txt`.
2. The Worker stores the rendered response in the Workers Cache API (`caches.default`) keyed by the normalised URL.
3. A later request for the same URL is answered from cache without rendering or touching D1.
4. Every admin write that changes public content purges the affected URLs, locally and globally.
5. Everything under `/admin`, `/login`, `/api/*` and every non-GET request bypasses the cache and gets `Cache-Control: private, no-store`.

## Constraints that shape it (from search results, verify)

- The Cache API works only on a custom domain on a Cloudflare zone; it does nothing on `*.workers.dev`. Test on the real domain.
- The cache is **per data center** and is not replicated. `cache.delete` only clears the colo that ran it. A global clear needs Cloudflare's purge-by-URL API (zone-scoped, authenticated with an API token). Confirm endpoint, permission name, free-plan support and propagation time.
- `stale-while-revalidate` is not available through `cache.put`; a miss simply re-renders.
- Cloudflare may also offer a newer "Workers Cache" feature configured in Wrangler with tags and `ctx.cache.purge()`; if it exists and is free, prefer it over manual purge (R-03d).

## Server entry wrapper (`src/worker.ts`, UNVERIFIED)

```ts
// Wraps Start's default fetch handler. Shape depends on R-01 / R-03a.
import startHandler from '@tanstack/react-start/server-entry'; // UNVERIFIED default export shape

const CACHEABLE = [/^\/$/, /^\/all-projects$/, /^\/projects\/[^/]+$/, /^\/blog(\/[^/]+)?$/, /^\/sitemap\.xml$/, /^\/robots\.txt$/];
const EDGE_TTL = 60 * 60 * 24;           // seconds; purge makes freshness independent of TTL

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const url = new URL(request.url);
    const cacheable =
      request.method === 'GET' &&
      CACHEABLE.some((r) => r.test(url.pathname)) &&
      !request.headers.get('cookie')?.includes('better-auth'); // never serve a logged-in admin a cached copy, never cache theirs (cookie name: R-05)

    if (!cacheable) return startHandler.fetch(request, env, ctx);

    const key = new Request(url.origin + url.pathname, { method: 'GET' }); // drop query + cookies from the key
    const cache = caches.default;
    const hit = await cache.match(key);
    if (hit) return withBrowserHeaders(hit, 'HIT');

    const res = await startHandler.fetch(request, env, ctx);
    if (res.status === 200 && res.headers.get('content-type')?.includes('text/html')) {
      const toStore = new Response(res.clone().body, res);
      toStore.headers.set('Cache-Control', `public, s-maxage=${EDGE_TTL}`);
      toStore.headers.delete('set-cookie');
      ctx.waitUntil(cache.put(key, toStore));
    }
    return withBrowserHeaders(res, 'MISS');
  },
};

function withBrowserHeaders(res: Response, state: 'HIT' | 'MISS') {
  const r = new Response(res.body, res);
  r.headers.set('Cache-Control', 'public, max-age=0, must-revalidate'); // browsers always revalidate; only the edge holds copies
  r.headers.set('x-edge-cache', state);
  return r;
}
```

Notes:
- Responses that set cookies must never be stored. Public pages should not set cookies at all (assert in tests).
- `/assets/*` (hashed JS/CSS/fonts) are served by the static-assets layer, not by this wrapper; they carry `Cache-Control: public, max-age=31536000, immutable`.
- The wrapper must expose the Worker `env` and `ctx` to Start (R-02) so server functions can purge.

## Purge (`src/server/cache.ts`, UNVERIFIED)

```ts
export async function purgePublic(paths: string[], origin: string) {
  const urls = paths.map((p) => origin + p);
  // 1. local colo
  await Promise.all(urls.map((u) => caches.default.delete(new Request(u))));
  // 2. global: zone purge by URL  (R-03c: endpoint, token permission "Cache Purge", batch limit)
  const env = getEnv();
  await fetch(`https://api.cloudflare.com/client/v4/zones/${env.CF_ZONE_ID}/purge_cache`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.CF_API_TOKEN_PURGE}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ files: urls }),
  });
  // 3. optional warm-up so the first visitor does not pay for the render
  // ctx.waitUntil(Promise.all(urls.map((u) => fetch(u))));
}
```

Paths to purge per change:

| Change | Paths |
| --- | --- |
| Create, update, reorder, enable/disable, delete project | `/`, `/all-projects`, `/projects/<id>`, `/sitemap.xml` |
| Image replaced | the same, plus the old media URL is immutable so no purge is needed |
| Blog content (a code change) | deploy; also purge `/blog` and `/blog/<slug>` |
| Mail (contact) | nothing, mail is admin-only |

If the purge API call fails, the admin save still succeeds, shows a warning toast `Saved. Live site refresh pending`, and the TTL (24 h) is the safety net; log the failure.

## Cache-correctness rules

1. HTML must be identical for every visitor: no per-user content, no server-side time, no theme-dependent markup, no request-specific nonces. The live clock and theme are client-only.
2. The cache key ignores query strings (marketing params must not fragment it). Routes that use search params for state must opt out.
3. Never cache non-200 responses, redirects, or responses with `Set-Cookie`.
4. 404 for unknown project ids is rendered but not cached (or cached with a short TTL) so a project created later appears at once.
5. `Vary` headers must not be introduced by compression or content negotiation; confirm in the spike.

## Data loading inside the cached routes

- Route `loader` calls a server function that runs one Drizzle query against D1 (`getPublicProjects()`), executed only on a cache miss.
- The `/` loader returns featured + the next two projects; `/all-projects` returns all enabled projects ordered by `displayIndex desc`.
- No TanStack Query on the public routes.

## Fallbacks if the edge cache cannot be made to work

1. Short TTL (60 s) plus purge by URL only (no local delete).
2. Versioned keys: a `content_version` integer in D1, read through a very cheap `SELECT` per request (one D1 read per visit, still tiny against the 5 M/day free allowance) and appended to the cache key.
3. Rebuild on publish with Start's static prerender (R-14): slower updates, simplest runtime.

## Verification

```
curl -sI https://<domain>/ | grep -i x-edge-cache       # MISS then HIT
# edit a project in /admin, save
curl -sI https://<domain>/ | grep -i x-edge-cache       # MISS (purged), then HIT with new content
wrangler tail                                            # D1 queries only on MISS
```
Also test from a second region (a different colo) after a purge; see R-03c for propagation.
