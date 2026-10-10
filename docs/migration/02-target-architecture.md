# Target architecture

## Stack and versions

Registry versions checked on 2026-10-09. Pin exact versions in `package.json` once Phase 0 installs them. Policy: latest stable of everything, exact pins (see `00-agent-protocol.md`).

| Package | Version (2026-10-09) | Note |
| --- | --- | --- |
| `@tanstack/react-start` | 1.168.60 | requires Vite >= 7, Node >= 22.12 |
| `@tanstack/react-router` | 1.170.41 | pulled in by Start; keep versions in step |
| `@tanstack/react-query` | 5.x (repo has ^5.51) | admin only |
| `vite` | 8.3.4 (installed) | Start scaffold pins ^8 |
| `@cloudflare/vite-plugin` | 1.63.1 | peer: wrangler ^4.149 |
| `wrangler` | 4.149.0 | |
| `@cloudflare/workers-types` | latest (or `wrangler types`) | prefer generated `worker-configuration.d.ts` |
| `better-auth` | 1.7.7 | |
| `drizzle-orm` | repo ^0.41; registry 0.45.4 | upgrade only if D1 or Better Auth require it (R-06, R-18) |
| `drizzle-kit` | repo ^0.30; registry 0.31.11 | |
| `tailwindcss`, `@tailwindcss/vite` | 4.3.3 (installed) | CSS-first config (`@theme`), `tw-animate-css` replaces `tailwindcss-animate` |
| `react`, `react-dom` | 19.x | |
| `@vitejs/plugin-react` | version matching Vite | React Compiler via Babel plugin (R-09) |
| `@fontsource/poppins`, `@fontsource/jetbrains-mono` | 5.3.0 | self-hosted fonts |

Package manager: **bun** (existing `bun.lock`). Commands below use `bun`. If the scaffold or Cloudflare builds require another manager, note it in R-17.

Remove: `next`, `eslint-config-next`, `@t3-oss/env-nextjs`, `lucia`, `@lucia-auth/adapter-drizzle`, `@node-rs/argon2`, `uploadthing`, `@uploadthing/react`, `@libsql/client`, `postgres`, `@upstash/redis`, `dotenv`, `next-themes` (replaced, R-11), `framer-motion` from the public bundle (Phase 3), `react-type-animation`, `babel-plugin-react-compiler` only if the Vite route differs (R-09).

## Repository layout (intent)

> **PENDING RESEARCH R-01**: Start's scaffold decides the real layout (`src/routes`, `app.config`, entry files). Scaffold first (Phase 0) with Cloudflare's `create-cloudflare --framework=tanstack-start` in a temp directory, compare, and adapt this tree to the scaffold. The scaffold wins over this document.

```
.
├─ legacy/                      parked Next.js code (Phase 0), deleted in Phase 9
├─ docs/                        this plan
├─ drizzle/                     generated SQL migrations (D1)
├─ scripts/
│  ├─ seed-admin.ts             creates the single admin (Phase 2)
│  ├─ migrate-images.ts         Turso/UploadThing to R2 (Phase 9)
│  └─ check-bundle.ts           optional size guard
├─ public/                      icons, images, favicon, og image (unchanged files)
├─ src/
│  ├─ routes/
│  │  ├─ __root.tsx
│  │  ├─ index.tsx
│  │  ├─ all-projects.tsx
│  │  ├─ projects.$id.tsx
│  │  ├─ blog.index.tsx
│  │  ├─ blog.$slug.tsx
│  │  ├─ login.tsx
│  │  ├─ admin.tsx                       layout + beforeLoad guard
│  │  ├─ admin.index.tsx                 overview
│  │  ├─ admin.projects.index.tsx        table
│  │  ├─ admin.projects.new.tsx
│  │  ├─ admin.projects.$id.tsx
│  │  ├─ admin.inbox.tsx
│  │  ├─ api.auth.$.ts                   Better Auth handler
│  │  ├─ api.admin.upload.ts             R2 upload
│  │  ├─ sitemap[.]xml.ts, robots[.]txt.ts
│  ├─ server/
│  │  ├─ db.ts            getDb()
│  │  ├─ auth.ts          createAuth()
│  │  ├─ session.ts       requireAdmin(), getSession()
│  │  ├─ env.ts           zod-validated bindings
│  │  ├─ cache.ts         edge cache wrapper + purge
│  │  ├─ media.ts         R2 helpers
│  │  └─ fns/             createServerFn modules: projects.ts, mails.ts, contact.ts, uploads.ts
│  ├─ db/ schema.ts, auth-schema.ts
│  ├─ components/
│  │  ├─ ui/              shadcn primitives
│  │  ├─ reveal/          Reveal, init script, css
│  │  ├─ site/            nav, hero, proof, marquee, skills, projects, activity, education, about, contact, footer
│  │  └─ admin/           shell, project-form, projects-table, inbox, image-dropzone
│  ├─ content/            blogs.ts, skills.ts, site.ts (copy and data)
│  ├─ lib/                utils.ts, constants.ts, icons.ts
│  ├─ styles/             globals.css, tokens.css, reveal.css, motion.css
│  ├─ router.tsx, entry points per scaffold
│  └─ worker.ts           custom server entry that wraps Start with the edge cache (Phase 5)
├─ vite.config.ts, wrangler.jsonc, drizzle.config.ts (no tailwind/postcss config files: Tailwind 4)
├─ .dev.vars (gitignored), .dev.vars.example
└─ package.json, bun.lock, tsconfig.json
```

## Cloudflare configuration

### `wrangler.jsonc` (UNVERIFIED, shape from search results)

> **PENDING RESEARCH R-01, R-02, R-08**: confirm key names against the current Wrangler docs and the scaffold.

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "portfolio",
  "compatibility_date": "2026-10-01",            // set to the scaffold's date or later
  "compatibility_flags": ["nodejs_compat"],
  "main": "src/worker.ts",                         // Phase 5; until then "@tanstack/react-start/server-entry"
  "observability": { "enabled": true },
  "d1_databases": [
    { "binding": "DB", "database_name": "portfolio-db", "database_id": "<filled by wrangler d1 create>", "migrations_dir": "drizzle" }
  ],
  "r2_buckets": [
    { "binding": "MEDIA", "bucket_name": "portfolio-media" }
  ],
  "vars": {
    "PUBLIC_MEDIA_BASE_URL": "https://media.example.com",
    "BETTER_AUTH_URL": "https://example.com",
    "CF_ZONE_ID": "<zone id>"
  }
  // secrets: BETTER_AUTH_SECRET, CF_API_TOKEN_PURGE, TURNSTILE_SECRET via `wrangler secret put`
  // routes: custom domain on a Cloudflare zone (required for the Cache API, see 05)
}
```

### `vite.config.ts` (UNVERIFIED, from the official hosting guide as summarised by search)

The Cloudflare plugin is registered first with the `ssr` environment, then `tanstackStart()`, then the React plugin:

```ts
import { defineConfig } from 'vite';
import { cloudflare } from '@cloudflare/vite-plugin';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    cloudflare({ viteEnvironment: { name: 'ssr' } }),
    tanstackStart(),
    viteReact({ /* babel: { plugins: [['babel-plugin-react-compiler', {}]] } (R-09) */ }),
  ],
});
```

### Bindings access

> **PENDING RESEARCH R-02**: how server functions, server routes and loaders reach `env`. Candidates: `import { env } from 'cloudflare:workers'`, or the request context passed by the server entry. Decide once, then wrap in `src/server/env.ts` so no other file knows. Never read bindings at module scope.

Target shape every other module uses:

```ts
// src/server/env.ts (UNVERIFIED access mechanism)
import { env } from 'cloudflare:workers';
export const getEnv = () => env as Env; // Env generated by `wrangler types`
```

## Rendering model (summary; full spec in `05-rendering-and-cache.md`)

- Public routes (`/`, `/all-projects`, `/projects/$id`, `/blog*`, sitemap, robots) are server-rendered by the Worker, with HTML stored in the Workers Cache API on a custom domain.
- Saving an edit in the admin purges the affected URLs (local `cache.delete` plus the Cloudflare purge-by-URL API), so the next visit renders fresh HTML.
- `/admin/*`, `/login`, `/api/*` are never cached (`Cache-Control: private, no-store`).
- Static assets (JS, CSS, fonts, images in `public/`) are served by Workers static assets with immutable hashed filenames.

## Commands (defined in Phase 0)

```
bun run dev            vite dev (Workers runtime via the Cloudflare plugin)
bun run build          vite build
bun run preview        wrangler dev against the built output
bun run typecheck      tsc --noEmit
bun run lint           biome lint (owner chose Biome over ESLint + Prettier; spaces, 2-wide, single quotes)
bun run check          biome check (lint + format + import order)
bun run format         biome format --write
bun run deploy         build + wrangler deploy
bun run cf-typegen     wrangler types
bun run test           vitest (Phase 1 introduces it)
bun run seed:dev       insert sample data into LOCAL D1 only (Phase 1)
bun run db:generate    drizzle-kit generate
bun run db:migrate:local   wrangler d1 migrations apply portfolio-db --local
bun run db:migrate:remote  wrangler d1 migrations apply portfolio-db --remote
bun run auth:generate  better-auth CLI: regenerates src/db/auth-schema.ts (then db:generate, db:migrate:local)
bun run admin:create   create an admin (add --remote for the deployed DB); also admin:set-password, admin:list
```

## Non-goals

No new features beyond the design (blog, comments, analytics), no change to the `projects` data model beyond the additions in `06-data-d1.md`, no RSC (Start's RSC package is experimental).
