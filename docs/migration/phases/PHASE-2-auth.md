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
(none yet)

## Handoff
(template in `00-agent-protocol.md`)
