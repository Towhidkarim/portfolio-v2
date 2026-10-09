# Auth: Better Auth on D1

Replaces Lucia 3 and `@node-rs/argon2`. One admin account; no public signup.

> **PENDING RESEARCH R-02, R-04, R-05.** Better Auth's API names below come from search summaries; read the current docs (Installation, Drizzle adapter, TanStack Start integration, Email & Password, Rate limit, Cookies, Admin plugin) before coding. Mark deviations in the phase file.

## Facts to rely on (verify in R-05)

- No built-in D1 adapter: use the Drizzle adapter with `provider: 'sqlite'`.
- On Workers, D1 exists only inside a request, so **create the auth instance per request** from `env.DB`.
- TanStack Start needs Better Auth's Start cookie plugin, **last** in `plugins`, or `signInEmail` will not set cookies. Name and path may be `tanstackStartCookies` from `better-auth/tanstack-start` (renamed from `reactStartCookies` in v1.4.14); match the installed version.
- Passwords hash with scrypt by default. Custom `emailAndPassword.password.hash` and `verify` are supported if needed.
- `emailAndPassword.disableSignUp: true` disables public registration. How it interacts with admin-created users is unconfirmed: the plan avoids the question by seeding the admin with SQL.
- Latest `better-auth` on the registry on 2026-10-09: 1.7.7.

## Files

| File | Purpose |
| --- | --- |
| `src/server/auth.ts` | `createAuth(env)`: the configured Better Auth instance |
| `src/server/session.ts` | `getSession()`, `requireAdmin()` helpers used by loaders and server functions |
| `src/lib/auth-client.ts` | `createAuthClient()` for the browser (login, logout) |
| `src/routes/api.auth.$.ts` | catch-all server route that forwards to `auth.handler` |
| `src/db/auth-schema.ts` | generated tables |
| `scripts/seed-admin.ts` | prints SQL that creates the admin user and credential account |
| `src/routes/login.tsx` | login form |
| `src/routes/admin.tsx` | `beforeLoad` guard |

## Configuration (UNVERIFIED sketch)

```ts
// src/server/auth.ts
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { tanstackStartCookies } from 'better-auth/tanstack-start'; // R-05b
import * as authSchema from '@/db/auth-schema';
import { getDb } from './db';
import { getEnv } from './env';

export function createAuth() {
  const env = getEnv();
  return betterAuth({
    baseURL: env.BETTER_AUTH_URL,
    secret: env.BETTER_AUTH_SECRET,
    trustedOrigins: [env.BETTER_AUTH_URL],
    database: drizzleAdapter(getDb(), { provider: 'sqlite', schema: authSchema }),
    emailAndPassword: { enabled: true, disableSignUp: true, minPasswordLength: 10 },
    user: { additionalFields: { role: { type: 'string', defaultValue: 'user', input: false } } },
    session: { expiresIn: 60 * 60 * 24 * 14, cookieCache: { enabled: true, maxAge: 300 } }, // R-05g
    rateLimit: { enabled: true, window: 60, max: 30, customRules: { '/sign-in/email': { window: 60, max: 5 } } }, // R-05f
    advanced: { useSecureCookies: true },
    plugins: [tanstackStartCookies()], // keep last
  });
}
```

Role model: keep a plain `role` text column (`'user' | 'admin'`) on `user`. The Better Auth admin plugin is optional and not needed for one account (owner decision R-21).

## Session helpers

```ts
// src/server/session.ts (UNVERIFIED request-header access, R-02 / R-05h)
export async function getSession() {
  const headers = getRequestHeaders(); // from Start's server API
  return createAuth().api.getSession({ headers });
}
export async function requireAdmin() {
  const s = await getSession();
  if (!s || s.user.role !== 'admin') throw redirect({ to: '/login' });
  return s;
}
```

Every admin server function begins with `await requireAdmin()` (not just the route guard). The `/admin` route also guards in `beforeLoad` so unauthenticated visitors never receive admin code or data. The guard must run **on the server for the initial request** and on the client for navigations; verify both paths.

## Routes

- `api.auth.$.ts`: handles GET and POST by calling `createAuth().handler(request)`. Route API shape: R-05h.
- `login.tsx`: form with Email and Password (labels, 48 px fields, show/hide password), submit calls `authClient.signIn.email({ email, password })`. Errors: invalid credentials, rate limited (`Too many attempts. Try again in a minute.`), generic failure. On success redirect to `/admin` (or the `redirect` search param, validated to be a relative path). Not cached, `noindex`.
- Logout: a button in the admin shell calling `authClient.signOut()` then redirect to `/login`.

## Seeding the admin (no signup route exists)

`scripts/seed-admin.ts` (run with bun, no network):

1. Reads `ADMIN_EMAIL`, `ADMIN_NAME`, `ADMIN_PASSWORD` from the environment (never from argv, never logged).
2. Hashes the password with the **same function Better Auth uses** (`hashPassword` from Better Auth's crypto helpers, R-05, or the owner's copied scrypt code from their other Workers project, R-04) so verify succeeds.
3. Prints SQL: one `INSERT` into `user` (role `admin`, `emailVerified` as the schema requires) and one into `account` (`providerId = 'credential'`, `accountId = user id`, `password = hash`).
4. The operator pipes it to `wrangler d1 execute portfolio-db --local --file=...` or `--remote` (remote needs owner approval).

Because argon2 hashes cannot be converted, the owner's existing password is simply re-set through this script.

## Hashing on the free plan (R-04)

Workers free allows 10 ms CPU per request, with some tolerance. Better Auth's scrypt works on the owner's other free project, so the same parameters are expected to work here. Procedure in Phase 2:

1. Use the default scrypt first. Log in 20 times against `wrangler dev` and `wrangler tail`; note CPU time and any Error 1102 after deploying to a preview.
2. If it exceeds the budget: lower scrypt `N` through the `password.hash`/`verify` options (keep the stored cost parameters in the hash string so old hashes still verify), or switch to Web Crypto PBKDF2-SHA256 at the platform's iteration ceiling.
3. Record the final parameters in this file.

Protect the budget with Better Auth's rate limit on `/sign-in/email` (5 per minute per IP is the starting value).

## Removed code

`lib/auth.ts`, `app/(auth)/**`, `lucia`, `@lucia-auth/adapter-drizzle`, `@node-rs/argon2`, `generateIdFromEntropySize` (replace with `crypto.randomUUID()`), `serverExternalPackages` config.

## Acceptance checks

- Wrong password and unknown email show the same generic error; 6th attempt in a minute is blocked.
- `curl -i /admin` without a cookie redirects to `/login` on the server (no admin HTML).
- Cookie is `HttpOnly; Secure; SameSite=Lax` in production.
- After sign-out, the old cookie no longer authorises `/api` admin calls.
- No file imports `lucia` or argon2; `bun run build` succeeds for the Workers runtime.
- Direct call of any admin server function without a session returns an auth error, not data.
