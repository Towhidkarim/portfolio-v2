// Experiment: rebuild the hero illustration in the app's palette with an AI-native scene.
// Usage: node build.mjs   (writes hero-b-light.svg and hero-b-dark.svg next to this file)
// Env: OUTDIR, TAG (file name suffix), NAVY (sweater colour override) for trying variants.
// The character and blob outline come from hero-original.svg (Freepik, already in the repo);
// the monitor, agent card and review card are drawn here.
//
// Story, one 6 s loop (matches the HTML Prompt/Plan/Build/Review pills elsewhere on the page):
//   0.0 s Prompt  | 1.5 s Plan: the reply streams in | 3.0 s Build: diff rows appear one by one
//   4.5 s Review: two checks tick | 6.0 s fade and restart. A short entrance plays once.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const src = fs.readFileSync(path.join(dir, 'hero-original.svg'), 'utf8');

const charStart = src.indexOf('<g id="freepik--Character');
const charEnd = src.indexOf('<defs');
const blobPath = src.match(/id="freepik--background-simple--inject-19"[^>]*><path d="([^"]+)"/)[1];

const palettes = {
  light: {
    outline: '#0B1118',
    frame: '#0B1118',
    sweater: '#CDEBE2',
    shoe: '#0E6B58',
    blobA: '#E3F4EE',
    blobB: '#BFE3D8',
    shadow: '#BFE3D8',
    win: '#0B1118',
    bar: '#141E29',
    dot: '#2A3644',
    card: '#FFFFFF',
    cardMut: '#CBD5E1',
    cardInk: '#0B1118',
    brand: '#14866F',
    mint: '#34D3A6',
    code: { w: '#E6EDF3', g: '#5B6B7D', t: '#34D3A6' },
    glow: 'rgba(52,211,166,.35)',
  },
  dark: {
    outline: '#25343F',
    frame: '#2F4450',
    sweater: '#BFE8DB',
    shoe: '#177A66',
    blobA: 'rgba(52,211,166,.22)',
    blobB: 'rgba(52,211,166,.06)',
    shadow: 'rgba(52,211,166,.14)',
    win: '#0F1A1C',
    bar: '#16242A',
    dot: '#34505A',
    card: '#F2F5F9',
    cardMut: '#A5B1C0',
    cardInk: '#0B1118',
    brand: '#14866F',
    mint: '#34D3A6',
    code: { w: '#E6EDF3', g: '#6B7F93', t: '#34D3A6' },
    glow: 'rgba(52,211,166,.4)',
  },
};

// four-point sparkle centred on (x, y) with radius r
const spark = (x, y, r, fill, cls = '') =>
  `<path class="${cls}" d="M${x} ${y - r}C${x + r * 0.15} ${y - r * 0.3} ${x + r * 0.3} ${y - r * 0.15} ${x + r} ${y}C${x + r * 0.3} ${y + r * 0.15} ${x + r * 0.15} ${y + r * 0.3} ${x} ${y + r}C${x - r * 0.15} ${y + r * 0.3} ${x - r * 0.3} ${y + r * 0.15} ${x - r} ${y}C${x - r * 0.3} ${y - r * 0.15} ${x - r * 0.15} ${y - r * 0.3} ${x} ${y - r}Z" fill="${fill}" style="transform-origin:${x}px ${y}px"/>`;

// Which code rows play which part of the loop (row index -> class).
const ADDED = { 4: 'add1', 5: 'add2', 6: 'add3' };
const REMOVED = 3;

function codeRows(p) {
  const c = p.code;
  // [indent, width, colour] segments per row; x origin 92
  const rows = [
    [[0, 22, c.g], [28, 54, c.w], [88, 34, c.t], [128, 70, c.g]],
    [[0, 34, c.t], [40, 26, c.w], [72, 80, c.g]],
    [[14, 48, c.w], [68, 30, c.t], [104, 64, c.g], [174, 48, c.w]],
    [[14, 62, c.g], [68, 40, c.w]],
    [[14, 40, c.w], [46, 56, c.t]],
    [[14, 70, c.g]],
    [[14, 46, c.w], [60, 52, c.t]],
    [[0, 18, c.t]],
    [[0, 30, c.g], [36, 52, c.w]],
    [[14, 58, c.t], [78, 34, c.w]],
    [[14, 40, c.g]],
    [[0, 12, c.g]],
  ];
  let out = '';
  rows.forEach((segs, i) => {
    const y = 150 + i * 15;
    const cls = i === REMOVED ? 'rem' : ADDED[i];
    let row = '';
    if (ADDED[i])
      row += `<rect x="84" y="${y - 4}" width="146" height="14" rx="3" fill="${p.mint}" fill-opacity=".16"/><rect x="84" y="${y - 4}" width="2.5" height="14" rx="1.2" fill="${p.mint}"/>`;
    if (i === REMOVED)
      row += `<rect x="84" y="${y - 4}" width="146" height="14" rx="3" fill="#F87171" fill-opacity=".14"/><rect x="84" y="${y - 4}" width="2.5" height="14" rx="1.2" fill="#F87171"/>`;
    segs.forEach(([dx, w, col]) => {
      row += `<rect x="${92 + dx}" y="${y}" width="${w}" height="6" rx="3" fill="${col}"${i === REMOVED ? ' fill-opacity=".55"' : ''}/>`;
    });
    if (i === REMOVED) row += `<rect x="106" y="${y + 2.4}" width="110" height="1.2" fill="#F87171" fill-opacity=".8"/>`;
    // untouched rows type in once at load; diff rows are part of the loop
    out += cls
      ? `<g class="il-${cls}">${row}</g>`
      : `<g class="il-type" style="animation-delay:${(0.1 + i * 0.07).toFixed(2)}s">${row}</g>`;
  });
  out += `<rect class="il-caret" x="${92 + 14 + 40 + 6 + 58}" y="${150 + 6 * 15 - 2}" width="3" height="10" rx="1.2" fill="${p.mint}"/>`;
  return out;
}

function recolourCharacter(p) {
  return src
    .slice(charStart, charEnd)
    .replace(/ class="animable[^"]*"/g, '')
    .replace(/rgb\(38, 50, 56\)/g, p.outline)
    // sweater and shoes share one source colour: shoes sit low (y > 405)
    .replace(/<(?:path|rect|ellipse)\b[^>]*>/g, (tag) => {
      if (!tag.includes('rgb(17, 20, 59)')) return tag;
      const m = tag.match(/ d="M\s*([\d.]+)[ ,]+([\d.]+)/);
      const y = m ? Number(m[2]) : 0;
      return tag.replace(/rgb\(17, 20, 59\)/g, y > 405 ? p.shoe : p.sweater);
    });
}

function build(name) {
  const p = { ...palettes[name] };
  if (process.env.NAVY) p.sweater = process.env.NAVY;
  const character = recolourCharacter(p);

  const stepsSvg = [0, 1, 2, 3]
    .map(
      (i) =>
        `<rect class="il-step" style="animation-delay:${i * 1.5 - 6}s" x="${270 + i * 34}" y="87" width="30" height="12" rx="6" fill="none" stroke="${p.cardMut}" stroke-width="1"/>`,
    )
    .join('');

  const tick = (cy) =>
    `<circle cx="66" cy="${cy}" r="7" fill="${p.mint}"/><path d="M62.5 ${cy}l2.6 2.6 4.6-5" stroke="${p.outline}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500" fill="none">
<style>
.il-caret{animation:il-blink 1s steps(1) infinite}
.il-step{animation:il-step 6s infinite}
.il-tw{animation:il-twinkle 3.2s ease-in-out infinite}
.il-tw2{animation:il-twinkle 3.2s ease-in-out -1.4s infinite}
.il-type{animation:il-typein .5s cubic-bezier(.2,.7,.2,1) backwards;transform-box:fill-box;transform-origin:left}
.il-card{animation:il-pop .6s cubic-bezier(.2,.7,.2,1) backwards;transform-box:fill-box;transform-origin:center}
.il-float{animation:il-float 6s ease-in-out infinite}
.il-float2{animation:il-float 7s ease-in-out -3s infinite}
.il-stream{animation:il-stream 6s cubic-bezier(.4,0,.2,1) infinite}
.il-reply2{animation:il-fade 6s linear infinite}
.il-add1{animation:il-on 6s linear infinite backwards}
.il-add2{animation:il-on2 6s linear infinite backwards}
.il-add3{animation:il-on3 6s linear infinite backwards}
.il-rem{animation:il-rem 6s linear infinite backwards}
.il-chk1{animation:il-chk1 6s linear infinite backwards}
.il-chk2{animation:il-chk2 6s linear infinite backwards}
.il-chk1,.il-chk2{transform-box:fill-box;transform-origin:center}
@keyframes il-blink{0%,49%{opacity:1}50%,100%{opacity:0}}
@keyframes il-step{0%,20%{fill:${p.mint};stroke:${p.mint}}26%,100%{fill:transparent;stroke:${p.cardMut}}}
@keyframes il-twinkle{0%,100%{opacity:.35;transform:scale(.7)}50%{opacity:1;transform:scale(1)}}
@keyframes il-typein{from{opacity:0;transform:scaleX(.2)}to{opacity:1;transform:none}}
@keyframes il-pop{from{opacity:0;transform:translateY(8px) scale(.94)}to{opacity:1;transform:none}}
@keyframes il-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
@keyframes il-stream{0%,22%{width:0}46%,96%{width:100px}100%{width:0}}
@keyframes il-fade{0%,50%{opacity:0}56%,96%{opacity:1}100%{opacity:0}}
@keyframes il-rem{0%,44%{opacity:0}48%,96%{opacity:1}100%{opacity:0}}
@keyframes il-on{0%,50%{opacity:0}53%,96%{opacity:1}100%{opacity:0}}
@keyframes il-on2{0%,55%{opacity:0}58%,96%{opacity:1}100%{opacity:0}}
@keyframes il-on3{0%,60%{opacity:0}63%,96%{opacity:1}100%{opacity:0}}
@keyframes il-chk1{0%,74%{opacity:0;transform:scale(.6)}78%,96%{opacity:1;transform:none}100%{opacity:0}}
@keyframes il-chk2{0%,84%{opacity:0;transform:scale(.6)}88%,96%{opacity:1;transform:none}100%{opacity:0}}
@media (prefers-reduced-motion:reduce){*{animation:none!important}.il-stream{width:100px}}
</style>
<defs>
<linearGradient id="blob" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${p.blobA}"/><stop offset="1" stop-color="${p.blobB}"/></linearGradient>
<radialGradient id="glow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="${p.glow}"/><stop offset="1" stop-color="${p.glow}" stop-opacity="0"/></radialGradient>
</defs>
<path d="${blobPath}" fill="url(#blob)"/>
<ellipse cx="300" cy="298" rx="150" ry="120" fill="url(#glow)"/>
<ellipse cx="318" cy="448" rx="102" ry="14" fill="${p.shadow}"/>

<!-- monitor / editor -->
<rect x="69.5" y="111.5" width="361" height="224" rx="20" fill="${p.win}" stroke="${p.frame}" stroke-width="1.1"/>
<path d="M69.5 137.5V131.5A20 20 0 0 1 89.5 111.5H410.5A20 20 0 0 1 430.5 131.5V137.5Z" fill="${p.bar}"/>
<circle cx="90" cy="124.5" r="3" fill="${p.dot}"/><circle cx="102" cy="124.5" r="3" fill="${p.dot}"/><circle cx="114" cy="124.5" r="3" fill="${p.dot}"/>
<rect x="130" y="117" width="72" height="15" rx="7.5" fill="#1B2A33"/><circle cx="141" cy="124.5" r="2.4" fill="${p.mint}"/><rect x="149" y="122.5" width="40" height="4" rx="2" fill="${p.code.g}"/>
${codeRows(p)}

<!-- agent card -->
<g class="il-float"><g class="il-card" style="animation-delay:.35s">
<rect x="254" y="46" width="170" height="104" rx="16" fill="${p.card}" stroke="${p.outline}" stroke-width="1.1"/>
${spark(274, 66, 8, p.brand, 'il-tw')}
<rect x="288" y="62" width="46" height="7" rx="3.5" fill="${p.cardInk}"/>
<circle cx="404" cy="66" r="4" fill="${p.mint}"/>
${stepsSvg}
<rect x="270" y="112" width="130" height="24" rx="8" fill="${p.mint}" fill-opacity=".14"/>
<rect class="il-stream" x="278" y="120" width="100" height="4" rx="2" fill="${p.brand}"/>
<rect class="il-reply2" x="278" y="127" width="64" height="4" rx="2" fill="${p.brand}" fill-opacity=".55"/>
</g></g>

<!-- review card -->
<g class="il-float2"><g class="il-card" style="animation-delay:.55s">
<rect x="46" y="318" width="146" height="64" rx="14" fill="${p.card}" stroke="${p.outline}" stroke-width="1.1"/>
<g class="il-chk1">${tick(338)}</g><rect x="80" y="335" width="84" height="6" rx="3" fill="${p.cardInk}"/>
<g class="il-chk2">${tick(362)}</g><rect x="80" y="359" width="58" height="6" rx="3" fill="${p.cardMut}"/>
</g></g>

<!-- code badge -->
<g transform="translate(352 196)"><rect width="42" height="26" rx="8" fill="${p.card}" stroke="${p.outline}" stroke-width="1.1"/><path d="M15 8l-5 5 5 5M27 8l5 5-5 5M22.5 6l-3 14" stroke="${p.outline}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></g>

${spark(40, 96, 11, p.mint, 'il-tw')}
${spark(466, 300, 8, p.mint, 'il-tw2')}
${spark(212, 34, 6, p.brand, 'il-tw2')}

<g>${character}</g>
</svg>
`;
}

for (const name of ['light', 'dark']) {
  fs.writeFileSync(
    path.join(process.env.OUTDIR || dir, `hero-b${process.env.TAG || ''}-${name}.svg`),
    build(name),
  );
}
console.log('written');
