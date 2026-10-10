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
(none yet)

## Handoff
(template in `00-agent-protocol.md`)
