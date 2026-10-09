# Phase 9: Data migration, cut-over and cleanup

## Goal
Move the real data and images into D1 and R2, switch production to the Worker, keep a fallback for a week, then remove the legacy code and services.

## Depends on
Phase 8. **Every remote step needs the owner's explicit go-ahead in the task.**

## Read first
`../10-data-migration.md`, `../06-data-d1.md`, `../08-media-r2.md`, `../phases/PHASE-8-hardening-ship.md` runbook.

## Pending research to resolve first
**R-07** (Turso dump and D1 import specifics), **R-08** (R2 upload limits for the script), **R-17** (DNS cut-over).

## Steps
1. - [ ] Dry-run everything against **local** D1 and R2 first: `scripts/migrate-data.ts --dry-run` and `scripts/migrate-images.ts --dry-run` produce a report (counts, sizes, planned keys, any broken image URL).
2. - [ ] Owner exports or grants read access to Turso and shares nothing secret in the repo. Take a dump (R-07). Store it outside git.
3. - [ ] Rehearse the full import on a **scratch D1** and a **scratch R2 bucket** (create `portfolio-db-staging`, `portfolio-media-staging` with owner approval): run schema migration, seed admin, run both scripts with `--apply`, verify per `10`. Fix issues. Record durations.
4. - [ ] Production run (owner present): migrate schema to the production D1, seed the production admin, run `migrate-images.ts --apply`, run `migrate-data.ts --apply`, then verification checklist from `10`.
5. - [ ] Purge the edge cache (`refreshLiveSite`), walk through every public page and the admin.
6. - [ ] Switch DNS / routes to the Worker. Keep Vercel, Turso, UploadThing and Upstash running read-only for 7 days. Announce the date to the owner.
7. - [ ] Post-cut-over monitoring for 7 days: `wrangler tail` samples, error rates, contact form deliveries, D1 daily usage vs free limits.
8. - [ ] After the owner approves the end of the fallback window: delete the legacy code (`git rm -r legacy`), remove leftover dependencies and scripts, archive or delete migration scripts, delete the Turso database, UploadThing app, Upstash database and Vercel project (each requires owner confirmation, one at a time).
9. - [ ] Final docs pass: update `README.md` at the repo root (stack, commands, deploy), mark `docs/migration` as historical or move the runbook to `docs/RUNBOOK.md`, close R-xx items, tag the release.

## Files
Created: `scripts/migrate-data.ts`, `scripts/migrate-images.ts` (removed in step 8 or archived). Deleted at the end: `legacy/**`, obsolete scripts and dependencies.

## Acceptance criteria
- Row counts match source for `project`, `image`, `mail`; every project image URL returns 200 from the media domain; every project page renders.
- The owner can sign in with the seeded admin and edit a project; the public page updates immediately.
- Old Vercel site still reachable under a fallback URL during the window; rollback rehearsed.
- After cleanup: `grep -R "lucia\|uploadthing\|libsql\|upstash\|next/" --include=*.ts --include=*.tsx --include=package.json .` finds nothing outside `docs/`.
- Production secrets rotated if any were shared during the migration.

## Verification
```
bun scripts/migrate-data.ts --dry-run
bun scripts/migrate-images.ts --dry-run
wrangler d1 execute portfolio-db --remote --command "select (select count(*) from project) p, (select count(*) from image) i, (select count(*) from mail) m"
curl -sI https://media.<domain>/<key> | head -1
```

## Out of scope
New features.

## Rollback
Before DNS switch: delete scratch/production D1 and R2 contents and retry. After: repoint DNS to Vercel (kept for 7 days); export any new contact messages received since cut-over and re-import them if you roll back.

## Deviations
(none yet)

## Handoff
(template in `00-agent-protocol.md`)
