# Phase 6: Media on R2

## Goal
Authenticated image upload and deletion backed by R2, with public serving from a custom media domain and a reusable `ImageDropzone`.

## Depends on
Phase 2 (auth). Can run in parallel with Phase 4.

## Read first
`../08-media-r2.md`, `../06-data-d1.md` (images table), `../07-auth-better-auth.md` (`requireAdmin`).

## Pending research to resolve first
**R-08** (binding API, free-plan body limit, public bucket + custom domain, CORS), **R-05h** (route API shape), **R-21** (media domain name).

## Steps
1. - [ ] Add the `MEDIA` binding and `PUBLIC_MEDIA_BASE_URL` var to `wrangler.jsonc`; `wrangler r2 bucket create portfolio-media` (owner approval for remote); connect the custom domain in the dashboard (owner does this; document exact steps found in R-08).
2. - [ ] `src/server/media.ts`: `validateImage(file)` (MIME allow-list, 4 MB cap, magic-byte sniff), `keyFor(mime)`, `putImage(file)`, `deleteObject(key)`.
3. - [ ] `src/routes/api.admin.upload.ts` per `08`: auth, validation, put, `insertImage`, JSON response, uniform error shape.
4. - [ ] `deleteImageIfUnused` wired into server functions `deleteUpload(id)` (used by the dropzone when a fresh upload is discarded) and into project delete/replace flows (Phase 7 calls it).
5. - [ ] Dev-only `src/routes/api.media.$.ts` serving from the local R2 simulation; guarded so it returns 404 in production.
6. - [ ] `src/components/admin/image-dropzone.tsx` per `08` with all states, progress, preview, remove, keyboard support, `role="alert"` errors. Storybook-like demo section in the `/_styleguide` route (Phase 3) behind admin only, or a temporary `/admin/_upload-demo` page.
7. - [ ] Tests: validation unit tests (accepts png/jpeg/webp/avif/gif; rejects svg, oversize, mismatched magic bytes, missing file); route test (401 without session; 201 with); cleanup test.
8. - [ ] Document the final custom-domain steps and limits in `08` and mark R-08 resolved.

## Files
Created: `src/server/media.ts`, `src/routes/api.admin.upload.ts`, `src/routes/api.media.$.ts`, `src/components/admin/image-dropzone.tsx`, `src/server/fns/uploads.ts`, tests. Changed: `wrangler.jsonc`, `.dev.vars.example`.

## Acceptance criteria
- Upload of a 3.9 MB PNG succeeds locally and the returned URL serves the image; the object has the immutable cache header in production config.
- 4.1 MB file, SVG, renamed `.txt` and an unauthenticated request are rejected with clear messages and write nothing (verify with `wrangler r2 object list --local` or the dev route).
- Removing an unsaved upload deletes its object and row; replacing a project image (simulated through the server function) deletes the old object when unreferenced.
- Dropzone is fully keyboard operable and announces errors.
- No R2 key derives from user-supplied file names.
- Typecheck, lint, build pass.

## Verification
```
bun run dev
curl -i -F file=@sample.png localhost:<port>/api/admin/upload                    # 401
# sign in, then upload through the UI and via curl with the session cookie
bun run test
wrangler r2 object get portfolio-media/<key> --local
```

## Out of scope
Image transformations (R-15), migrating old images (Phase 9), admin screens that use the dropzone (Phase 7).

## Rollback
Remove the route and binding; no data depends on it until Phase 7.

## Deviations
(none yet)

## Handoff
(template in `00-agent-protocol.md`)
