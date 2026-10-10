# Phases

Ten phases, each self-contained. Read `../00-agent-protocol.md` first. Phases run in dependency order; independent phases may run in parallel only if they touch different files (noted below).

## Status

Update this table in the same commit that finishes a phase.

| # | Phase | Depends on | Estimate | Status | Finished | Commit | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 0 | Scaffold, park legacy, spikes | none | 0.5 day | done (Spike A deferred to Phase 8 by owner) | 2026-10-10 | see git log `phase-0:` | Biome instead of ESLint/Prettier; local D1/R2 only |
| 1 | Data layer: D1 + Drizzle | 0 | 1 day | done | 2026-10-10 | see git log `phase-1:` | 10 query tests pass on Miniflare D1; local only |
| 2 | Auth: Better Auth | 0, 1 | 1 day | done (scrypt CPU unmeasured until a deploy) | 2026-10-10 | see git log `phase-2:` | admin plugin + access control; admins via `bun run admin:create` |
| 3 | Design foundation + Reveal | 0 | 1.5 days | done | 2026-10-10 | see git log `phase-3:` | `/styleguide`; 32/32 reveal checks, axe 0 violations, Lighthouse a11y 100 |
| 4 | Public site | 1, 3 | 2 days | not started | | | |
| 5 | Edge cache + purge | 1, 4 | 1 day | not started | | | |
| 6 | Media: R2 | 2 | 0.75 day | not started | | | |
| 7 | Admin panel | 2, 5, 6 | 2 days | not started | | | |
| 8 | Hardening and ship | 4, 5, 7 | 1 day | not started | | | |
| 9 | Data migration, cut-over, cleanup | 8 | 1 day | not started | | | |

Estimates are planning guesses for one developer. Total about 11 days including spikes, hardening and migration; the core port is 8 to 9.

## Dependency graph

```
0 ─┬─ 1 ─┬─ 2 ─┬─ 6 ─┐
   │     │     │     ├─ 7 ─┐
   │     └─ 4 ─┴─ 5 ──────┘    8 ── 9
   └─ 3 ─┘
```

Parallel-safe pairs: **1 and 3** (data layer vs design foundation), **2 and 3**, **6 and 4**. Do not run 4 and 5 in parallel (both change the public routes and the server entry).

## Common phase file layout

Goal, Depends on, Read first, Pending research to resolve first, Steps (checklist), Files created / changed / deleted, Acceptance criteria, Verification commands, Out of scope, Rollback, Deviations, Handoff.

## Files

- [Phase 0](PHASE-0-scaffold.md)
- [Phase 1](PHASE-1-data-layer.md)
- [Phase 2](PHASE-2-auth.md)
- [Phase 3](PHASE-3-design-foundation.md)
- [Phase 4](PHASE-4-public-site.md)
- [Phase 5](PHASE-5-edge-cache.md)
- [Phase 6](PHASE-6-media-r2.md)
- [Phase 7](PHASE-7-admin.md)
- [Phase 8](PHASE-8-hardening-ship.md)
- [Phase 9](PHASE-9-migration-cutover.md)
