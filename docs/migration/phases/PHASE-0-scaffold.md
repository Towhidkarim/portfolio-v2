# Phase 0: Scaffold, park legacy, spikes

## Goal
Create the implementation branch, move the Next.js code out of the way (still readable), scaffold TanStack Start on the Cloudflare Vite plugin, wire the standard scripts, and prove three risky things work end to end in the smallest possible form: a deployed hello route, a server function reading a D1 binding, and an R2 put.

## Depends on
Nothing. Plan docs must be on `master` (or the plan branch merged) so the branch has them.

## Read first
`../README.md`, `../00-agent-protocol.md`, `../01-current-state.md`, `../02-target-architecture.md`, `../11-pending-research.md` (R-01, R-02, R-09, R-17).

## Pending research to resolve first
- **R-01** scaffold layout and config shapes. **R-02** how to access bindings. **R-09** Tailwind 3 / shadcn / React Compiler under Vite. Record resolutions in `11-pending-research.md`.

## Steps
1. - [ ] `git checkout master && git pull`, ensure `docs/migration` exists there, then `git checkout -b migrate/tanstack-start`.
2. - [ ] Create a scratch scaffold **outside the repo** (for example `/tmp/scaffold`): `bun create cloudflare@latest scaffold --framework=tanstack-start` (or the current official command, R-01). Read what it generates: `package.json`, `vite.config.ts`, `wrangler.jsonc`, `tsconfig.json`, `src/**`, entry files, scripts. Note Node and Vite versions it requires.
3. - [ ] Park the old app: `git mv app legacy/app`, `git mv components legacy/components`, `git mv lib legacy/lib`, `git mv db legacy/db`, `git mv env.ts uploadthing.ts types legacy/`, plus `next.config.ts`, `components.json` stays at root. Keep `public/`, `docs/`, `bun.lock`, `package.json`, `tailwind.config.ts`, `postcss.config.mjs`, `tsconfig.json` for now. Add `legacy` to `tsconfig` `exclude`, ESLint ignores, Tailwind `content` exclusion (except a temporary extra glob so copied components keep working while porting), and `.prettierignore`.
4. - [ ] Replace `package.json` dependencies per `02-target-architecture.md` (remove list there). Keep: React 19, Radix packages and shadcn helpers (`class-variance-authority`, `clsx`, `tailwind-merge`, `tailwindcss-animate`), `lucide-react@^0.399`, `sonner@^1`, `react-hook-form`, `@hookform/resolvers`, `zod@^3`, `drizzle-orm`, `drizzle-zod`, `react-dropzone`, `@tanstack/react-query`. Add: `@tanstack/react-start`, `@tanstack/react-router`, `vite`, `@vitejs/plugin-react`, `@cloudflare/vite-plugin`, `wrangler`, `better-auth` (Phase 2 may add later), `@fontsource/poppins`, `@fontsource/jetbrains-mono`. Pin exact versions; run `bun install`.
5. - [ ] Bring the scaffold's config into the repo root (`vite.config.ts`, `wrangler.jsonc`, entry files, router) adapting names to `portfolio`. Add `.dev.vars.example` (names from `00-agent-protocol.md`, no values), `.gitignore` entries: `.dev.vars`, `.wrangler`, `dist`, `worker-configuration.d.ts` only if generated (otherwise commit it).
6. - [ ] Add scripts exactly as listed in `02-target-architecture.md` ("Commands"). ESLint: flat config with `typescript-eslint` and `eslint-plugin-react-hooks`; no Next plugin.
7. - [ ] Make `bun run dev` serve a placeholder index route ("migration in progress") through the Workers runtime; `bun run build` and `bun run typecheck` pass.
8. - [ ] **Spike A (deploy):** `bun run deploy` to a `workers.dev` preview name (owner approval for the first remote deploy). Confirm the page loads. Do not rely on the Cache API there.
9. - [ ] **Spike B (D1 binding):** `wrangler d1 create portfolio-db --local` (local only), add the `DB` binding, create a server function `ping()` that runs `select 1` through `env.DB` and returns it. Call it from the index loader. Works in `bun run dev` and `wrangler dev`. Record the access pattern for R-02.
10. - [ ] **Spike C (R2 binding):** add `MEDIA` binding, a dev route that `put`s a small object and `get`s it back. Delete the spike routes afterwards (or keep under `src/routes/_spikes` excluded from production build).
11. - [ ] Decide package manager (bun vs the scaffold's); record in R-17.
12. - [ ] Write the findings into `11-pending-research.md` (R-01, R-02, R-09 at least) and fix any paths in `02-target-architecture.md`.

## Files
Created: `vite.config.ts`, `wrangler.jsonc`, `src/**` scaffold, `.dev.vars.example`, ESLint config, `legacy/**` (moved). Changed: `package.json`, `tsconfig.json`, `.gitignore`. Deleted: nothing permanently (legacy is parked).

## Acceptance criteria
- `bun run typecheck`, `bun run lint`, `bun run build` pass with `legacy/` excluded.
- `bun run dev` runs on the Workers runtime; the index route renders; the `ping()` server function returns a value from the local D1; the R2 spike round-trips an object locally.
- A preview deploy responds on `workers.dev` (or the owner confirms deploy is deferred).
- `legacy/` contains every moved file and nothing imports from it in `src/`.
- R-01, R-02, R-09 have resolutions (or `unresolved` with the fallback used).

## Verification
```
bun install --frozen-lockfile
bun run typecheck && bun run lint && bun run build
bun run dev   # curl http://localhost:<port>/ ; call the ping server function
wrangler d1 execute portfolio-db --local --command "select 1"
```

## Out of scope
Design, real routes, auth, any production data.

## Rollback
`git checkout master`; the branch is disposable.

## Deviations
- **Biome replaces ESLint and Prettier** (owner request). `biome.json`: spaces, 2-wide, single quotes, trailing commas, `noUnknownAtRules` off (Tailwind 3 `@tailwind`). `.prettierrc` and `prettier*` deps removed, so Tailwind class sorting is gone for now. Step 6 (ESLint flat config) is not done.
- **Scaffold command**: `bunx @tanstack/cli create` with `--blank --deployment cloudflare --toolchain biome` (the tool `create-cloudflare` delegates to). Alias is `@/*` only; the scaffold's `#/*` import map was dropped.
- **Spike A (remote deploy) skipped**: owner wants everything local until deploy time. Do it with the Phase 8 deploy.
- Spike B/C code was removed after verification (nothing to keep under `src/routes/_spikes`). `src/server/env.ts` (`getEnv()`) is kept.
- **Tailwind 4 instead of 3** (owner request, after the scaffold): `tailwindcss` + `@tailwindcss/vite` 4.3.3, `tw-animate-css`; `tailwind.config.ts`, `postcss.config.mjs`, `tailwindcss-animate`, `postcss` removed; `globals.css` is `@import 'tailwindcss'`. Biome `css.parser.tailwindDirectives` on. Tokens and the colour mapping go in `@theme` (Phase 3). The legacy shadcn components are v3-style and get regenerated or restyled in Phase 3/4.
- Not installed yet: `better-auth` (Phase 2), `vitest` (Phase 1), React Compiler (Phase 3).
- `drizzle.config.ts` moved to `legacy/`; Phase 1 writes a D1 one. `.env` (Turso, UploadThing, Upstash secrets) stays untracked at the root for Phase 9.
- `wrangler.jsonc` carries a placeholder `database_id` (all zeros) that works for local only. Replace via `wrangler d1 create` at deploy.

## Handoff

### Handoff (2026-10-10, Claude)
Done: branch `migrate/tanstack-start` (from the plan branch); legacy parked in `legacy/`; Start + Cloudflare Vite plugin + Biome scaffold with exact pins; bindings `DB` (D1) and `MEDIA` (R2) in `wrangler.jsonc`; `worker-configuration.d.ts` generated; placeholder index route.
Verified by running: `bun run typecheck`, `bun run lint`, `bun run build` pass. Index loader calling D1 `select 1` and an R2 put/get/delete returned `{"d1":1,"r2":"hello r2"}` under `vite dev` and under `vite build` + `vite preview`. `wrangler d1 execute portfolio-db --local` works.
Not verified / could not run: remote deploy (Spike A); `wrangler dev` proper (used `vite preview`); the Cache API.
Deviations from spec: see Deviations.
Pending research resolved: R-01, R-02, R-09 (partly), R-17 (package manager only).
Next agent should watch out for: `bun run dev` generates `src/routeTree.gen.ts`, so run it (or `vite build`) before `typecheck` on a fresh clone. Docs mention `eslint`/Prettier in a few places: Biome is the tool. The scaffold uses `shellComponent` in the root route and `getRouter` in `router.tsx`.
