# Portfolio migration: Next.js to TanStack Start on Cloudflare Workers

Status: **plan only. No application code has been changed.** Written 2026-10-09.

This folder is the complete brief for migrating `portfolio-v2` and applying the new design. It is written for coding agents that pick up one phase at a time, with no memory of the planning conversation. Read this file, then `00-agent-protocol.md`, then the phase you were assigned.

## What changes

| Layer | Today | Target |
| --- | --- | --- |
| Framework | Next.js 15.5 App Router, React 19 | TanStack Start 1.x (Router, Vite 7+), React 19 |
| Hosting | Vercel | Cloudflare Workers (free plan) via `@cloudflare/vite-plugin` and `wrangler` |
| Database | Turso (libSQL) | Cloudflare D1, Drizzle `drizzle-orm/d1` |
| Auth | Lucia 3 + `@node-rs/argon2` | Better Auth (Drizzle adapter, scrypt) |
| Uploads | UploadThing (`utfs.io`) | Cloudflare R2 through a Worker binding |
| Cache | Upstash Redis, one key | Workers Cache API (edge HTML) + purge-by-URL on every admin write |
| Motion | framer-motion `Reveal` on ~40 elements | CSS-first Reveal (curtain, rise, draw), one tiny observer script |
| Design | shadcn neutral, hover-only actions | New design system (teal accent, bento skills, always-visible actions) |
| Admin | One tabbed page with placeholder chrome | Routed admin: overview, projects table and form, inbox |

Decisions already made by the owner (do not re-litigate):

- Breaking changes are acceptable. No compatibility layers. Data is migrated later (Phase 9).
- Stay on the **Workers free plan**. Password hashing must therefore be scrypt (Better Auth default), never argon2.
- **Instant updates** through the Workers cache, not rebuild-on-publish.
- Auth model: one admin only. Public signup is deleted.
- The owner uses the same Better Auth and scrypt setup in another Workers project that works on the free plan.

## How to use this folder

1. `00-agent-protocol.md`: rules every agent follows (branching, commits, checks, what is off limits).
2. `01-current-state.md`: what exists today, file by file, with a migration map and known defects.
3. `02-target-architecture.md`: stack, versions, repo layout, config files, bindings.
4. Topic specs, read the ones your phase lists:
   - `03-design-system.md` and `design/`: tokens, section specs, screenshots, runnable HTML sources
   - `04-reveal-system.md`: the Reveal component, with full source
   - `05-rendering-and-cache.md`: SSR, edge cache, purge
   - `06-data-d1.md`, `07-auth-better-auth.md`, `08-media-r2.md`
   - `09-admin-panel.md`
   - `10-data-migration.md`
5. `11-pending-research.md`: **every fact that could not be verified when this plan was written.** Each has an ID (R-01 ...). Phases tell you which IDs to resolve before you write dependent code.
6. `phases/`: ten phase files, each self-contained with steps, files, acceptance criteria and verification commands. Start at `phases/README.md`.

## Pending research convention

Anything unverified is marked inline as:

> **PENDING RESEARCH R-xx**: what is unknown, and the fallback.

Before implementing a step that carries such a marker, resolve it: read the current official docs, or run the spike described in `11-pending-research.md`, then write the answer into the "Resolution" column of that file and adjust the step. Do not guess APIs from memory. Code in these docs marked `// UNVERIFIED` is intent, not a drop-in.

The planning sandbox could not open `tanstack.com` or `developers.cloudflare.com`, so Start and Cloudflare specifics came from search summaries and npm metadata. Treat them as hypotheses.

## Where the design lives

- Screenshots: `design/screens/` (PNG renders of the final designs, taken from the HTML sources).
- Runnable design sources: `design/source/*.html` (open in a browser; they reference `public/icons` and `design/assets/fonts`).
- Tokens: `design/tokens.css`, `design/tokens.json`.
- Copy and data: `design/copy.md`.
- The original interactive canvas is a private Claude design artifact: https://claude.ai/artifact/EeBeCctDZRyFt5SmiTKGat (boards H0 to H5). The HTML sources in this repo are the durable copy.

## Branches

- This plan: `docs/tanstack-start-migration-plan`.
- Implementation branch (created in Phase 0): `migrate/tanstack-start`. Phases commit to it in order.
