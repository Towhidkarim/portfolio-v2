# Data migration: Turso + UploadThing to D1 + R2

Runs in Phase 9, when the new app works against empty local resources. The owner will do or approve the remote steps. Nothing here may touch production Turso, UploadThing, D1 or R2 without explicit approval in the task.

> **PENDING RESEARCH R-07** (Turso dump command, D1 import details) and **R-08** (R2 put limits). Everything below is a plan, not tested.

## What moves

| Source | Target | Action |
| --- | --- | --- |
| Turso `project` rows | D1 `project` | copy; `imgUrl` rewritten to the R2 URL |
| Turso `image` rows | D1 `image` | copy; `customID` becomes `r2Key`; `fileUrl` rewritten |
| Turso `mail` rows | D1 `mail` | copy; `readAt`/`archivedAt` null (new) |
| Turso `user`, `session` | none | dropped; admin re-seeded (`07`) |
| Turso `config` | none | dropped |
| UploadThing files on `utfs.io` | R2 `projects/<uuid>.<ext>` | download and upload, rewrite URLs |

## Order of operations

1. **Freeze.** Pick a quiet time; tell nobody else is editing in the old admin. (The old site keeps serving.)
2. **Apply the new schema** to an empty D1 (`bun run db:migrate:remote`, approved by the owner). Seed the admin (`scripts/seed-admin.ts`).
3. **Export Turso.** Dump the database to SQL, for example `turso db shell <db> .dump > turso-dump.sql` (R-07), or write a small script using the old `@libsql/client` to select each table to JSON. Keep the dump out of git.
4. **Transform.** `scripts/migrate-data.ts` reads the export and produces `d1-import.sql` containing only `INSERT`s for `image`, `project`, `mail`, with:
   - no `BEGIN TRANSACTION`/`COMMIT`, no `_cf_KV`;
   - `image` rows first (projects reference them);
   - `customID` mapped to a temporary `r2Key` equal to the planned new key;
   - `fileUrl`/`imgUrl` pointing at `PUBLIC_MEDIA_BASE_URL/<r2Key>`.
5. **Copy files.** `scripts/migrate-images.ts`: for every old `image` row, `fetch(fileUrl)` from `utfs.io`, check `content-type` and size, upload to R2 under the planned key (S3-compatible API with `aws4fetch` from the script, or `wrangler r2 object put --remote`), record success. Idempotent: skip keys that already exist. Fail loudly on any non-200.
6. **Import SQL.** `wrangler d1 execute portfolio-db --remote --file=d1-import.sql` (limit 5 GiB; this is tiny).
7. **Verify.**
   - Row counts per table equal the source (`select count(*)` both sides).
   - Every `project.imgUrl` returns 200 with an image content type.
   - Open `/`, `/all-projects` and every `/projects/<id>`; compare with the old site.
   - Admin login works; inbox shows all old messages.
8. **Purge the edge cache** (`Refresh live site` in admin) and re-check.
9. **Cut over DNS** to the Worker (R-17). Keep Turso, the UploadThing account and the Vercel project untouched for **7 days** as a fallback, then delete them with the owner's go-ahead.

## Script requirements

- Scripts live in `scripts/`, run with `bun`, read credentials from the environment, never print secrets, support `--dry-run` (default) and `--apply`.
- They must be re-runnable. Log a summary table (rows read, written, skipped, failed).
- They are deleted (or moved to `docs/migration/archive/`) after cut-over.

## Rollback

Until DNS is switched nothing user-facing changed: abandon the D1/R2 resources. After the switch, point DNS back to Vercel (the old stack is intact for 7 days). New contact messages received on the new stack after cut-over must be exported and re-imported if you roll back; note this in the cut-over message to the owner.
