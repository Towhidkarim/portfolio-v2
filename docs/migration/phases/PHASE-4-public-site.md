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
(none yet)

## Handoff
(template in `00-agent-protocol.md`)
