# Phase 3: Design foundation and Reveal

## Goal
Everything the pages share: tokens, fonts, Tailwind mapping, shadcn primitives restyled, root layout (head, theme, reveal script), the Reveal system and motion CSS, plus a hidden `/_styleguide` route that renders every component so the design can be checked against the screenshots.

## Depends on
Phase 0. Can run in parallel with Phases 1 and 2.

## Read first
`../03-design-system.md`, `../04-reveal-system.md`, `../design/README.md`, `../design/tokens.css`, `../design/copy.md`, and look at `../design/screens/h0-guideline.png`, `h5-reveal.png`, `h1-desktop.png`.

## Pending research to resolve first
**R-09** (Tailwind 4 on Vite is done in Phase 0; shadcn CLI for v4, React Compiler, path alias), **R-10** (head and inline scripts, font preload), **R-11** (theme script), **R-16** (hydration and re-scan). Record resolutions. **R-21** (CursorFollower: ask the owner; default is to drop it).

## Steps
1. - [ ] `src/styles/tokens.css` from `design/tokens.css`; `globals.css` imports tokens, Tailwind layers, `reveal.css`, `motion.css`. Base styles: body background `--bg`, text `--ink`, `scroll-behavior: smooth` (not on both html and main), `:focus-visible` ring, `prefers-reduced-motion` rules.
2. - [ ] Tailwind 4 theme (`@theme` in `globals.css`, no `tailwind.config.ts`): extend colors per `design/README.md` mapping, `borderRadius` (control 12, card 22, project 24), `fontFamily` (`sans: Poppins`, `mono: JetBrains Mono`), `container` 1160. Animations come from `tw-animate-css` (already imported).
3. - [ ] Fonts: import `@fontsource/poppins` weights 400, 500, 600, 700, 800 and `@fontsource/jetbrains-mono` 400, 500 (latin subset files only) and preload the Poppins 400 and 800 woff2 in the root head. No Inter.
4. - [ ] shadcn primitives: port needed `components/ui/*` from `legacy/components/ui` to `src/components/ui`, restyle to tokens (button variants: default=primary, outline=secondary, plus `brand` for the dark band; card; badge; input/textarea/label; dialog; sheet; alert-dialog; switch; tabs; scroll-area; skeleton; sonner). Remove `cursor-pointer` from non-interactive items.
5. - [ ] `src/components/reveal/*` and `src/styles/reveal.css` from `04-reveal-system.md`. Implement the `immediate` + `data-immediate` refinement noted there. Add `<RevealScan />` to the root.
6. - [ ] `src/styles/motion.css`: typewriter, floating chips, pulse, glow drift, marquee, AI loop, heatmap pop, all with reduced-motion fallbacks. Fixed per-chip values, no randomness.
7. - [ ] Root route `__root.tsx`: `<html lang="en" suppressHydrationWarning>`, head (title, description, viewport, OG/Twitter meta, canonical, google-site-verification, favicon), inline theme script then inline reveal script (order matters), `<body>` with skip link, `<Outlet/>`, Toaster. 404 and error components styled with tokens.
8. - [ ] Theme: toggle component (light/dark, default system) that sets `class="dark"` on `<html>` and stores the choice in `localStorage`; the inline script applies it before paint. HTML must be theme-agnostic (no server theme).
9. - [ ] Reusable site primitives: `Eyebrow`, `SectionHeader` (eyebrow, curtain H2, draw bar, sub), `Chip`, `Pill`, `StatusPill` (client-side clock, `--:--` on server), `IconButton`, `Skeleton` variants. Props typed; no content hardcoded inside.
10. - [ ] `/_styleguide` route (noindex, not linked, excluded from the sitemap and cache): renders buttons, chips, pills, section header, a project card with placeholder content, form fields, dark panel sample, reveal variants. Compare visually against `design/screens`.
11. - [ ] Add a Playwright check script (`scripts/check-reveal.mjs`) implementing the reveal acceptance criteria 1, 2, 5 from `04`.

## Files
Created: `src/styles/*`, `src/components/{ui,reveal,site-primitives}/*`, `src/routes/__root.tsx`, `src/routes/_styleguide.tsx`, `scripts/check-reveal.mjs`. Changed: `tailwind.config.ts`, `package.json`.

## Acceptance criteria
- `/_styleguide` matches the design: spot-check colours, radius, type sizes against `design/source/h0-guideline.html` side by side (screenshots attached to the handoff).
- Dark mode toggle works with no flash on reload; HTML served from the server is identical regardless of theme.
- Reveal criteria 1, 2, 3, 5 pass; the curtain demo in `/_styleguide` looks like `design/screens/h5-curtain-frame-*.png`.
- Fonts self-hosted, no request to Google Fonts; Poppins preload present.
- Lighthouse on `/_styleguide`: accessibility 95 or higher.
- Typecheck, lint, build pass; `framer-motion` is not imported by any file in `src/`.

## Verification
```
bun run build && bun run preview
node scripts/check-reveal.mjs          # JS disabled, reduced motion, curtain count
# manual: toggle theme, reload, check no flash; screenshot /_styleguide at 1280 and 390
```

## Out of scope
Real page sections (Phase 4), caching (Phase 5), admin shell (Phase 7), any data fetching.

## Rollback
Styles and components are additive; delete the folder.

## Deviations
- **Route is `/styleguide`, not `/_styleguide`**: in TanStack file routing a leading underscore makes a pathless layout route with no URL. The page is `noindex`, not linked, and never cached (the root route defaults every document to `Cache-Control: private, no-store`). Keep it out of the sitemap in Phase 5.
- **shadcn primitives were generated, not ported**: `bunx shadcn@latest add ...` produced Tailwind 4 / React 19 versions (data-slot attributes, no `forwardRef`, the unified `radix-ui` package), then restyled to the tokens. The legacy individual `@radix-ui/*` packages were removed. The CLI also added an npm package literally named `cn` and `next-themes`; both were removed (own `cn` in `src/lib/utils.ts`, own `useTheme` in `src/lib/theme.ts`). Restyled: button (variants `default` ink / `outline` / `secondary` / `ghost` / `destructive` / `brand` for the dark band / `link`; sizes 48 px default, `sm`, `lg`, 44 px round `icon`; defaults to `type="button"`), badge (the design pill), card, input/textarea/label (with `tone="panel"` for the dark band), dialog, sheet, alert-dialog, switch, tabs, scroll-area, skeleton, sonner. Present but unused so far: card, sheet, alert-dialog, scroll-area.
- **Focus ring**: global `:focus-visible` is the 2 px brand outline with a 3 px offset, without the design source's `border-radius: 10px` (it would square off pills and round buttons).
- **Danger colour**: the shadcn destructive token (red 60 %) fails AA for text. Added `--danger` (`#B91C1C` light, `#F87171` dark, utility `text-danger`) for text, a fixed `#B91C1C` fill for the destructive button, kept `destructive` for borders and focus rings.
- **Reduced-motion marquee** becomes a static wrapped list (duplicate copy hidden) instead of a horizontally scrollable region, which axe flags as keyboard-inaccessible.
- **GitHub icon**: lucide-react 1.x no longer ships brand icons, so the GitHub mark is an inline SVG (see `styleguide.tsx`). Phase 4 should keep brand marks as SVG files in `public/icons` or inline.
- **Head**: title is `TowhidKarim | Portfolio`; description is the suggested sentence (owner to confirm). `<link rel="canonical">` and an absolute `og:image` URL are NOT set yet because the site URL does not exist (Phase 8 will add a `PUBLIC_SITE_URL` var). `og:image` is the relative `/opengraph-image.png`, copied with `favicon.ico` from `legacy/app` into `public/`.
- **CursorFollower dropped** (R-21 default). Say so if you want it back.
- **Biome formats CSS** with double quotes; that is fine, it only touches formatting.
- **Added dev dependencies**: `playwright` (Chromium installed to the user profile with `bunx playwright install chromium`) and `@axe-core/playwright`. Lighthouse was run with `bunx lighthouse@latest`, not installed.
- **Reveal rule of use** (written into `reveal.css`): never put `[data-reveal]` on an element that has its own hover transform or transition (cards, buttons), because reveal's transition would replace it. Wrap it. The `immediate` variant sets both `data-in` and `data-immediate`, and the CSS animation is scoped to `[data-immediate]` as the spec's note asked.
- Acceptance criteria not provable yet: reveal #6 (client navigation re-scan) needs two pages that use `Reveal`, so it is deferred to Phase 4 (`RevealScan` is implemented and mounted); #4 (compositor-only) holds by construction (only transform, opacity, clip-path animate) but was not profiled in DevTools.
- **Mobile typewriter caveat for Phase 4**: the second phrase ("Crafting Scalable Apps with React & Next.js", 43 characters) is about 450 px wide at 22 px and cannot wrap, so at 390 px it overflows its column. The hero needs a smaller size on phones (or a different mobile treatment) and `min-w-0`/`overflow-hidden` on the wrapper. The styleguide demo shows the pattern.

## Handoff

### Handoff (2026-10-10, Claude)
Done: `src/styles/{globals,tokens,reveal,motion}.css` (Tailwind 4 `@theme inline` mapping of the design tokens, radii 12/22/24, Poppins and JetBrains Mono self-hosted via `@fontsource` latin files, 1160 px `container` utility, base styles); restyled `src/components/ui/*`; `src/components/reveal/{reveal,reveal-init,reveal-scan}`; `src/components/site-primitives/primitives.tsx` (Eyebrow, SectionHeader, Chip, Pill, StatusPill, IconButton, ProjectCardSkeleton, TextSkeleton, ChipSkeleton); theme (`src/lib/theme.ts` inline script + `useTheme`, `ThemeToggle`); root route (head, font preloads, inline theme then reveal scripts, skip link, Toaster, RevealScan, styled 404 and error pages); restyled `/login` and the admin placeholder; the `/styleguide` QA page; `scripts/check-reveal.mjs`, `scripts/check-a11y.mjs`; `bun run check:reveal` and `check:a11y`. Screenshots: `docs/migration/design/built/phase3-styleguide-{light-1280,dark-1280,light-390}.png`.
Verified by running (production build under `vite preview`, and again under `vite dev`): `scripts/check-reveal.mjs` on `/styleguide` and `/login`, 32/32: JS disabled leaves every `[data-reveal]` visible; reduced motion renders no curtain overlay and everything is visible; at most 8 curtains per page and at most one in the first viewport; no hydration or console warnings at 1280 and 390 (so the observer's `data-in` and the `html.js`/`dark` classes do not warn: R-16); the dark class is applied before the first frame; no Google Fonts requests; Poppins 400 and 800 preloaded; no horizontal overflow at 390; server HTML identical for light and dark visitors and has no dark class. `scripts/check-a11y.mjs` (axe, WCAG 2 A/AA): 0 violations in light and dark on both pages. Lighthouse on `/styleguide`: accessibility 100 (it was 96 before the danger-colour fix), best practices 100 (SEO 60 is expected: the page is `noindex`). Real-motion curtain frame at 0.6 s matches `design/screens/h5-curtain-frame-2.png`. Served head order is stylesheet, font preloads, theme script, reveal script. Typecheck, lint/check, build, 30 tests pass; `bun outdated` empty; no `framer-motion`, `next-themes` or `cn` package in `src`.
Not verified / could not run: client-navigation re-scan (reveal #6) and the dark-mode toggle click flow in a real session (only the load-time theme application is tested); DevTools compositor profile; a pixel-level side-by-side against `design/source/h0-guideline.html` (values were copied from the sources and spot-checked visually); the `Replay reveals` button; Playwright runs only on Chromium.
Deviations from spec: see Deviations.
Pending research resolved: R-09 (Tailwind 4 + shadcn CLI work on Vite; React Compiler still deferred), R-10, R-11, R-16, and R-21 for CursorFollower (dropped).
Next agent should watch out for: wrap, do not decorate, elements that already have hover transforms with `Reveal`. Real sections must call `<Reveal immediate>` for everything in the first viewport and put `id="main"` on the page's `<main>` (the skip link targets `#main`). Brand marks cannot come from lucide-react 1.x. Run `bun run build && bun run preview -- --port 4173` and then `bun run check:reveal -- http://localhost:4173 /` and `check:a11y` on every new page; on Windows Git Bash prefix with `MSYS_NO_PATHCONV=1` so `/path` arguments are not rewritten. The typewriter overflows on phones (see Deviations).
