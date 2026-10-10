# Phase 1: Data layer (D1 + Drizzle)

## Goal
Replace libSQL/Turso with D1: schema, migrations, `getDb()`, the query module and typed server functions for public reads, so later phases build on a tested data layer. Local D1 only.

## Depends on
Phase 0.

## Read first
`../06-data-d1.md`, `../01-current-state.md` (data model, server actions), `../02-target-architecture.md`.

## Pending research to resolve first
- **R-06** Drizzle + D1 config, batch, FK enforcement, local state. **R-02** (from Phase 0). **R-18** version compatibility (`drizzle-zod` 0.5 with the installed Drizzle). Record resolutions.

## Steps
1. - [ ] Copy `legacy/db/schema.ts` to `src/db/schema.ts` and apply the changes in `06-data-d1.md`: `images.r2Key`, indexes, `mail.readAt/archivedAt`, remove `users`, `sessions`, `siteConfig`. Keep `ProjectSchema`, `MailSchema` and exported types.
2. - [ ] Add `drizzle.config.ts` for D1; scripts `db:generate`, `db:migrate:local`, `db:migrate:remote`.
3. - [ ] `bun run db:generate` to create `drizzle/0000_*.sql`. Open the SQL and check it matches the schema and indexes.
4. - [ ] `wrangler d1 create portfolio-db` (owner approval for remote; for local dev the binding can use a placeholder id) and set `migrations_dir: "drizzle"` in `wrangler.jsonc`. `bun run db:migrate:local`.
5. - [ ] Implement `src/server/db.ts` (`getDb()` per call) and `src/server/env.ts` using the R-02 mechanism. No module-level db anywhere.
6. - [ ] Implement `src/server/queries/projects.ts`, `mails.ts`, `images.ts` with the functions in `06-data-d1.md`. Use `crypto.randomUUID()` for ids. Use `db.batch` for `reorderProjects` and delete-with-image.
7. - [ ] Implement public server functions (no auth): `getPublicProjects`, `getPublicProject(id)`, `createContactMail` (validates the public contact schema). Admin server functions are Phase 7; leave stubs out.
8. - [ ] Seed script `scripts/seed-dev.ts` that inserts 3 sample projects (matching the `[Project name]` placeholders in the design plus real-looking tags) and 2 sample images into the **local** D1 only. Refuse to run against remote.
9. - [ ] Tests: add Vitest (or the project's choice) with the Workers pool or a script-based harness (R-06) covering each query function: create/list/update/reorder/delete project, public filtering by `enabled`, mail read/archive/delete, unread count.
10. - [ ] Confirm nothing imports `@libsql/client`, `drizzle-orm/libsql`, `dotenv`, or Lucia helpers.

## Files
Created: `src/db/schema.ts`, `drizzle.config.ts`, `drizzle/*.sql`, `src/server/{db,env}.ts`, `src/server/queries/*`, `src/server/fns/projects.ts`, `src/server/fns/contact.ts`, `scripts/seed-dev.ts`, tests. Changed: `wrangler.jsonc`, `package.json`. Deleted: none (legacy parked).

## Acceptance criteria
- `bun run db:migrate:local` on an empty local D1 succeeds; `wrangler d1 execute portfolio-db --local --command ".tables"` shows `project`, `image`, `mail` (auth tables arrive in Phase 2).
- All query tests pass; `reorderProjects` is atomic (assert by forcing a failure mid-batch if the harness allows, else document).
- `getPublicProjects` returns only enabled rows ordered by `displayIndex desc`.
- `grep -R "libsql\|dotenv\|lucia" src` is empty.
- Typecheck, lint, build pass.

## Verification
```
bun run db:generate && bun run db:migrate:local
bun run seed:dev            # local only
bun run test
wrangler d1 execute portfolio-db --local --command "select count(*) from project"
```

## Out of scope
Auth tables, admin functions, cache purge, real data import.

## Rollback
Delete `drizzle/` and regenerate; local state is under `.wrangler/state` (safe to remove).

## Deviations
- **Test package renamed**: Cloudflare renamed `@cloudflare/vitest-pool-workers` to `@cloudflare/vitest-plugin` (v1, Aug 2026). Installed `vitest` 4.1 + `@cloudflare/vitest-plugin` 1.4. Config in `vitest.config.ts`; migrations are applied in `test/apply-migrations.ts` from the real `drizzle/` folder.
- **File naming** follows `12-start-best-practices.md`: server-only helpers are `*.server.ts` (`env.server.ts`, `db.server.ts`, `queries/*.server.ts`); server function wrappers are `*.functions.ts` under `src/server/fns/`. Validators use `.inputValidator(...)`.
- **`createDb(d1)`** lives in `src/db/index.ts` (pure, testable); `getDb()` in `src/server/db.server.ts` reads the binding per call.
- **Zod schemas split from tables**: tables in `src/db/schema.ts`; `ProjectSchema`/`MailSchema` in `src/db/validation.ts` (drizzle-zod); the public `ContactSchema` is plain zod in `src/lib/schemas.ts` so the public bundle stays free of drizzle.
- **No raw SQL**: `mail.sentAt` uses `$defaultFn(() => new Date().toISOString())` instead of a `CURRENT_TIMESTAMP` SQL default, so `sentAt`, `readAt` and `archivedAt` are all ISO 8601. Phase 9 must normalise old Turso `sentAt` values (`YYYY-MM-DD HH:MM:SS`) to ISO. Counts use `db.$count`.
- `getPublicProject` does not join `image` (the project row already has `imgUrl`).
- `deleteProject` returns the R2 key to delete (or null) from one atomic `db.batch`.
- The seed script uses `getPlatformProxy` from wrangler, which only reaches local state; it refuses `--remote`.
- `auth-schema.ts` is not in `drizzle.config.ts` yet (Phase 2).

## Handoff

### Handoff (2026-10-10, Claude)
Done: `src/db/{schema,validation,index}.ts`, `drizzle.config.ts`, `drizzle/0000_*.sql` (reviewed: matches the schema and both indexes), query modules for projects/mails/images, public server functions (`fetchPublicProjects`, `fetchPublicProject`, `sendContactMail`), `scripts/seed-dev.ts`, the Vitest harness with 10 tests, and scripts `db:generate`, `db:migrate:local`, `db:migrate:remote`, `seed:dev`, `test`.
Verified by running: `bun run db:migrate:local` on an empty local D1 (tables `image`, `mail`, `project`). `bun run test` 10/10: CRUD, public filtering and order, search/filter/pagination, reorder, batch atomicity (a failing statement rolls back earlier ones), image foreign key enforced, delete returns or keeps the R2 key, mail read/archive/unread/delete/pagination. `bun run seed:dev`. A temporary index loader calling `fetchPublicProjects` rendered the 3 seeded projects via SSR on the production build under `vite preview` (temporary code removed). `grep` of `dist/client` found no `cloudflare:workers` or drizzle strings, so `verbatimModuleSyntax: true` does not leak in this build. Typecheck, lint and build pass; no libsql/dotenv/lucia in `src`.
Not verified / could not run: `sendContactMail` over HTTP (no UI yet; its query is tested); `db:migrate:remote` and any remote D1; `drizzle-kit studio`.
Deviations from spec: see Deviations.
Pending research resolved: R-06, R-18.
Next agent should watch out for: wrangler loads the untracked root `.env` (legacy Turso/UploadThing/Upstash secrets) into local dev bindings ("Using secrets defined in .env"). Harmless locally, but set `CLOUDFLARE_LOAD_DEV_VARS_FROM_DOT_ENV=false` or move the file before adding Phase 2 secrets. Re-run `bun run cf-typegen` after any `wrangler.jsonc` change.
