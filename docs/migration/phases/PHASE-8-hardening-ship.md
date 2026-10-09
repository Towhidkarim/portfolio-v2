# Phase 8: Hardening and ship

## Goal
Protect the public surface, verify performance and accessibility on the real deployment, set up deployment and the production domains, and leave the app ready for data migration.

## Depends on
Phases 4, 5 and 7.

## Read first
`../02-target-architecture.md`, `../05-rendering-and-cache.md`, `../07-auth-better-auth.md`, `../00-agent-protocol.md`.

## Pending research to resolve first
**R-12** (Turnstile, rate limiting on free), **R-17** (deploy/CI, domains), **R-19** (keep-alive route), **R-20** (bundle size limits), **R-21** (final domain names).

## Steps
1. - [ ] **Contact form protection:** Turnstile widget (explicit render, `Send message` disabled until a token exists), server-side verify in `createContactMail` with `TURNSTILE_SECRET`, honeypot field, per-IP throttle (Workers rate limit binding if available on free, else a small D1 counter table with a sliding window), message length caps, generic error copy. Add `TURNSTILE_SITE_KEY` as a public var.
2. - [ ] **Security headers** for HTML and API responses (set in `src/worker.ts`): `Content-Security-Policy` (self, the media domain for images, Turnstile origin, no inline scripts except the two hashed head scripts; use hashes or a nonce-free strategy compatible with caching), `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` minimal, `Strict-Transport-Security`. Verify the CSP does not break Turnstile, fonts, the inline scripts or Start hydration.
3. - [ ] **Dependency and secret audit:** `bun audit` (or equivalent), grep for leaked tokens, confirm `.dev.vars` is ignored, production secrets set with `wrangler secret put` (owner runs or approves).
4. - [ ] **Keep-alive:** delete `/api/revive` equivalents unless R-19 shows a need (then add a Cron Trigger through the custom server entry).
5. - [ ] **Bundle and limits:** run `wrangler deploy --dry-run`, record Worker size; confirm under the free-plan limit (R-20); if close, lazy-load the admin chunk and review heavy dependencies.
6. - [ ] **Deploy pipeline:** choose Workers Builds or GitHub Actions (R-17) with `bun install --frozen-lockfile`, typecheck, lint, test, build, `wrangler deploy`; production branch `main`/`master`, preview deploys for branches. Document env and secrets needed. Owner adds secrets.
7. - [ ] **Domains:** attach the production custom domain and the media domain; set `BETTER_AUTH_URL`, canonical, sitemap host, OG URLs; redirect `www` to apex or vice versa; confirm HTTPS and HSTS.
8. - [ ] **Observability:** enable Workers observability; add structured `console.log` for purge failures, auth failures (no PII), upload rejects.
9. - [ ] **Real-device QA:** Chrome, Safari, Firefox; iOS Safari and Android Chrome; light/dark; reduced motion; keyboard only; screen reader smoke test on home and admin login.
10. - [ ] **Lighthouse on production domain** (mobile and desktop) for `/`, `/projects/<id>`, `/blog`, `/login`; record results.
11. - [ ] **SEO checks:** sitemap and robots correct, canonical host, OG image renders in a link preview, structured data validates, Google verification meta still present.
12. - [ ] **Error pages:** 404 and 500 styled, no stack traces, `noindex` on error pages.
13. - [ ] Update `phases/README.md`, `11-pending-research.md`, and write a short `docs/migration/RUNBOOK.md`: deploy, rollback, purge cache, rotate secrets, seed/reset the admin password, add a project, restore from D1 backups (Time Travel / export commands per current docs).

## Files
Created: `docs/migration/RUNBOOK.md`, CI workflow (if GitHub Actions), Turnstile component, rate-limit helper. Changed: `src/worker.ts`, `wrangler.jsonc`, contact server function and form.

## Acceptance criteria
- Contact form rejects requests without a valid Turnstile token and throttles a flood (script sends 20 in a minute; at most the allowed number succeed).
- Security headers present on HTML; the site works fully under the CSP (no console violations on `/`, `/login`, `/admin`).
- Production Lighthouse (mobile): performance 90+, accessibility 95+, best practices 95+, SEO 100 on `/`.
- Deploy pipeline green from a clean checkout; rollback documented and tried once.
- Worker size and startup are within free-plan limits; numbers recorded.
- All `UNVERIFIED` markers in the docs are either resolved or listed in the handoff as still open.

## Verification
```
bun install --frozen-lockfile && bun run typecheck && bun run lint && bun run test && bun run build
wrangler deploy --dry-run
for i in $(seq 20); do curl -s -o /dev/null -w "%{http_code}\n" -X POST https://<domain>/_server/... ; done   # shape per R-12
curl -sI https://<domain>/ | grep -i -E "content-security|strict-transport|x-content-type|referrer"
npx lighthouse https://<domain>/ --preset=desktop
```

## Out of scope
New features, analytics, i18n.

## Rollback
Redeploy the previous version (`wrangler rollback` or the pipeline's previous run, documented in the runbook); DNS can point back to Vercel until Phase 9 is complete.

## Deviations
(none yet)

## Handoff
(template in `00-agent-protocol.md`)
