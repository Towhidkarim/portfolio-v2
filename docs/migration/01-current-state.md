# Current state (as of commit 9685db5)

Source of truth for what exists. All paths are relative to the repo root before the migration.

## Stack

Next.js 15.5.7 (App Router, Turbopack dev, React Compiler flag), React 19.1, Tailwind CSS 3.4 + shadcn/ui (Radix), framer-motion 11, react-type-animation, next-themes, TanStack Query 5, react-hook-form + zod 3, sonner, Drizzle ORM 0.41 on libSQL (Turso), Upstash Redis, Lucia 3.2 + `@node-rs/argon2`, UploadThing 6, `@t3-oss/env-nextjs`. Package manager: Bun (`bun.lock`). Deployed on Vercel. Unused dependencies: `postgres`, `@types/bun` is only for typings.

## Routes

| Route | File | Rendering today | Notes |
| --- | --- | --- | --- |
| `/` | `app/page.tsx` | Server component shell; client sections | Order: Navbar, Hero, SkillSection, Projects, Education, AboutMe, Contact, Footer, CursorFollower. Projects are fetched client side with `useQuery` |
| `/all-projects` | `app/all-projects/page.tsx` | Same `Projects` client component | Back link to home |
| `/projects/[slug]` | `app/projects/[slug]/page.tsx` | Server, queries the database directly by id | Contains a dead mock `getProject` function |
| `/blog`, `/blog/[slug]` | `app/blog/**` | Static, `generateStaticParams` | Posts are an array in `lib/blogs.ts`; markdown is rendered by a naive line-by-line converter into `dangerouslySetInnerHTML` |
| `/login`, `/signup` | `app/(auth)/**` | Client forms calling server actions | Signup is public |
| `/dashboard` | `app/(auth)/dashboard/page.tsx` | Server, redirects if no session | Four tabs held in client state; placeholder text "Logo Here", "Bottom", "Side Menu" |
| `/api/uploadthing` | `app/api/uploadthing/*` | UploadThing route handler | `core.ts` middleware requires a session |
| `/api/revive` | `app/api/revive/route.ts` | GET, one project query | Looks like a Turso keep-alive ping |
| (metadata) | `app/layout.tsx`, `app/opengraph-image.png` | | Title "TowhidKarim \| Portfolio", Google verification meta, canonical `/`, Poppins applied (Inter loaded but unused) |

## Data model (`db/schema.ts`, SQLite)

| Table | Columns |
| --- | --- |
| `user` | `id` text pk, `username`, `email` unique, `passwordHash` nullable, `role` enum `user` or `admin` |
| `session` | `id` pk, `user_id` fk cascade, `expires_at` integer |
| `config` | `registrationsEnabled` boolean (no pk; effectively unused) |
| `project` | `id` pk, `projectName`, `displayIndex` int default 0, `imgUrl`, `imgID` fk to `image.id`, `tags` json string[], `summary`, `description`, `enabled` bool default true, `demoLink`, `sourceLink` |
| `image` | `id` pk, `customID` (property `key`), `fileName`, `fileSize`, `fileUrl` |
| `mail` | `id` pk, `sentAt` text default CURRENT_TIMESTAMP, `senderName`, `senderEmail`, `message` |

Zod: `ProjectSchema` (drizzle-zod insert schema with tightened rules: name 3 to 64, summary 10 to 512, description 10 to 2048, URLs valid) and `MailSchema`. Types `TProject`, `TUser`, `TImage`.

## Server actions (all `'use server'`)

| File | Export | Auth | Behaviour |
| --- | --- | --- | --- |
| `lib/global-actions/FetchPublicProjects.ts` | `FetchPublicProjectsAction({minIndex})` | public | Reads Redis key `publicProjectsData`; if valid, returns it (ignores `minIndex`); else queries enabled projects with `displayIndex >= minIndex`, then caches. Returns `{data}` or `{data: undefined}` on failure |
| `lib/global-actions/FetchProjects.ts` | `FetchProjectsAction(limit, offset)` | admin, else redirect to `/login` | List projects ordered by `displayIndex` desc |
| `lib/global-actions/FetchMails.ts` | `FetchMailsAction(limit, offset)` | admin | List mails by `sentAt` desc |
| `lib/global-actions/ModifyProjects.ts` | `ModifyProjectAction({id, values})` | admin | Update project, clear Redis key by setting `''` |
| `app/(auth)/dashboard/_components/_actions/SubmitProject.ts` | `SubmitProjectAction({data})` | admin | Validate with `ProjectSchema`, insert, clear Redis |
| `lib/global-actions/ImageUpload.ts` | `ImageUploadAction` | weak (`!user?.role`) | Insert `image` row; largely superseded by the UploadThing route |
| `lib/global-actions/SendMail.ts` | `SendMailAction` | public, no rate limit | Validates `MailSchema`, inserts `mail` |
| `app/(auth)/login/actions.ts` | `SignInAction` | public | zod check, argon2 verify, Lucia session cookie |
| `app/(auth)/signup/actions.ts` | sign-up | public | Creates user with argon2 hash |

Lucia helper `generateIdFromEntropySize(10)` is used for ids in four places: `SendMail`, `ImageUpload`, `SubmitProject`, `app/api/uploadthing/core.ts` (and sign-up).

## Components

| Path | Purpose | Migration note |
| --- | --- | --- |
| `app/_components/navbar.tsx` | Fixed bar, links Home/Skills/Projects/About me/Contact, mobile `Sheet` | Rebuild per design (floating pill, scroll-spy, Hire me) |
| `hero.tsx`, `typo.tsx` | Hero copy, `react-type-animation` role line, `FloatingObject` chips, hero illustration | Rebuild; role line becomes CSS typewriter; h1 only for the name |
| `skills-section.tsx` | 5 categories, 29 skills, 4 "core principles" | Rebuild as bento (see design) |
| `projects.tsx`, `project-modal.tsx` | Client-fetched cards, hover-only "View Details" modal | Rebuild; modal replaced by route `/projects/$id` plus optional dialog |
| `education.tsx` | BSc card and Programming Hero card | Rebuild compact |
| `aboutme.tsx` | Photo, paragraphs, "Name / Employment / Education / Experience: Adept" grid | Rebuild; replace "Adept" with "Focus: Full-stack, AI-native" (owner approval pending) |
| `contact.tsx` | Form, toast "Succes!" typo | Rebuild into dark band, add Turnstile |
| `blog-section.tsx`, `ScrollToTop.tsx` | Blog teaser, scroll button | Keep minimal or drop |
| `components/footer.tsx` | Contact details, socials, "BSc in CSE", CGPA | Rebuild |
| `components/framer/*` | `Reveal`, `MotionDiv`, `FloatingObject`, `CursorFollower`, `JumpingText`, `FadeEffect` | See `04-reveal-system.md` |
| `components/ui/*` | shadcn primitives: alert-dialog, badge, button, card, dialog, form, input, label, scroll-area, sheet, skeleton, sonner, switch, tabs, textarea; plus `section-title`, `project-card-skeleton` | Keep shadcn primitives; restyle with tokens |
| `components/DropZone.tsx`, `Demo.tsx` | Upload UI | Replace with R2 dropzone |
| `lib/icons.ts` | Imports ~38 icon files from `public/icons` | Keep the files; replace `next/image` StaticImport usage with Vite asset imports |

## Dashboard components

`app/(auth)/dashboard/_components/`: `menu-list.tsx`, `menu-contents.tsx` (tab plumbing); `tabs/AddProject.tsx` (241 lines), `tabs/ProjectSettings.tsx` (308 lines; duplicates the add form), `tabs/ViewProjects.tsx` (pagination state unused, query key ignores page, gear icon `opacity-0` until hover), `tabs/Inbox.tsx` (server component, one read, no actions), `tabs/DeleteProject.tsx` (not wired into the tab list).

## Environment today

`DATABASE_URL`, `DB_AUTH_TOKEN` (validated by `env.ts`), `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, `UPLOADTHING_TOKEN` (or legacy id and secret), `NODE_ENV`.

## Known defects to fix, not carry over

1. `FloatingObject` calls `Math.random()` during render: values differ between server and client (hydration risk) and between renders.
2. Several `h1` elements per page (name, role line, contact title); section titles are `h1`.
3. Hero: stray class `= text-xl`; typo "solutoins"; fixed `h-[70vh]` that can clip on phones.
4. Toast text "Succes!" (Contact and ProjectSettings); `font-lg` class does not exist (about section).
5. Public projects fetched on the client: absent from server HTML, flashes a skeleton, needs TanStack Query on the public bundle.
6. Redis cache returns one cached list regardless of `minIndex`; invalidation writes an empty string; `redis.set` is not awaited in the fetch path.
7. Lucia `validateRequest` sets cookies during render (errors swallowed by `try/catch`).
8. `Reveal` hides content at `opacity: 0` until hydration; animates `width`; wraps ~40 elements.
9. `View Details` appears only on hover: invisible on touch screens.
10. `app/projects/[slug]/page.tsx` carries a dead mock data function.
11. Blog markdown converter is fragile and uses `dangerouslySetInnerHTML` on string-built HTML.
12. Inter font loaded but unused; `Image priority` set on every project card; no `alt` text on several illustrations.
13. No `prefers-reduced-motion` handling anywhere.
14. Contact form has no spam protection or rate limit; `SendMailAction` is open to anyone.
15. Public signup route exists on a single-admin site.

## Migration map (current to target)

Target layout is defined in `02-target-architecture.md`. Legend: **port** = move logic, adapt APIs; **rebuild** = new implementation from the design; **replace** = different technology; **delete**.

| Current | Action | Target |
| --- | --- | --- |
| `app/layout.tsx` | rebuild | `src/routes/__root.tsx` (head, fonts, theme script, reveal script, Toaster) |
| `app/page.tsx` | rebuild | `src/routes/index.tsx` + `src/components/site/*` |
| `app/all-projects/page.tsx` | rebuild | `src/routes/all-projects.tsx` |
| `app/projects/[slug]/page.tsx` | rebuild | `src/routes/projects.$id.tsx` |
| `app/blog/**`, `lib/blogs.ts` | port | `src/routes/blog.index.tsx`, `blog.$slug.tsx`, `src/content/blogs.ts` |
| `app/(auth)/login/**` | rebuild | `src/routes/login.tsx` with Better Auth client |
| `app/(auth)/signup/**` | delete | none |
| `app/(auth)/dashboard/**` | rebuild | `src/routes/admin*.tsx` + `src/components/admin/*` |
| `app/api/uploadthing/**` | replace | `src/routes/api.admin.upload.ts` |
| `app/api/revive/route.ts` | delete or replace | Cron trigger only if still needed (see R-19) |
| `lib/auth.ts` | replace | `src/server/auth.ts`, `src/server/session.ts` |
| `lib/global-actions/*` | port | `src/server/fns/*.ts` (`createServerFn`) |
| `db/index.ts` | replace | `src/server/db.ts` (`getDb()`) |
| `db/schema.ts` | port | `src/db/schema.ts` + generated `src/db/auth-schema.ts` |
| `env.ts` | replace | `src/server/env.ts` (zod parse of Worker env) |
| `uploadthing.ts`, `components/DropZone.tsx`, `components/Demo.tsx` | replace | `src/components/admin/image-dropzone.tsx` |
| `components/framer/Reveal.tsx` | replace | `src/components/reveal/*` |
| `components/framer/FloatingObject.tsx`, `JumpingText.tsx`, `FadeEffect.tsx`, `MotionDiv.tsx` | delete or CSS | CSS keyframes in `src/styles/motion.css` |
| `components/framer/CursorFollower.tsx` | decide | keep as optional client-only component (framer `motion/react` lazy) or drop; owner to confirm |
| `components/ui/*` | port | `src/components/ui/*` (restyled with tokens) |
| `lib/Providers.tsx` | replace | QueryClient provider in router context, admin only |
| `lib/constants.ts` | port | `src/lib/constants.ts` (drop `redisKeys`, `queryKeys` kept) |
| `lib/icons.ts`, `public/icons/*`, `public/images/*` | port | Vite asset imports, same files |
| `next.config.ts`, `postcss.config.mjs` | delete / port | `vite.config.ts`; PostCSS stays for Tailwind 3 |
| `tailwind.config.ts` | port | extend with design tokens |
| `app/globals.css` | rebuild | `src/styles/globals.css` + `tokens.css` + `reveal.css` |

During the migration the old code is parked in `legacy/` (Phase 0) so agents can read it; it is deleted in Phase 9.
