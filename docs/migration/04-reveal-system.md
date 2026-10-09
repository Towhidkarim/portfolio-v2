# Reveal system

Refines the owner's `components/framer/Reveal.tsx`. Visual reference: `design/screens/h5-reveal.png` and `design/source/h5-reveal.html` (open it: the three demos loop every 7 s). Curtain filmstrip: `design/screens/h5-curtain-frame-1.png` to `-5.png` (t = 0.25, 0.6, 0.95, 1.5, 3 s).

## Philosophy

1. **Content first.** Text is readable without JavaScript and before hydration. Motion is an enhancement, never a gate.
2. **One signature, used sparingly.** The curtain is for page-defining moments (hero name, section titles, featured project image): about 7 per page, at most one in view at a time. Everything else rises quietly or stays still.
3. **Cheap.** Animate only `transform`, `opacity` and `clip-path`; one shared `IntersectionObserver` for the page; play once.
4. **Directional meaning.** The curtain wipes left to right, the reading direction, in the brand teal.
5. **Respect the viewer.** Reduced motion turns the curtain into a 150 ms fade.
6. **Progressive.** Above the fold the hero plays one timed sequence on load (CSS only). Below the fold each element reveals the first time it scrolls into view; siblings in a group follow 60 ms apart. Scroll back up and nothing replays.

## What was wrong with the old component

| Old | Problem | New |
| --- | --- | --- |
| Starts `opacity: 0` with a full curtain, revealed only after hydration | Text invisible if JS is slow or blocked; hurts LCP | Hidden state exists only under `html.js` (set by an inline script), and never for above-the-fold content |
| Curtain animates `width` | Layout every frame | `scaleX` transform |
| Per instance: two `useAnimation`, one `useInView` | ~40 observers and 80 controllers | One observer, data attributes |
| `w-fit overflow-hidden` wrapper | Alters layout, clips focus rings and shadows | No wrapper; the element itself is revealed |
| Black curtain on every paragraph | No hierarchy | Teal curtain on ~7 elements; `rise` elsewhere |
| No reduced motion | Accessibility gap | Handled in CSS |

## Variants

| Variant | Use for | Motion |
| --- | --- | --- |
| `curtain` | Hero name, the four section titles, featured project image | Teal block scales in from the left (0 to 450 ms), content swaps beneath at full cover (450 ms), block exits to the right (450 to 900 ms). Ease `cubic-bezier(.7, 0, .2, 1)` on each half |
| `rise` | Paragraphs, cards, chips, stats | Opacity 0 to 1 and 12 px lift over 0.7 s, ease `cubic-bezier(.2, .7, .2, 1)`; stagger 60 ms per `index`, capped at 0.36 s |
| `draw` | Accent bars, project underline, CGPA bar | `scaleX(0)` to `1` from the left over 0.9 s |

## Usage map

| Element | Variant | Trigger | Delay |
| --- | --- | --- | --- |
| Hero status pill | rise | load | 0 s |
| Hero "Hello there! I'm" | rise | load | 0.1 s |
| Hero name (h1) | curtain | load | 0.25 s |
| Role typewriter line | rise | load | 0.34 s |
| Hero paragraph | rise | load | 0.42 s |
| Hero buttons | rise | load | 0.48 s |
| Hero illustration | rise | load | 0.25 s |
| Proof strip cells | rise | in view | 0.55 s + 0.08 s x index (load, it is above the fold at 1280x800) |
| Section titles (Skills, My Projects, Education, About Me) | curtain | in view | 0 |
| Section accent bars | draw | in view | 0.2 s |
| Skills bento cards, project cards, education cards | rise | in view | index x 0.06 s |
| Skill chips | none (cards reveal as a unit) | | |
| Featured project image | curtain | in view | 0.1 s |
| Activity heatmap | CSS `pop` per column | in view | column x 22 ms |
| Contact band content | rise | in view | 0 |
| Everything else | none | | |

Budget check (automated in Phase 3): `document.querySelectorAll('[data-reveal="curtain"]').length <= 8` on every page.

## Implementation

Files: `src/components/reveal/reveal.tsx`, `reveal-init.ts` (string constant injected inline in `<head>`), `src/styles/reveal.css`, `src/components/reveal/reveal-scan.tsx`.

> **PENDING RESEARCH R-10**: how to inject an inline script in `<head>` from Start's root route `head()`. **R-16**: whether `data-in` added by script before hydration warns; `suppressHydrationWarning` is included as a precaution. **R-11**: theme script lives next to this one.

### `reveal.tsx` (UNVERIFIED against Start; plain React)

```tsx
import type { CSSProperties, ElementType, ComponentPropsWithoutRef, ReactNode } from 'react';

type Variant = 'rise' | 'curtain' | 'draw';

type Props<T extends ElementType> = {
  as?: T;
  variant?: Variant;
  delay?: number;      // seconds
  index?: number;      // stagger position inside a group
  immediate?: boolean; // above the fold: play on load without the observer
  className?: string;
  children?: ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'children' | 'className'>;

const STAGGER = 0.06;
const STAGGER_CAP = 0.36;

export function Reveal<T extends ElementType = 'div'>({
  as, variant = 'rise', delay = 0, index = 0, immediate = false, className, children, ...rest
}: Props<T>) {
  const Tag = (as ?? 'div') as ElementType;
  const d = delay + Math.min(index * STAGGER, STAGGER_CAP);
  const style = { '--d': `${d}s` } as CSSProperties;
  const attrs = {
    'data-reveal': variant,
    ...(immediate ? { 'data-in': '' } : {}),
    style, className, suppressHydrationWarning: true, ...rest,
  };
  return variant === 'curtain'
    ? <Tag {...attrs}><span className="rv-c">{children}</span></Tag>
    : <Tag {...attrs}>{children}</Tag>;
}
```

Usage: `<Reveal as="h2" variant="curtain" className="h2">Skills</Reveal>`, `<Reveal index={i}>{card}</Reveal>`, `<Reveal as="h1" variant="curtain" immediate delay={0.25}>Towhid Karim</Reveal>`.

### `reveal-init.ts` (inline, about 400 bytes minified)

```ts
export const revealInit = `(function(){var d=document.documentElement;d.classList.add('js');
if(!('IntersectionObserver' in window)){d.classList.add('no-io');return}
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.setAttribute('data-in','');io.unobserve(e.target)}})},{rootMargin:'0px 0px -12% 0px',threshold:0.01});
function scan(){document.querySelectorAll('[data-reveal]:not([data-in])').forEach(function(el){io.observe(el)})}
window.__revealScan=scan;
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',scan);else scan()})();`;
```

CSS must treat `.no-io` as "everything visible": `html.js:not(.no-io) ...` guards the hidden states below.

### `reveal-scan.tsx`

Re-runs the scan after each client navigation. Render once inside the root layout.

```tsx
import { useEffect } from 'react';
import { useRouterState } from '@tanstack/react-router'; // UNVERIFIED import and selector
export function RevealScan() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  useEffect(() => { (window as any).__revealScan?.(); }, [path]);
  return null;
}
```

### `reveal.css`

```css
:root { --reveal-ease: cubic-bezier(.2,.7,.2,1); --curtain-ease: cubic-bezier(.7,0,.2,1); }

/* ---- keyframes ---- */
@keyframes rv-cwipe {
  0%     { transform: scaleX(0); transform-origin: left;  animation-timing-function: var(--curtain-ease); }
  50%    { transform: scaleX(1); transform-origin: left; }
  50.01% { transform: scaleX(1); transform-origin: right; animation-timing-function: var(--curtain-ease); }
  100%   { transform: scaleX(0); transform-origin: right; }
}
@keyframes rv-ccont { 0%, 49.9% { opacity: 0 } 50%, 100% { opacity: 1 } }

/* ---- shared base (transitions always present so the data-in flip animates) ---- */
[data-reveal="rise"] { transition: opacity .7s var(--reveal-ease), transform .7s var(--reveal-ease); transition-delay: var(--d, 0s); }
[data-reveal="draw"] { transform-origin: left; transition: transform .9s var(--reveal-ease); transition-delay: var(--d, 0s); }
[data-reveal="curtain"] { position: relative; display: inline-block; }
[data-reveal="curtain"]::after {
  content: ""; position: absolute; inset: .05em -.12em .02em -.12em;
  background: var(--brand); border-radius: .12em; transform: scaleX(0); pointer-events: none;
}

/* ---- motion allowed ---- */
@media (prefers-reduced-motion: no-preference) {
  /* hidden-until-observed state exists only when JS is on and the observer exists */
  html.js:not(.no-io) [data-reveal="rise"]:not([data-in]) { opacity: 0; transform: translateY(12px); }
  html.js:not(.no-io) [data-reveal="draw"]:not([data-in]) { transform: scaleX(0); }
  html.js:not(.no-io) [data-reveal="curtain"]:not([data-in]) > .rv-c { opacity: 0; }

  /* curtain plays when data-in is present (server-set for immediate, observer-set otherwise) */
  [data-reveal="curtain"][data-in]::after { animation: rv-cwipe .9s linear both; animation-delay: var(--d, 0s); }
  [data-reveal="curtain"][data-in] > .rv-c { animation: rv-ccont .9s linear both; animation-delay: var(--d, 0s); }

  /* above the fold without JS: immediate rise plays as a CSS animation */
  [data-reveal="rise"][data-in] { animation: rv-rise .85s var(--reveal-ease) both; animation-delay: var(--d, 0s); }
}
@keyframes rv-rise { from { opacity: 0; transform: translateY(14px) } to { opacity: 1; transform: none } }

/* ---- reduced motion: no curtain, 150 ms fade ---- */
@media (prefers-reduced-motion: reduce) {
  [data-reveal="curtain"]::after { display: none; }
  [data-reveal] { transition: opacity .15s linear; }
  html.js:not(.no-io) [data-reveal]:not([data-in]) { opacity: 0; }
  [data-reveal="draw"] { transform: none; }
}
```

Note: the `rise` elements flagged `immediate` get `data-in` in server HTML, so they run `rv-rise` on first paint with no script. Below-the-fold `rise` elements use the transition path (class flip from the observer). Check there is no double animation: the `[data-in]` animation rule applies to both; to avoid replaying for observer-revealed elements, scope the animation rule to `[data-reveal="rise"][data-immediate]` instead and set `data-immediate` together with `data-in` in the component when `immediate` is true. (Adjust the component and CSS accordingly during Phase 3.)

## Hero extras (CSS only, in `src/styles/motion.css`)

- **Typewriter, two phrases** ("A Full-Stack Engineer", "Crafting Scalable Apps with React & Next.js"), 14 s loop. Each phrase is a `.ph` in a one-cell grid; its text has `clip-path: inset(0 100% 0 0)` animating to `inset(0 0 0 0)` with `steps(N)` where N is the character count (21 and 43; pass as `--n` and use `steps(var(--n), end)`); caret is an absolutely positioned bar whose `left` animates 0 to 100% with the same steps and blinks via an inner element. Phrase B starts at +7 s. Reference CSS: classes `.role`, `.ph`, `.cr`, keyframes `pa` and `ca` in `design/source/h1-desktop.html`. Reduced motion: show phrase A statically, hide the caret.
- **Floating chips** (React, Tailwind, Next.js, TypeScript): `translateY(0)` to `-12px`, ease-in-out infinite alternate, **fixed** per-chip duration and delay (6 s/0, 7 s/-2, 5.5 s/-1, 6.5 s/-3). No `Math.random()`.
- **Status pill pulse**: box-shadow ripple 2.2 s infinite.
- **Glow**: one soft radial teal glow behind the illustration, drifting 12 s.
- **Marquee**: `translateX(0 to -50%)` over 46 s linear, content duplicated, pauses on hover, edge-faded with a CSS mask.
- **AI loop**: four pills (Prompt, Plan, Build, Review) highlight in turn, 1.5 s each, 6 s cycle.
- **Heatmap**: cells `pop` in column by column, 22 ms stagger.

All of these must be disabled under `prefers-reduced-motion: reduce` (the design source shows the exact rule).

## Acceptance criteria

1. With JavaScript disabled, every revealed element is visible and readable.
2. With `prefers-reduced-motion: reduce`, no curtain renders and elements fade in over 150 ms or are simply visible.
3. Lighthouse and a manual run show no layout shift from Reveal (CLS 0 attributable).
4. DevTools Performance: the reveal animations use compositor-only properties (no layout or paint per frame).
5. `[data-reveal="curtain"]` count per page is 8 or fewer; there is never more than one curtain in the first viewport after load.
6. Client navigation between `/` and `/all-projects` reveals new elements (re-scan works) and does not replay old ones.
7. `framer-motion` is absent from the public route bundle (check the build manifest).
