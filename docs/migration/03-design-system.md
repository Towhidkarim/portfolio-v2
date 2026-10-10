# Design system and page specs

> **Public site as built (Phase 4):** `src/components/site/*`, copy in `src/content/*`, routes under the `_site` layout. See `phases/PHASE-4-public-site.md` Deviations for what differs (stub activity data, no blog, no Turnstile yet).

> **As built (Phase 3):** tokens in `src/styles/tokens.css`, Tailwind mapping (`@theme inline`) in `src/styles/globals.css`, components in `src/components/{ui,site-primitives}`, QA page at `/styleguide`. Differences from this file: global focus outline has no border radius; extra `--danger` text colour for AA; see `phases/PHASE-3-design-foundation.md` Deviations.

Source of truth for visuals: `design/screens/*.png` and `design/source/*.html`. Tokens: `design/tokens.css`. Copy: `design/copy.md`. This file turns them into build rules. When this file and the HTML sources disagree on a number, the HTML source wins; fix this file.

## Principles

1. **One accent.** Teal marks what is alive or actionable: active nav item, role line, status dot, accent bars, progress lines, curtain. Everything else is neutral. Ratio about 90 neutral / 9 ink / 1 accent.
2. **Proof before prose.** Numbers, icons and projects before paragraphs.
3. **Motion explains.** See `04-reveal-system.md`.
4. **Nothing hides behind hover.** Every action is visible and tappable on touch screens; hover only adds polish.
5. **Calm density.** Body lines under 62 characters, 16 to 17 px body, 120 px between sections (72 to 80 on phones), one idea per card.
6. **Accessible by default.** AA contrast, real `<button>` and `<a>`, labels, visible focus (2 px `--brand`, 3 px offset), one `h1`, reduced motion respected.

## Tokens

See `design/tokens.css` (light `:root`, dark `.dark`). Dark mode is a class on `<html>`; the design source calls it `dk`.

- Brand fill `#14866F` (light) / `#34D3A6` (dark) is for bars, dots, borders and large text. For small text on light use `--brandink` `#0E6B58` (6.4:1 on white).
- `--panel` (`#0B1118`, dark mode `#0F1A1C`) is the always-dark surface: AI card, contact band, footer. Text on it is `#F2F5F9`, secondary `#A5B1C0`, borders `#1D2733` and `#2A3644`. Accent on panel is `#34D3A6`.
- `--plate` puts monochrome logos (Next.js, Express, Hono, Vercel, GitHub, Cursor, Prisma) on a light chip in dark mode: `transparent` in light, `#F8FAFC` in dark. The AI card always uses a light plate.
- `--curtain` is the Reveal curtain colour. It equals the brand fill by default (teal confirmed by the owner) but is a separate token so it can change independently.
- Heatmap levels `--h0` to `--h4`.

## Type

| Role | Family | Size / line / weight / tracking |
| --- | --- | --- |
| Display (hero h1) | Poppins | 72 / 1.02 / 800 / -0.04em (mobile 44) |
| H2 section title | Poppins | 40 / 1.08 / 800 / -0.03em |
| H3 card title | Poppins | 22 to 30 / 1.2 / 700 / -0.02em |
| Body | Poppins | 16 to 17 / 1.65 to 1.75 / 400, colour `--ink2` |
| UI (buttons, nav, chips) | Poppins | 14 to 15 / 500 to 600 |
| Eyebrow, meta, counts, URLs | JetBrains Mono | 11.5 to 13 / uppercase, tracking .14em, colour `--brandink` or `--ink3` |

Load only Poppins 400, 500, 600, 700, 800 and JetBrains Mono 400, 500, latin subset, self-hosted. No Inter.

## Shape, space, depth

- Container 1160 px centred (page padding 60 at 1280). Section gap 120 px. Bento gap 16, project card gap 24.
- Radius: controls and chips 12, bento and info cards 22, project cards 24, pills and nav 999.
- Shadows only on hover and on primary buttons (`0 10px 24px -14px var(--ink)`); cards use a 1 px `--line` border.
- Background grid: 32 px lines `--gridline`, masked with a radial gradient so it fades out (never cuts off).

## Components (class names are from the HTML sources)

| Component | Spec |
| --- | --- |
| Primary button `.btn-p` | 48 h, padding 0 22, radius 12, 15/600, bg `--ink`, text `--bg`, icon 19 px gap 9; hover `translateY(-2px)` |
| Secondary `.btn-o` | same size, 1 px `--line` border on `--card`; hover border `--brand` |
| On-dark `.btn-b` | bg `#34D3A6`, text `#06241C` |
| Nav link `.nl` | 42 h, padding 0 16, radius 999, 14.5/500 `--ink2`; hover bg `--surface`; active bg `--brandsoft`, text `--brandink`, weight 600 |
| Icon button `.ib` | 44 x 44 round, 1 px `--line`, hover border `--brand` |
| Chip `.chip` | 46 h, padding 0 16 0 9, radius 12, 14/500; icon plate 30 px radius 8; hover lift 2 px + border `--brand` + soft brand shadow; **not clickable**, `cursor: default` |
| Pill `.pill` | 12.5/500, padding 5 11, bg `--pill`, text `--pillink` |
| Status pill | 13.5, bordered, radius 999, 8 px pulsing dot `--brand`, live time in mono |
| Bento card `.bc` | border `--line`, radius 22, padding 26, header with title 19/700 and mono count |
| Project card `.pc` | radius 24, border `--line`; hover `translateY(-4px)`, shadow `--shadow`, border `--brand`, image `scale(1.03)` |
| Eyebrow `.eb` | mono 12, uppercase, tracking .14em, `--brandink`, 28 px rule before the label |
| Section accent bar `.bar` | 56 x 4, radius 4, `--brand` (`draw` reveal) |
| Fields `.fld` | 48 h, radius 12, dark panel colours, focus: border `#34D3A6` + 3 px ring `rgba(52,211,166,.25)`; `<label>` above (13/500) |

## Page structure and sections

Order: nav, hero, proof strip, stack marquee, 01 Skills, 02 Projects (+ activity), 03 Education, 04 About, 05 Contact (dark), footer (dark). Each content section has: eyebrow `NN · label`, H2, accent bar, sub line, then content.

### Navbar
Floating pill, 1160 wide, 64 high, top margin 20, `position: sticky; top: 16px` (the mock is static), blur backdrop `--nav`. Left logo `<Towhid/Karim>` (20/800). Centre links with **scroll-spy**: an `IntersectionObserver` over `section[id]` marks the link of the section in view; sections have `scroll-margin-top: 96px`. Right: GitHub icon button, theme toggle, `Contact me` (primary, pill radius). Below 768 px: logo, theme toggle, menu button opening a sheet with the same links (44 px targets).

A 3 px `--brand` scroll-progress bar sits at the very top of the viewport (`transform: scaleX(progress)`, rAF-throttled scroll listener or `animation-timeline: scroll()` where supported).

### Hero
Grid `1.1fr .9fr`, gap 30, min-height 520 (no `vh`), margin-top 44. Left: status pill, "Hello there! I'm" 23/400, H1 name (curtain), role typewriter 22/600 `--brandink` with caret, paragraph (max 520), two buttons. Right: 500 x 500 illustration with a blurred teal glow and four floating chips (60 px, radius 16). The live time is client-rendered (Asia/Dhaka, `Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Dhaka' })`, tick every 30 s; SSR value `--:--` so cached HTML never shows stale time). Mobile: single column, name 44, buttons stacked full width at 52 h, illustration 330.

### Proof strip
4 cells in one bordered rounded (22) strip with dividers: value 34/800 (or 26 for words), label 14/500, detail 13.5 `--ink3`. Mobile 2 x 2 separate cards. The fourth cell has the pulsing live dot.

### Stack marquee
Pills 48 h with 28 px icon plate, 12 px gap, two identical tracks, 46 s linear loop, pause on hover, 8 % edge fade mask. Decorative: `aria-hidden` on the second track; the icons carry empty alt.

### 01 Skills (bento)
12-column grid, gap 16. Cells: Front End (cols 1-8), AI (cols 9-12, spans two rows, dark `--panel` card with soft teal radial corner glow), Back End (1-4), Database & ORMs (5-8), Tools & DevOps (1-12). Chips inside cards wrap (gap 10). Then `Core principles I deliver` row: four items (44 px brand-soft icon square + label 16/600) under a top border. Mobile: single column, cards stacked, chips wrap, principles 2 x 2.
AI card: sub line, the four loop pills (Prompt, Plan, Build, Review) that highlight in turn, then five chips.

### 02 Projects
Featured card: grid `1.15fr 1fr`, 380 px browser-chrome image area (real screenshot from R2, `loading="eager"`, `fetchpriority="high"` only if above the fold, otherwise lazy) and text column: `Featured` mono label, title 30/700 with a growing `--brand` line, summary, pills, three actions (View Details primary, Live demo secondary with arrow icon, GitHub icon button with `aria-label="Source code"`). Below: two-column cards (image 230 h). `View all projects` secondary button centred. Then the activity card (see copy). Whole card is clickable via the title link with a stretched pseudo-element; inner buttons stay independent. States: skeleton (3 cards), empty, error with retry. Mobile: single column, image 170-210 h, actions wrap, activity heatmap shows 24 weeks.

### 03 Education
Two cards: icon square, title 18/700, org, badge pill, big number 52/800, accent progress bar (grows once), check line, pills + `+N more`.

### 04 About
Grid `420px 1fr`, gap 72: photo (540 h, radius 28, 1 px border, location chip bottom-left) + Github/Facebook buttons under it; text column with two paragraphs (19 and 17), facts grid 2 x 2 (mono labels, 17/600 values) under 1 px rules.

### 05 Contact (always dark)
Full-bleed `--panel`, subtle teal radial gradient top right. Two columns: left eyebrow, H2 48/800, bar, sub, three rows (icon square, text, copy button on the email), social icon buttons; right form card (radius 24, border `#1D2733`, bg `#0E161E`) with Name, Email, Message, submit `.btn-b`. Include Turnstile. Inline field errors under inputs; success toast. Mobile: stacked.

### Footer
Panel, 84 px, three items spaced between: copyright, `BSc in CSE • CGPA 3.99 • Class of 2026`, `Back to top`.

## States and behaviour checklist

- Theme toggle cycles light / dark (system default). Class on `<html>` set by an inline script before paint; HTML is theme-agnostic so the edge cache never varies by theme (R-11).
- Copy email button: copies, swaps the icon to a check for 1.5 s, announces via `aria-live="polite"`.
- Resume buttons open or download the Google Drive links in `design/copy.md`.
- Project data loads on the server (loader); no client fetch on the public pages.
- Images: always explicit `width`/`height`, `loading="lazy"` except hero, `decoding="async"`. Icons in chips have empty `alt` (the label is adjacent text).
- Keyboard: skip link to `#main`; visible focus everywhere; `Esc` closes the mobile sheet.
- Contrast: body `--ink2` on `--bg` is 7.6:1; `--ink3` on `--bg` 4.8:1 (meta text only).

## What intentionally differs from the old site

Teal accent instead of neutral black; floating pill nav with scroll-spy and a Hire me button; live status pill; proof strip; stack marquee; bento skills with an AI card; always-visible project actions and a featured project; GitHub activity card; compact education cards; always-dark contact band; new About facts grid; curtain/rise/draw reveals instead of a curtain on everything; one `h1`.
