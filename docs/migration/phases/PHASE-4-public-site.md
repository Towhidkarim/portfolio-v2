# Phase 4: Public site

## Goal
Every public page built to the design, server-rendered, with data from the Phase 1 server functions, responsive to 390 px, with correct SEO and accessibility. No caching yet (Phase 5).

## Depends on
Phases 1 and 3.

## Read first
`../03-design-system.md` (all section specs), `../design/copy.md`, `../design/screens/*` (`h1-*`, `h2-dark`, `h3`, `h4`), `../04-reveal-system.md` (usage map), `../01-current-state.md` (routes and defects).

## Pending research to resolve first
**R-10** (head, sitemap, robots), **R-13** (blog rendering) and **R-21** (blog kept? About copy? CursorFollower?) answered by the owner. **R-16** (re-scan). Contact form protection is Phase 8; here the form posts to the Phase 1 server function.

## Steps
1. - [ ] `src/content/site.ts` and `src/content/skills.ts`: typed copy and data from `design/copy.md` (nav, hero strings, proof cells, skills with icon imports, principles, education, about, contact, footer). No copy inside JSX.
2. - [ ] `src/lib/icons.ts`: Vite asset imports (`import x from '/icons/React.svg'` style per R-09) replacing the Next StaticImport usage; keep file names; add width/height metadata where raster.
3. - [ ] Components in `src/components/site/`, one per section, props-driven: `site-nav` (floating pill, scroll-spy, progress bar, mobile sheet, theme toggle, Hire me), `hero`, `proof-strip`, `stack-marquee`, `skills-bento` (+ `ai-loop-card`), `projects-section` (+ `project-card`, `featured-project`, `activity-card`), `education`, `about`, `contact-band`, `site-footer`. Use `Reveal` per the usage map.
4. - [ ] Home route `index.tsx`: loader calls `getPublicProjects`; renders sections in order; ids for scroll-spy (`home`, `skills`, `projects`, `about`, `contact`); one `h1`.
5. - [ ] `all-projects.tsx`: full grid, back link, same card component. `projects.$id.tsx`: detail page (title, image, description with line breaks, tags, demo/source buttons, back link); unknown id returns a styled 404 (`notFound()`); meta from the project.
6. - [ ] Project states: skeleton (used only on client navigations), empty, error with retry. Cards fully clickable via a stretched link; inner buttons independent; `View Details` always visible.
7. - [ ] Activity card: for now render from a static JSON stub behind a `getContributions()` server function (real source decided by the owner, R-21; mark clearly in code and handoff).
8. - [ ] Contact band: form with react-hook-form + the public contact zod schema, `createContactMail` server function, labels, inline errors, success/error toast (fixed copy), copy-email button with live region. Turnstile is added in Phase 8.
9. - [ ] Blog: port `lib/blogs.ts` to `src/content/blogs.ts`; routes `blog.index.tsx` and `blog.$slug.tsx`; render markdown with the approach chosen in R-13 (no unsanitised `dangerouslySetInnerHTML` of string-built HTML); prerender not required. Skip if the owner drops the blog.
10. - [ ] SEO: per-route `head()` titles/descriptions, canonical, OG image, `sitemap.xml` and `robots.txt` server routes (home, all-projects, each enabled project, blog), `lang`, structured data `Person` JSON-LD on home (name, url, sameAs GitHub/Facebook, jobTitle).
11. - [ ] Responsive pass at 1280, 1024, 768, 390 and dark mode against screenshots; fix overflow; touch targets 44 px.
12. - [ ] Accessibility pass: heading order, landmarks (`header`, `nav aria-label`, `main#main`, `footer`), labels, alt text rules (decorative icons empty alt, meaningful images descriptive), focus order, contrast, reduced motion, keyboard-only walkthrough.
13. - [ ] Performance pass: only hero/featured image eager, others lazy with dimensions; no layout shift; check bundle sizes (home route JS budget: under 150 KB gzip including React, record actual).

## Files
Created: `src/routes/{index,all-projects,projects.$id,blog.index,blog.$slug,sitemap[.]xml,robots[.]txt}.tsx|ts`, `src/components/site/*`, `src/content/*`, `src/lib/icons.ts`. Changed: `src/routes/__root.tsx` (nav/footer placement if shared).

## Acceptance criteria
- Visual: each section matches `design/screens/h1-*.png` at 1280 (pixel-perfect not required; sizes, spacing, colours, copy exact). Mobile matches `h3`/`h4`; dark matches `h2`.
- View-source of `/` contains the project titles and summaries (server-rendered, not client fetched).
- `curl -s localhost:<port>/ | grep -c "<h1"` returns 1.
- Contact form saves a row in the local D1 `mail` table and shows the success toast; invalid input shows inline errors.
- Lighthouse (mobile): performance 90 or higher, accessibility 95 or higher, best practices 95 or higher, SEO 100 on `/`.
- No `Math.random` in render paths; no hydration warnings in the console.
- Reveal criteria 1 to 7 from `04` pass on `/`.

## Verification
```
bun run build && bun run preview
bun run seed:dev
node scripts/check-reveal.mjs
npx lighthouse http://localhost:<port>/ --preset=desktop --view   (and mobile)
playwright screenshots at 1280/390, light/dark, compare with design/screens
```

## Out of scope
Caching, Turnstile, admin, real GitHub data, removal of `legacy/`.

## Rollback
Routes and components are additive.

## Deviations
- **Layout route `_site`**: the public pages are `_site.index.tsx`, `_site.all-projects.tsx` and `_site.projects.$id.tsx` under a pathless layout (`_site.tsx`: nav, `main#main`, footer). URLs are unchanged (`/`, `/all-projects`, `/projects/$id`). The nav therefore survives client navigation. A layout's own `notFoundComponent` would replace the whole layout (nav included), so the 404 for an unknown project lives on the project route (`components/site/site-not-found.tsx`). Unknown URLs such as `/foo` still get the root 404 page without the nav.
- **Blog skipped (step 9, R-13, R-21)**: the design nav has no Blog link and the owner has not decided whether the blog stays. Nothing was ported; `legacy/lib/blogs.ts` is untouched. Decide before Phase 8.
- **Icons are plain URL strings, not Vite imports (step 2)**: `src/content/skills.ts` holds file names and `SkillIcon` builds `/icons/<encoded name>`. No `src/lib/icons.ts`. Files are in `public/`, so they are cacheable assets with no import graph. Raster icons were shrunk in place to at most 96 px (tanstack.png 100 KB to 8 KB, cursor.png 68 KB to 5 KB, others 3 to 9 KB).
- **Activity card uses the GitHub GraphQL API (step 7, R-21 resolved 2026-10-10)**: `getContributions()` calls `contributionsCollection.contributionCalendar` with `GITHUB_TOKEN` (a Worker secret, no scopes; in `.dev.vars` locally) and uses GitHub's own `contributionLevel` for the 0 to 4 shades. No token (local dev) returns the deterministic stub (`isStub`); a GitHub error returns `null` and the card is omitted. The call is not cached yet: Phase 5 caches it (separate tag, few hours). Production needs `wrangler secret put GITHUB_TOKEN` at deploy. The graph follows the design file: 13 px cells and 4 px gaps (11 / 3 and 24 weeks on phones), month labels aligned to their week column, and the columns pop in 22 ms apart when the card scrolls into view (CSS, gated on the Reveal `data-in`), not at page load.
- **Contact form is a lazy chunk**: `contact-form.tsx` is loaded with `React.lazy` inside `contact-band.tsx` (server-rendered, hydrates when loaded). It moved about 13 KB gzip of route code out of the first load but react-hook-form and zod still ship in the shared entry chunk (the login page uses them too).
- **No `src/lib/icons.ts`; no canonical link; no absolute `og:image`** (no domain yet, Phase 8). `sitemap.xml` and `robots.txt` take the origin from the request, are `private, no-store` for now, and list the home page, `/all-projects` and enabled projects. `robots.txt` disallows `/admin`, `/login`, `/api/`, `/styleguide`.
- **Person JSON-LD** (name, jobTitle, sameAs) is in the home route head; `url` is omitted until the domain exists.
- **Project cards**: the featured image is `loading="eager"` without `fetchpriority` (it is below the fold; the hero illustration holds the high priority). Education "+N more" pills are not interactive (the optional coursework dialog was not built). `View all projects` always shows when there is at least one project.
- **Home JS budget missed**: first load is about 190 KB gzip (entry chunk 109 KB: React DOM, router, start client, react-hook-form, zod, sonner; plus 20 KB router, 12 KB radix dialog for the mobile sheet, 11 KB server-fn client). The 150 KB target is not met. Ideas if it matters: drop react-hook-form for a native form with `safeParse`, lazy-load the nav sheet, manual chunks.
- **Hero typewriter**: second phrase renders at 16 px below `sm` (22 px above) so it fits at 390 px (verified: no horizontal overflow).
- **Hero illustration (2026-10-10)**: replaced the stock Freepik scene with an AI-native one in the brand palette (editor with a diff, agent card with Prompt/Plan/Build/Review steps, review checks; the original character, recoloured). It is generated by `bun run illustration:build` (`scripts/hero-illustration/build.mjs`, source `hero-original.svg`) into `src/assets/hero-illustration.svg` and inlined by `Hero` (`?raw`), so it follows the `.dark` class with no extra request and is no longer the LCP image. Every colour is a `--il-*` CSS variable; animations are namespaced `il-*` and stop under reduced motion. The floating chips are React, TypeScript, Claude (replaced Tailwind) and Next.js. The seed script now uses `/images/contact.svg` as the placeholder screenshot because `public/images/hero.svg` moved to `scripts/hero-illustration/`. Experiments and frame captures: `docs/migration/design/experiments/hero/`.

## Handoff

### Handoff (2026-10-10, Claude)
Done: `src/content/{site,skills}.ts` (all copy and skill data); `src/components/site/*` (site-nav with scroll-spy, progress bar and mobile sheet; hero; proof-strip; stack-marquee; skills-bento + ai-loop-card; projects-section + project-card/featured-project + activity-card; education; about; contact-band + contact-form; site-footer; site-not-found; brand-icons); routes `_site`, `_site.index`, `_site.all-projects`, `_site.projects.$id`, `sitemap[.]xml`, `robots[.]txt`; `getContributions` stub with a unit test; `Chip` got a `plate` prop. Old `src/routes/index.tsx` placeholder removed.
Verified by running (production build under `vite preview`, local D1 seeded with `bun run seed:dev`): view-source of `/` contains the project titles and exactly one `<h1`; `check:reveal` 32/32 on `/` and `/all-projects`; axe 0 violations in light and dark on both; Playwright flow script: scroll-spy marks Projects, empty submit shows 3 inline errors, valid submit shows the "Message sent" toast (row written to local D1 `mail`), copy-email works, client navigation to `/all-projects` and to a project gives every `[data-reveal]` a `data-in` (reveal criterion 6 verified), unknown project returns 404 with the nav kept, mobile sheet opens and Esc closes it, no horizontal overflow at 390; no console errors apart from the expected 404 resource. Lighthouse (served through a local brotli proxy to imitate Cloudflare compression): desktop 98 performance, 100 accessibility, 100 best practices, 100 SEO; mobile 78 to 94 over several runs (noisy), 100 / 100 / 100. Without compression the mobile score is about 58 (a plain `vite preview` serves 150 KB of HTML and 350 KB of JS uncompressed). 32 tests pass; Biome and typecheck clean. Screenshots: `docs/migration/design/built/phase4-{light,dark}-1280.png`, `phase4-{light,dark}-390.png`, `phase4-all-1280.png`, `phase4-top-1280.png`, `phase4-hero-390.png`.
Not verified / could not run: mobile performance 90+ (measured 78 to 94, depends on edge compression, recheck after deploy in Phase 8); a pixel-level side-by-side with `design/screens` (checked visually only: layout, copy and colours match; the section order and structure are identical); Firefox and Safari; the browser-only live clock beyond seeing a time render; heatmap data (stub).
Deviations from spec: see Deviations.
Pending research resolved: R-10 (head, sitemap, robots), R-16 (client navigation re-scan). R-13 and the blog part of R-21 are still open (owner).
Next agent should watch out for: `Reveal` merges nothing into `style` (a `style` prop replaces the `--d` variable): wrap instead, as the education progress bar does. Route files may only export `Route`; shared pieces live in `components/`. Phase 5 must opt routes in to caching with route `headers` (root default is `private, no-store`) and tag them; the home loader now also calls `getContributions` (cache it separately when the real source exists). Replace the hard-coded `ContactSchema` limits only together with the server schema. Run `bun run build` then restart `vite preview` after every build: the old preview process keeps serving the previous hashed assets (500s).
