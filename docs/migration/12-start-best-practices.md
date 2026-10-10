# TanStack Start + Cloudflare: verified practices and plan corrections

Researched 2026-10-10 from the skill files that ship inside the installed packages (`node_modules/@tanstack/*/skills/**/SKILL.md`, version-matched, read these before writing Start code), the Cloudflare docs MCP, and a local spike. Where this file disagrees with an older phase file, **this file wins**.

## 1. What gets cached: the rendered HTML, not JSON

The cache stores the **complete SSR response** (HTML document, with the loader data already embedded as a dehydrated payload for hydration). There is no "fetch JSON then rebuild the page" step.

```
visitor -> edge cache HIT  -> HTML bytes straight back (Worker does not run, no D1, no render, no CPU)
        -> edge cache MISS -> Worker: Start SSR -> loader -> server fn -> one Drizzle query -> HTML -> stored + returned
browser -> parses HTML (first paint), loads hashed JS/CSS from static assets, hydrates from the embedded payload (no refetch)
```

Why not cache JSON: the Worker would still run and server-render on every visit (free plan CPU cap is 10 ms), and the HTML would still be built per request. Caching the finished document is what makes the landing page near-instant.

Three layers, each cached by the layer that suits it:

| Layer | Served from | Caching |
| --- | --- | --- |
| HTML (`/`, `/all-projects`, `/projects/$id`, blog, sitemap) | Workers Caching at the edge | `Cache-Control: public, max-age=..., stale-while-revalidate=...` + `Cache-Tag`; purge by tag on admin writes |
| JS, CSS, fonts, `public/` files | Workers Static Assets (CDN) | hashed names, `immutable`, 1 year |
| Project images | R2 behind a custom domain (CDN) | immutable keys (content hash in the key), 1 year |

## 2. Workers Caching replaces the manual Cache API plan (resolves R-03 a, c, d)

Cloudflare now has **Workers Caching** (docs: `developers.cloudflare.com/workers/cache/`), separate from `caches.default`:

- Enable with `"cache": { "enabled": true }` in `wrangler.jsonc` (Wrangler >= 4.69; `cross_version_cache` needs >= 4.107; we have 4.149).
- Cloudflare checks the cache **before running the Worker**; on a hit the Worker does not run and no CPU time is billed. Request collapsing (one render for a burst of misses), tiered cache, `stale-while-revalidate`, and RFC 9111 `Cache-Control` all work.
- Purge globally from code: `import { cache } from 'cloudflare:workers'; await cache.purge({ tags: ['projects'] })` (also `pathPrefixes`, `purgeEverything`, and `cache.invalidate()` to mark stale). No API token, no zone id, no custom server-entry wrapper. Uses Free-tier purge rate limits.
- The cache belongs to the Worker, not a zone: it is documented to work on `workers.dev`, and is shared across hostnames.
- Key = path + query + Worker version (+ `ctx.props`). **Cookies and `Authorization` are not in the key**, but requests carrying `Authorization` and responses with `Set-Cookie` or `Cache-Control: private` bypass the cache. Public pages must not set cookies. Admin/login/api responses must send `Cache-Control: private, no-store`.
- The **Worker version is in the key by default**, so every deploy starts cold. That is the safe behaviour: stale cached HTML can never reference JS/CSS chunk hashes that a deploy deleted. Do **not** enable `cross_version_cache`. (The older Cache API plan with a 24 h TTL would have had exactly that stale-chunk bug.)
- Only GET/HEAD are cached; 206 and 520-526 never.

Open items (resolve in the Phase 5 spike **on a deployed Worker**):

1. **Is Workers Caching available on the free plan?** The docs do not say. Fallback: the old `caches.default` approach in `05-rendering-and-cache.md`.
2. **Billing quirk:** with caching enabled, *every* request to the Worker, including static asset requests that are normally free, counts against the free plan's 100k requests/day. A page with ~15 asset requests means roughly 6,000 visits/day before the cap. Probably fine for a portfolio; check the number and consider `exports.default.cache` tuning or serving media from R2's own domain (R2 public traffic is not a Worker request).
3. Local dev **does not simulate it**. Spiked: with `cache.enabled` under `vite dev`, no `Cf-Cache-Status` appears and every request re-renders; and `cache.purge` from `cloudflare:workers` is `not a function` locally. So the purge helper must feature-detect (`typeof cache?.purge === 'function'`) and no-op in dev, and cache behaviour is only verifiable after a deploy (first deploy moves earlier than Phase 8).
4. Whether the SSR response header can be set per route: use a global request middleware in `src/start.ts` (sets `Cache-Control` and `Cache-Tag` by pathname after `next()`), or per-route `headers`. Verify the exact API in the Phase 5 spike.
5. Client-side navigations call server functions, not the HTML. Keep loaders cheap: set a generous `staleTime` on public routes, and consider GET server functions with the same `Cache-Control`/`Cache-Tag` so they cache too.

## 3. Landing page speed checklist (SSR + CDN)

- Cached HTML from the nearest edge (above) is the main win. Keep the document small: render above-the-fold sections server-side, no client-only first paint.
- Fonts: self-hosted Poppins/JetBrains Mono woff2 via `@fontsource`, subset to latin, `font-display: swap`, `<link rel="preload" as="font" crossorigin>` for only the weights used above the fold, `size-adjust` fallback to avoid layout shift.
- CSS: one Tailwind 4 stylesheet (small after purge); inline nothing large. Reveal is CSS-first with one tiny script (see `04-reveal-system.md`); no framer-motion on the public bundle.
- JS: route-level code splitting is automatic; keep admin, react-query, react-hook-form, dropzone, Radix dialogs out of public routes. Check the public entry chunk size in Phase 8.
- Images: R2 behind a custom domain, `width`/`height` always set, `loading="lazy"` below the fold, first project image `fetchpriority="high"` only if it is above the fold, modern formats where possible.
- Cloudflare features that cost nothing: HTTP/3, Brotli, and Early Hints (zone setting) apply on a custom domain.
- Measure with Lighthouse on the deployed custom domain, not on `localhost`.

## 4. Start API facts to code against (installed: Start 1.168.60, Router 1.170.41)

- **Server function validation is `.inputValidator(...)`, not `.validator(...)`.** The shipped skills and Cloudflare's Start guide still show `.validator`, but the installed types only expose `inputValidator`. Pass a zod schema directly (zod 3.25 implements Standard Schema).
- Everything is isomorphic by default; **loaders run on server and client**. DB/R2/secrets live only inside `createServerFn` handlers (or server routes/middleware). Never self-fetch `/api/...` from a loader.
- Bindings: `import { env, cache } from 'cloudflare:workers'` inside handlers (R-02). Keep the project rule of not reading bindings or secrets at module scope.
- File layout: `*.functions.ts` for `createServerFn` wrappers (safe to import anywhere), `*.server.ts` for server-only helpers (import-protected by the build). Use `*.server.ts` for `db`, `auth`, `cache`, `media`, `env` helpers; keep shared zod schemas in a client-safe file.
- **Auth is enforced on the endpoint, not the route.** `beforeLoad` redirects are UX only. Every admin server function and every admin server route gets an `authMiddleware` (`createMiddleware({ type: 'function' })` or a route `server.middleware`) that calls Better Auth's `getSession` with the request headers and throws if absent. Test by calling the endpoint with no cookie. Never trust `sendContext` from the client as an identity.
- `useServerFn(fn)` is required when the function throws `redirect()` or `notFound()`.
- After a mutation: `await router.invalidate({ sync: true })` on the client; on the server, purge the cache tags inside the same handler after the D1 write succeeds.
- Head: the `head()` route option (`meta`, `links`, `scripts`) with `<HeadContent />`/`<Scripts />`; per-route `og:` tags from `loaderData`. Pre-hydration inline scripts (theme, `js` class, Reveal observer) use `ScriptOnce` or a head `scripts` entry; put `suppressHydrationWarning` on `<html>` (resolves R-10, R-11, partly R-16).
- Sitemap/robots: server routes `sitemap[.]xml.ts`, `robots[.]txt.ts` with `server.handlers.GET`.
- Selective SSR: use `ssr: false` (or `'data-only'`) on `/admin/**` so the free plan's 10 ms CPU is not spent server-rendering the admin UI; public routes stay `ssr: true`. Children can only be more restrictive than parents. Default can be set in `src/start.ts` with `createStart(() => ({ defaultSsr }))`.
- Global middleware lives in `src/start.ts` (`createStart`), the Next `middleware.ts` equivalent.
- Custom server entry, only if ever needed (queues, cron): `src/server.ts` with `createServerEntry({ fetch(request) { return handler.fetch(request) } })` from `@tanstack/react-start/server-entry`, then point `wrangler.jsonc` `main` at it. The context object is the second argument to `handler.fetch`, not Worker `env`/`ctx`. With Workers Caching the wrapper from `05-rendering-and-cache.md` is not needed.
- Router defaults from the scaffold set `defaultPreloadStaleTime: 0` (meant for TanStack Query). Public routes do not use Query: raise `staleTime` instead and keep intent preloading.
- Skills warn against `verbatimModuleSyntax` ("server bundles leak into client"), yet the official scaffold enables it. We kept it. **Phase 1 check:** once a real server function imports `cloudflare:workers`/Drizzle, grep `dist/client` for those strings; if they leak, turn the flag off.

## 5. Plan changes this implies

- Phase 5 becomes: enable `cache`, set headers + tags in middleware, purge by tag in server functions, verify on a deployed Worker. Needs an early first deploy (workers.dev is enough per the docs, confirm). `CF_API_TOKEN_PURGE`, `CF_ZONE_ID` and `src/worker.ts` are only needed on the fallback path.
- Phase 2: add the `authMiddleware` pattern above; Phase 7 attaches it to every admin function and the upload route.
- Phase 3: head/theme/Reveal scripts use `ScriptOnce`/head `scripts`; Tailwind 4 `@theme`.
- Phase 1: use `.inputValidator`, `*.server.ts`/`*.functions.ts` naming, and the `verbatimModuleSyntax` check.
