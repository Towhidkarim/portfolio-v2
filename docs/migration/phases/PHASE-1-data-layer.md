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
(none yet)

## Handoff
(template in `00-agent-protocol.md`)
