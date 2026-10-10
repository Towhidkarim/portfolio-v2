# Agent protocol

Every agent working on this migration follows these rules.

## Orientation

0. Before writing Start code, read `12-start-best-practices.md` and the version-matched skill files in `node_modules/@tanstack/*/skills/**/SKILL.md` (start-core, server-functions, middleware, execution-model). Note: use `.inputValidator`, not the `.validator` those files show.

1. Read `README.md`, this file, then your phase file in `phases/`.
2. Read every spec the phase lists under "Read first". Do not skim the pending-research markers.
3. Check `phases/README.md` for the status table. Do not start a phase whose dependencies are not marked done.

## Branching and commits

- Implementation happens on `migrate/tanstack-start` (created in Phase 0 from the plan branch's parent, `master`, after merging the plan docs). One commit per logical step; never mix phases in one commit.
- Commit message format: `phase-N: short imperative summary`, body lists files and decisions. End with the session trailer your harness provides.
- Do not open a pull request unless the owner asks. Do not push to any other branch.
- Never rewrite history on a shared branch.

## Definition of done for a phase

A phase is done only when all of these hold:

1. Every acceptance criterion in the phase file is met and demonstrated by the verification commands.
2. `bun run typecheck`, `bun run lint` and `bun run build` pass (see "Commands" in `02-target-architecture.md`). Phase 0 defines these scripts.
3. New or changed behaviour was run for real (`wrangler dev`, with local D1 and R2), not only compiled. Say so in your handoff note, and say plainly what you could not run.
4. Pending-research items the phase depends on have a written resolution in `11-pending-research.md`.
5. The phase row in `phases/README.md` is updated (status, date, branch commit, notes), and any deviation from the spec is written in the phase file under "Deviations".

## Style

- Match the surrounding code: comment density, naming, idiom. TypeScript strict. No `any` without a comment.
- **Versions policy (owner decision, 2026-10-10): this is a migration, so use the latest stable release of every package** (the registry `latest` dist-tag), pinned exactly. Do not hold a package back to an old major to match the legacy app. Run `bun outdated` at the start of each phase and upgrade before writing code that depends on the package; if an upgrade breaks something, fix the code, and only pin back with a written reason in the phase file. Prereleases (rc, beta) need the owner's approval; approved so far: **Drizzle 1.0 release candidate** (`drizzle-orm` and `drizzle-kit` 1.0.0-rc.4, owner request 2026-10-10). Currently on: Tailwind 4, zod 4, TypeScript 7, Vitest 5, lucide-react 1.x, sonner 2, tailwind-merge 3, @hookform/resolvers 5, drizzle-zod 0.8, react-dropzone 20, Biome 2.5.
- No emoji in UI or code. Icons are lucide or inline SVG.
- UI follows `03-design-system.md` exactly: tokens, spacing, copy. Do not invent new colours.
- Accessibility is a requirement, not polish: real buttons and links, labels on inputs, visible focus, AA contrast, reduced motion respected.

## Hard prohibitions

- Do not add or keep: `lucia`, `@lucia-auth/adapter-drizzle`, `@node-rs/argon2`, `uploadthing`, `@uploadthing/react`, `@libsql/client`, `@upstash/redis`, `next*`, `@t3-oss/env-nextjs`, `dotenv` (in runtime code).
- Do not hash passwords with argon2 on Workers. Do not add a paid-plan dependency.
- Do not read bindings at module scope. D1, R2 and secrets exist only inside a request.
- Do not put secrets in the repo. `.dev.vars` is gitignored; production secrets go through `wrangler secret put`.
- Do not delete `legacy/` before Phase 9 sign-off.
- Do not run destructive commands against the production Turso, D1 or R2 resources without the owner's explicit confirmation in the task. Local D1 and R2 (`--local`) are fine.
- Do not skip, disable or loosen a failing check to get green.

## Working with pending research

- Resolve it first, record the result in `11-pending-research.md`, then code.
- If the docs you need are unreachable from your sandbox, say so in your handoff, implement the safest fallback named in the marker, and leave the marker in place with a note.
- If reality contradicts a spec, trust reality, fix the spec in the same commit, and list it under "Deviations".

## Handoff note template

Paste this at the end of the phase file you worked on:

```
### Handoff (date, agent)
Done: ...
Verified by running: ...
Not verified / could not run: ...
Deviations from spec: ...
Pending research resolved: R-xx ...
Next agent should watch out for: ...
```

## Secrets and environment

| Name | Where | Used for |
| --- | --- | --- |
| `BETTER_AUTH_SECRET` | `.dev.vars`, `wrangler secret` | session signing (name: PENDING RESEARCH R-05) |
| `BETTER_AUTH_URL` | `.dev.vars`, `vars` | base URL (name: PENDING RESEARCH R-05) |
| `CF_API_TOKEN_PURGE` | `.dev.vars`, `wrangler secret` | cache purge by URL |
| `CF_ZONE_ID` | `vars` | cache purge |
| `TURNSTILE_SECRET` | `wrangler secret` | contact form |
| `PUBLIC_MEDIA_BASE_URL` | `vars` | R2 public URL, for example `https://media.example.com` |

Bindings (not secrets): `DB` (D1), `MEDIA` (R2). Details in `02-target-architecture.md`.
