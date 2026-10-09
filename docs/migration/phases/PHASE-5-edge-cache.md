# Phase 5: Edge cache and purge

## Goal
Public pages are served from the Workers Cache API with no D1 reads on a hit; every admin-relevant write purges the right URLs globally, so edits are live immediately.

## Depends on
Phases 1 and 4. Needs a **custom domain on a Cloudflare zone** for real testing (ask the owner; R-21).

## Read first
`../05-rendering-and-cache.md`, `../02-target-architecture.md` (server entry), `../00-agent-protocol.md`.

## Pending research to resolve first
**R-03 (a to d)** is the whole phase. Resolve with a spike before building: custom server entry shape, Cache API behaviour, purge-by-URL endpoint and token permission, propagation, and whether a newer Workers Cache feature should be used instead. **R-14** if the approach fails. **R-02** (env and ctx access). Record resolutions in `11-pending-research.md` and update `05`.

## Steps
1. - [ ] Spike on the custom domain (owner approval for DNS/route changes): a minimal Worker that `put`s and `match`es a response; purge by URL through the API with a scoped token; fetch from two different networks or regions (for example a VPN or a second machine) to confirm propagation time. Write the numbers into R-03.
2. - [ ] Create `src/worker.ts` wrapping Start's handler per `05`; point `wrangler.jsonc` `main` at it. Pass `env`/`ctx` to Start so server functions can use them (R-02).
3. - [ ] Implement the cacheable matcher, key normalisation, 200-only and no-cookie rules, `x-edge-cache: HIT|MISS|BYPASS` header, browser headers (`max-age=0, must-revalidate`), and `private, no-store` for admin/api/login paths.
4. - [ ] Implement `src/server/cache.ts` `purgePublic(paths)` (local delete + zone purge), with timeouts, a result object `{ local: boolean, global: boolean }`, and logging of failures. Token and zone id from env (`CF_API_TOKEN_PURGE`, `CF_ZONE_ID`).
5. - [ ] Add `purgeForProject(id)` mapping per the table in `05`; export a server function `refreshLiveSite()` (admin only) that purges all public URLs; wire to Phase 7 later.
6. - [ ] Ensure public HTML has no per-request variance: no `Set-Cookie`, no server time, no nonce. Add a test that fetches `/` twice and compares bodies.
7. - [ ] 404 handling: unknown `/projects/<id>` renders 404 but is **not** stored (or stored with `s-maxage=30`).
8. - [ ] Add `/api/health` (uncached JSON) for deploy checks.
9. - [ ] Document operations in `05`: how to purge manually (`wrangler` or curl), how to disable the cache (env flag `EDGE_CACHE=off` that forces BYPASS).
10. - [ ] If R-03 shows the approach cannot meet "instant", implement fallback 1 or 2 from `05` and note it in Deviations.

## Files
Created: `src/worker.ts`, `src/server/cache.ts`, `src/routes/api.health.ts`, tests. Changed: `wrangler.jsonc` (`main`, vars), `.dev.vars.example`, `05-rendering-and-cache.md` (resolved facts).

## Acceptance criteria
- On the custom domain: first request `x-edge-cache: MISS`, second `HIT`; `wrangler tail` shows D1 queries only on MISS.
- After calling `purgePublic(['/'])`, the next request from the same and from a different network returns fresh content within the propagation time recorded in R-03 (target: seconds).
- Admin/API/login responses are never cached (`BYPASS`, `no-store`).
- A request carrying the admin session cookie is never served from or written to the cache.
- Responses with `Set-Cookie` or non-200 status are never stored.
- With `EDGE_CACHE=off` the site works identically (BYPASS).
- Typecheck, lint, build pass.

## Verification
```
curl -sI https://<domain>/ | grep -i x-edge-cache    # MISS then HIT
# trigger refreshLiveSite or purgePublic; repeat from another network
wrangler tail --format pretty                         # confirm D1 only on MISS
```

## Out of scope
Admin UI, cache warming beyond the optional snippet, image transformations.

## Rollback
Point `main` back to Start's default server entry; the site works uncached.

## Deviations
(none yet)

## Handoff
(template in `00-agent-protocol.md`)
