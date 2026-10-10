# Phase 2: Auth (Better Auth)

## Goal
One admin can sign in and out on Workers free; all admin access is enforced on the server; no signup exists.

## Depends on
Phases 0 and 1.

## Read first
`../07-auth-better-auth.md`, `../06-data-d1.md`, `../00-agent-protocol.md` (hard prohibitions), `../03-design-system.md` (form fields, buttons).

## Pending research to resolve first
**R-04** scrypt CPU and parameters (get the owner's working hash/verify code from their other Workers project, or read it from their repo if shared), **R-05** (a to h), **R-02**. Record resolutions, including the final scrypt parameters.

## Steps
1. - [ ] `bun add better-auth` (pin). Read the Better Auth docs for the installed version (installation, Drizzle adapter, TanStack Start integration, email/password, rate limit, cookies).
2. - [ ] Create `src/server/auth.ts` per the sketch; fix names to match the installed version. Add `BETTER_AUTH_SECRET` and `BETTER_AUTH_URL` to `.dev.vars.example` and `wrangler.jsonc` `vars` (URL only; secret via `wrangler secret`).
3. - [ ] Generate the schema with the Better Auth CLI into `src/db/auth-schema.ts` (R-05d), add the `role` additional field, then `bun run db:generate` and migrate locally. Verify tables: `user`, `session`, `account`, `verification` (and any rate-limit table if the DB storage option is chosen).
4. - [ ] Implement the catch-all route `src/routes/api.auth.$.ts` and `src/lib/auth-client.ts`.
5. - [ ] Implement `src/server/session.ts` (`getSession`, `requireAdmin`).
6. - [ ] Implement `scripts/seed-admin.ts` (prints SQL; see doc). Seed the local admin with a test password from the environment. Never commit credentials.
7. - [ ] Build `src/routes/login.tsx` (design tokens, 48 px fields, labels, show/hide password, error and rate-limit messages, `noindex`). Redirect target validated as a relative path.
8. - [ ] Create a temporary protected route `/admin` (layout + `beforeLoad` guard + placeholder page with a sign-out button) so the guard can be tested; Phase 7 replaces its content.
9. - [ ] **Benchmark scrypt** (R-04): 20 sign-ins locally and, with owner approval, on a deployed preview with `wrangler tail`; record CPU time and any Error 1102. Tune per `07`.
10. - [ ] Enable and test rate limiting on sign-in.
11. - [ ] Remove nothing from `legacy/` yet; ensure nothing in `src/` imports Lucia or argon2.

## Files
Created: `src/server/{auth,session}.ts`, `src/lib/auth-client.ts`, `src/db/auth-schema.ts`, `src/routes/{login,api.auth.$,admin}.tsx|ts`, `scripts/seed-admin.ts`, a new migration in `drizzle/`. Changed: `wrangler.jsonc`, `.dev.vars.example`, `package.json`.

## Acceptance criteria
- Seeded admin signs in and out locally; cookie set with `HttpOnly`, `SameSite=Lax`, `Secure` in production config.
- `curl -i http://localhost:<port>/admin` with no cookie returns a redirect to `/login` from the server (no admin HTML in the body).
- Signing in with a wrong password and an unknown email shows the same message; the sixth attempt within a minute is rate limited.
- A user with `role != 'admin'` (insert one manually) cannot access `/admin` or admin server functions.
- No signup route or UI; `POST /api/auth/sign-up/email` is rejected.
- Scrypt cost documented in `07-auth-better-auth.md`; CPU numbers recorded in the handoff.
- Typecheck, lint, build pass.

## Verification
```
bun run db:migrate:local
ADMIN_EMAIL=test@example.com ADMIN_NAME=Test ADMIN_PASSWORD=... bun scripts/seed-admin.ts > /tmp/seed.sql   # do not commit
wrangler d1 execute portfolio-db --local --file=/tmp/seed.sql
curl -i localhost:<port>/admin
curl -i -X POST localhost:<port>/api/auth/sign-up/email -H 'content-type: application/json' -d '{"email":"x@x.com","password":"password123","name":"x"}'
```

## Out of scope
Admin UI beyond the guard and a placeholder, password reset by email, social login, 2FA.

## Rollback
Remove the auth migration and files; Phase 1 stands alone.

## Deviations
- **Role model = Better Auth admin plugin with access control** (owner decision, resolves part of R-21). `src/lib/permissions.ts` defines the statements (`admin`, `project`, `mail`, `media`, plus the plugin's `user`/`session`) and the `admin` and `user` roles; the same `ac`/`roles` go to the server `admin()` plugin and the client `adminClient()`. `requirePermission()` asks `auth.api.userHasPermission`, so permissions live in config, not in scattered `role === 'admin'` checks. Entering `/admin` needs `admin: ['access']`. The old plan's plain `role` column is replaced by the plugin's `role`, `banned`, `banReason`, `banExpires` columns.
- **Admins are created with a CLI, not a seed SQL script**: `bun run admin:create -- --email <e> --name <n> [--remote]`, `admin:set-password`, `admin:list` (`scripts/admin.ts`). The password comes from `ADMIN_PASSWORD` or a hidden prompt, never argv. The CLI hashes with `src/server/password.server.ts` (the function Better Auth uses at sign-in), builds SQL with `src/server/admin-sql.server.ts` (column names and encoding come from the Drizzle tables), and runs it with `wrangler d1 execute --local|--remote --file` (temp file deleted afterwards). `--remote` asks for typed confirmation. `set-password` also revokes the user's sessions. `scripts/seed-admin.ts` from the plan is not needed.
- **Schema split (owner request)**: `src/db/app-schema.ts` (hand-written), `src/db/auth-schema.ts` (generated, Biome-ignored), `src/db/schema.ts` (barrel). Regenerate auth tables with `bun run auth:generate` (Better Auth CLI pinned `auth@1.7.7`, config in `src/server/auth.schema.ts`) then `bun run db:generate`; the app schema file is never rewritten.
- **All dependencies moved to latest stable on 2026-10-10 (owner request)**, including majors: zod 4.6.5, drizzle-zod 0.8.3, @hookform/resolvers 5.9.1, lucide-react 1.55, sonner 2.0.8, tailwind-merge 3.7, react-dropzone 20.1, TypeScript 7.0.2 (native compiler), Vitest 5.0.3, @types/node 26, Biome 2.5.15 (`biome migrate` applied). Typecheck, 30 tests, build and an HTTP smoke test (sign-in, /admin) pass unchanged. Added `src/db/validation.test.ts` (ProjectSchema/ContactSchema) because zod and drizzle-zod both changed major. Drizzle stays on the stable `latest` tag; a 1.0 release candidate exists (see below).
- **drizzle-orm 0.41 -> 0.45.4, drizzle-kit 0.30 -> 0.31.11**: required by Better Auth 1.7.7's peer ranges (`^0.45.2`, `>=0.31.4`). No schema drift, all tests pass. Also installed `@better-auth/drizzle-adapter` 1.7.7 explicitly (it is what `better-auth/adapters/drizzle` re-exports).
- **No session cookie cache**: so a signed-out cookie stops working at once (verified by replaying the old cookie). Costs one D1 read per authenticated request, admin only.
- **Rate limit storage = database** (`rate_limit` table), because memory is per isolate on Workers.
- **`/admin` uses `ssr: 'data-only'`**: the guard runs on the server (unauthenticated requests get a 307 with an empty body) but the admin UI renders on the client, keeping SSR CPU off the free plan.
- **Root route sets `Cache-Control: private, no-store`** as the default for every document; public routes will opt in (Phase 5). Auth API responses also send `private, no-store`.
- Secrets live in `.dev.vars` (gitignored, created locally with a random `BETTER_AUTH_SECRET`); `BETTER_AUTH_URL` is a `.dev.vars` value locally and becomes a `wrangler.jsonc` var at deploy. With `.dev.vars` present wrangler no longer loads the legacy root `.env`.
- Login page styling is functional only (plain Tailwind); Phase 3 restyles it with the design tokens.

## Handoff

### Handoff (2026-10-10, Claude)
Done: Better Auth 1.7.7 on D1 with the admin plugin and access control, per-request `getAuth()`, catch-all `/api/auth/$`, `session.server.ts` (`getSession`, `hasPermission`, `requirePermission`, `requireAdmin`), `requires(permissions)` / `adminOnly` function middleware (`src/server/middleware/auth.middleware.ts`), `/login` (labels, 48 px fields, show/hide, generic error, rate-limit message, `noindex`, validated relative redirect), `/admin` guard layout plus placeholder page with sign-out, the admin CLI, the generated auth schema and migration `0001`, and 7 auth tests.
Verified by running (dev server and production build under `vite preview`, curl with a cookie jar): `/admin` without a cookie returns 307 to `/login?redirect=%2Fadmin` with an empty body; sign-up returns 400 `EMAIL_PASSWORD_SIGN_UP_DISABLED`; sign-in sets `better-auth.session_token` as `HttpOnly; SameSite=Lax; Path=/` (no `Secure` because the local URL is http; it is on automatically for an https `BETTER_AUTH_URL`); signed-in `/admin` is 200 and signed-in `/login` redirects to `/admin`; after sign-out the old cookie gets 307 on `/admin` and `null` from get-session; a user whose role is changed to `user` is redirected away from `/admin` immediately; wrong password and unknown email return the identical 401 `INVALID_EMAIL_OR_PASSWORD`; the 4th attempt after earlier ones within a minute (6th request in the window) returns 429. `bun run test` 17/17 (10 data + 7 auth: CLI SQL -> sign-in parity, same error for wrong/unknown, duplicate email refused, set-password revokes sessions, sign-up disabled, permission matrix, scrypt shape). Typecheck, lint, check, build pass; no lucia/argon2/libsql/dotenv in src. Worker entry 700 kB (144 kB gzip); no server code in the client bundle (the only `BETTER_AUTH_SECRET` hit in `auth-client-*.js` is Better Auth's own env-name reader, not a value).
Not verified / could not run: scrypt CPU time on a deployed free-plan Worker (R-04). Locally under workerd the wall time is about 80 ms per hash and per verify, but it is native `node:crypto` scrypt on a separate thread, so wall time is not the CPU billed. Needs a deployed Worker and `wrangler tail` (owner approval). The login form was exercised by HTTP only, not in a real browser. `admin:create --remote` was not run (no remote D1). Admin server functions do not exist yet, so the middleware is tested through the permission matrix, not an HTTP call.
Deviations from spec: see Deviations.
Pending research resolved: R-05 (all of a to h), R-02; R-04 partly (parameters known, CPU unmeasured); R-21 (admin plugin chosen).
Next agent should watch out for: attach `requires({...})` from `src/server/middleware/auth.middleware.ts` to EVERY admin `createServerFn` and admin server route; the `/admin` guard is UX only. `userHasPermission` takes only `'admin' | 'user'` roles in its types, so `session.server.ts` maps unknown roles to `user`. After editing `src/lib/permissions.ts` or auth options that change tables, run `bun run auth:generate`, then `bun run db:generate`, then `bun run db:migrate:local`. `src/db/auth-schema.ts` is generated: do not hand-edit it. The first real admin must be created with `bun run admin:create` (local) before the panel can be used; do it again with `--remote` after the first deploy (owner confirmation).
