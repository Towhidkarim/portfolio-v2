# Media: Cloudflare R2

Replaces UploadThing. Images are uploaded through an authenticated Worker route into an R2 bucket (binding `MEDIA`) and served publicly from a custom domain.

> **PENDING RESEARCH R-08** (binding API, free-plan request body limit, public bucket and custom domain steps, CORS). **R-21**: the media domain name is an owner decision.

Free tier (R2 pricing, via search): 10 GB-month storage, 1 million write-class and 10 million read-class operations per month, free egress. Deletes are free.

## Setup (owner approval needed for remote steps)

```
wrangler r2 bucket create portfolio-media
# Dashboard: R2 > portfolio-media > Settings > Public access > Connect custom domain (e.g. media.<domain>)   (R-08)
```

Do **not** use the `r2.dev` URL in production (rate limited, dev only). `PUBLIC_MEDIA_BASE_URL` = `https://media.<domain>`.

## Upload route (`src/routes/api.admin.upload.ts`, route API per R-05h / R-01)

`POST multipart/form-data` with field `file`.

Steps, in order:

1. `await requireAdmin()` (401 JSON if not).
2. Parse `formData()`; require a `File`.
3. Validate: MIME in `image/png`, `image/jpeg`, `image/webp`, `image/avif`, `image/gif` (no SVG: script injection risk); size at most 4 MB (same cap as UploadThing had); sniff the first bytes (magic numbers) and reject mismatches.
4. Key: `projects/<crypto.randomUUID()>.<ext>` (ext from the validated MIME).
5. `await env.MEDIA.put(key, file.stream(), { httpMetadata: { contentType: file.type, cacheControl: 'public, max-age=31536000, immutable' }, customMetadata: { originalName: file.name } })`.
6. `insertImage(db, { id: randomUUID(), r2Key: key, fileName: file.name, fileSize: file.size, fileUrl: `${PUBLIC_MEDIA_BASE_URL}/${key}` })`.
7. Respond `201 { id, fileUrl, key }`. Errors: 400 with `{ error }` and a user-safe message; never leak internals.

Keys are content-immutable and unique, so no cache purge is needed when an image changes: the project points to a new URL (and the project page cache is purged by the project save).

## Delete and cleanup

- `deleteImageIfUnused(db, imageId)`: if no project references it, delete the row and `await env.MEDIA.delete(r2Key)` (free operation).
- Called when a project is deleted and when its image is replaced.
- A one-off script `scripts/orphan-report.ts` lists R2 keys without an `image` row (optional).

## Local development

`wrangler dev` / the Vite plugin simulate R2 locally (state under `.wrangler/state`). Public URLs do not exist locally, so add a **dev-only** route `src/routes/api.media.$.ts` that serves `env.MEDIA.get(key)` with the stored content type, enabled only when `PUBLIC_MEDIA_BASE_URL` is empty or starts with the local origin. `fileUrl` is built from the base URL, so locally it points at `/api/media/<key>`.

## Admin UI: `ImageDropzone` (`src/components/admin/image-dropzone.tsx`)

- Built on `react-dropzone` (already a dependency), accepting the same MIME list and 4 MB cap, one file.
- States: empty (dashed 22 radius box, icon, "Drop an image or browse", accepted types and size), dragging (brand border), uploading (determinate progress; use `XMLHttpRequest` or `fetch` with a stream wrapper), done (preview thumbnail with replace and remove buttons), error (message under the box, `role="alert"`).
- Calls `POST /api/admin/upload`, receives `{ id, fileUrl }`, and sets `imgID` and `imgUrl` in the project form.
- Keyboard accessible (the dropzone root is focusable and opens the file dialog on Enter or Space); `aria-describedby` points at the constraints text.
- Removing a not-yet-saved upload calls a `deleteUpload` server function so no orphan is left.

## Serving and images in pages

- Pages use plain `<img>` with `width`, `height`, `loading="lazy"`, `decoding="async"`; hero and the featured project image may use `fetchpriority="high"`.
- Optional later (R-15): Cloudflare image transformations on the media domain for resized variants. Out of scope for the migration.

## Removed

`uploadthing`, `@uploadthing/react`, `app/api/uploadthing/*`, `uploadthing.ts`, the `utfs.io` image pattern, `UPLOADTHING_TOKEN`.

## Acceptance checks

- Uploading a 3.9 MB PNG succeeds and the URL returns the image with the immutable cache header; a 4.1 MB file, an SVG, and a renamed text file all fail with clear messages.
- Replacing a project's image deletes the old object (verify with `wrangler r2 object get`).
- Unauthenticated `POST` returns 401 and writes nothing.
- No code path builds an R2 key from user-supplied filenames.
