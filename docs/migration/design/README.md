# Design files

Everything an implementing agent needs to reproduce the approved design.

## Screens (`screens/`)

All screenshots are rendered from the HTML sources with `prefers-reduced-motion: reduce`, so they show the **final resting state** (animations off, role line shows the first phrase, curtains absent).

| File | Shows | Size |
| --- | --- | --- |
| `h1-desktop.png` | Whole home page, light, 1280 px wide | 1280 x 6300 |
| `h1-01-hero.png` | Hero | |
| `h1-02-proof.png` | Proof strip | |
| `h1-04-skills.png` | Skills bento and core principles | |
| `h1-05-projects.png` | Featured project, two cards, activity | |
| `h1-06-education.png` | Education cards | |
| `h1-07-about.png` | About | |
| `h1-08-contact.png` | Contact band (always dark) | |
| `h1-09-footer.png` | Footer | |
| `h2-dark.png` | Dark mode: nav, hero, proof, marquee, skills, featured project | 1280 x 2760 |
| `h3-mobile-top.png` | Mobile (390 px): nav, hero, proof, marquee, skills | 390 x 3500 |
| `h4-mobile-rest.png` | Mobile: projects, education, about, contact, footer | 390 x 6100 |
| `h0-guideline.png` | The design guideline board (principles, tokens, motion table, UX rules) | 1600 x 3480 |
| `h5-reveal.png` | Reveal system board (variants, anatomy, usage map, code) | 1280 x 2700 |
| `h5-curtain-frame-1..5.png` | The curtain at t = 0.25, 0.6, 0.95, 1.5 and 3 s | |

The marquee and nav strips are not cropped separately; see `h1-desktop.png`.

## Sources (`source/`)

Standalone HTML, one per board, exactly what the screenshots were rendered from. Open them directly in a browser (they load icons from `../../../../public/icons` and `public/images`, and fonts from `../assets/fonts`). They are the **reference implementation of spacing, sizes, colours and CSS animations**. Copy values from them; do not copy the structure blindly (they are static mock-ups with fixed widths).

| File | Board |
| --- | --- |
| `h1-desktop.html` | Desktop home, light |
| `h2-dark.html` | Dark variant (class `dk` on `.pg`) |
| `h3-mobile-top.html`, `h4-mobile-rest.html` | Mobile |
| `h0-guideline.html` | Guideline |
| `h5-reveal.html` | Reveal demos (loops every 7 s) |

Useful classes in the CSS block at the top of each file: `.btn`, `.chip`, `.bc` (bento card), `.pc` (project card), `.pill`, `.nl` (nav link), `.ib` (icon button), `.eb` (eyebrow), `.h2`, `.sub`, `.bar`, `.mqw/.mqt/.mqs/.mi` (marquee), `.hm/.hc` (heatmap), `.role/.ph/.cr` (typewriter), `.cur` (curtain), `.fld/.lbl` (form fields), `.stp` (AI loop pill).

Known limits of the sources: project screenshots are skeleton placeholders; names, summaries, `[N]` and the heatmap are placeholders; the nav is static in the mock (real: fixed with scroll-spy); the progress bar is fixed at 34 %.

## Tokens

- `tokens.css`: `:root` (light) and `.dark` variables, plus shadcn HSL triplets suffixed `-hsl`.
- `tokens.json`: the same values as data.
- Tailwind mapping (put in `tailwind.config.ts`, Phase 3):

```ts
colors: {
  background: 'var(--bg)', foreground: 'var(--ink)', surface: 'var(--surface)',
  line: 'var(--line)', brand: { DEFAULT: 'var(--brand)', ink: 'var(--brandink)', soft: 'var(--brandsoft)' },
  panel: 'var(--panel)',
  // shadcn names with alpha support
  card: 'hsl(var(--card-hsl) / <alpha-value>)', 'card-foreground': 'hsl(var(--card-foreground-hsl) / <alpha-value>)',
  popover: 'hsl(var(--popover-hsl) / <alpha-value>)', 'popover-foreground': 'hsl(var(--popover-foreground-hsl) / <alpha-value>)',
  primary: 'hsl(var(--primary-hsl) / <alpha-value>)', 'primary-foreground': 'hsl(var(--primary-foreground-hsl) / <alpha-value>)',
  secondary: 'hsl(var(--secondary-hsl) / <alpha-value>)', 'secondary-foreground': 'hsl(var(--secondary-foreground-hsl) / <alpha-value>)',
  muted: 'hsl(var(--muted-hsl) / <alpha-value>)', 'muted-foreground': 'hsl(var(--muted-foreground-hsl) / <alpha-value>)',
  accent: 'hsl(var(--accent-hsl) / <alpha-value>)', 'accent-foreground': 'hsl(var(--accent-foreground-hsl) / <alpha-value>)',
  destructive: 'hsl(var(--destructive-hsl) / <alpha-value>)', border: 'hsl(var(--border-hsl) / <alpha-value>)',
  input: 'hsl(var(--input-hsl) / <alpha-value>)', ring: 'hsl(var(--ring-hsl) / <alpha-value>)',
},
```

Note: `foreground` here should be `hsl(var(--foreground-hsl) / <alpha-value>)` and `background` `hsl(var(--background-hsl) / <alpha-value>)` if you want `bg-background/80` to work; the design CSS itself uses the hex variables. Pick one convention per component and keep it.

## Fonts (`assets/fonts`)

Latin subset woff2 from `@fontsource`: Poppins 400, 500, 600, 700, 800; JetBrains Mono 400, 500. In the app, import them through `@fontsource/*` packages (self-hosted, `font-display: swap`) and preload Poppins 800 and 400 (R-10). The files here exist so the HTML sources render offline.

## Rebuilding the screenshots

The screenshots were produced with Playwright (Chromium) against `source/*.html` at the widths above, `reducedMotion: 'reduce'`, `fullPage: true`. The curtain frames pause all animations and set `currentTime` on the H5 demo card. Re-render after any design change so these stay current.
