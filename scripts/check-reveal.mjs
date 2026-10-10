// Automated checks for the Reveal system, theming, fonts and layout (Phase 3).
//
//   bun run build && bun run preview -- --port 4173      # in another terminal
//   node scripts/check-reveal.mjs [baseUrl] [path ...]    # default http://localhost:4173 /styleguide
//
// Criteria (docs/migration/04-reveal-system.md):
//   1  with JavaScript disabled every revealed element is visible
//   2  with prefers-reduced-motion there is no curtain, elements are visible
//   5  at most 8 curtains per page, at most one in the first viewport at load
// plus: theme-agnostic server HTML, no flash of the wrong theme class, no Google
// Fonts requests, Poppins preloads, no hydration warnings, no horizontal overflow.
import { chromium } from 'playwright';

const args = process.argv.slice(2);
const base = args[0]?.startsWith('http')
  ? args.shift()
  : 'http://localhost:4173';
const paths = args.length ? args : ['/styleguide'];

const results = [];
const check = (name, ok, detail = '') => {
  results.push({ name, ok });
  console.log(
    `${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? `  (${detail})` : ''}`,
  );
};

const browser = await chromium.launch();

for (const path of paths) {
  console.log(`\n== ${path}`);

  // 1. JavaScript disabled: everything revealed must be visible
  {
    const ctx = await browser.newContext({ javaScriptEnabled: false });
    const page = await ctx.newPage();
    await page.goto(base + path, { waitUntil: 'load' });
    const hidden = await page.evaluate(() =>
      [...document.querySelectorAll('[data-reveal]')]
        .filter((el) => {
          const cs = getComputedStyle(el);
          const target =
            el.getAttribute('data-reveal') === 'curtain'
              ? (el.querySelector('.rv-c') ?? el)
              : el;
          return (
            Number(getComputedStyle(target).opacity) < 1 ||
            cs.visibility === 'hidden'
          );
        })
        .map((el) => el.outerHTML.slice(0, 80)),
    );
    // elements that animate on first paint start at opacity 0 for a moment; wait it out
    await page.waitForTimeout(1500);
    const stillHidden = await page.evaluate(
      () =>
        [...document.querySelectorAll('[data-reveal]')].filter((el) => {
          const target =
            el.getAttribute('data-reveal') === 'curtain'
              ? (el.querySelector('.rv-c') ?? el)
              : el;
          return Number(getComputedStyle(target).opacity) < 1;
        }).length,
    );
    check(
      '1  JS disabled: all [data-reveal] visible',
      stillHidden === 0,
      `${hidden.length} on first frame, ${stillHidden} after 1.5 s`,
    );
    await ctx.close();
  }

  // 2. Reduced motion: no curtain overlay, elements revealed
  {
    const ctx = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    await page.goto(base + path, { waitUntil: 'networkidle' });
    const h = await page.evaluate(() => document.body.scrollHeight);
    for (let y = 0; y < h; y += 500) {
      await page.evaluate((yy) => window.scrollTo(0, yy), y);
      await page.waitForTimeout(80);
    }
    await page.waitForTimeout(500);
    const info = await page.evaluate(() => {
      const curtains = [
        ...document.querySelectorAll('[data-reveal="curtain"]'),
      ];
      return {
        curtains: curtains.length,
        overlays: curtains.filter(
          (el) => getComputedStyle(el, '::after').display !== 'none',
        ).length,
        invisible: [...document.querySelectorAll('[data-reveal]')].filter(
          (el) => Number(getComputedStyle(el).opacity) < 1,
        ).length,
      };
    });
    check(
      '2  reduced motion: no curtain overlay',
      info.overlays === 0,
      `${info.curtains} curtains, ${info.overlays} overlays`,
    );
    check(
      '2  reduced motion: everything visible after scrolling',
      info.invisible === 0,
      `${info.invisible} hidden`,
    );
    await ctx.close();
  }

  // 5 + hydration, fonts, theme, overflow
  for (const width of [1280, 390]) {
    const ctx = await browser.newContext({
      viewport: { width, height: 800 },
      colorScheme: width === 1280 ? 'dark' : 'light',
    });
    const page = await ctx.newPage();
    const problems = [];
    const requests = [];
    page.on('console', (m) => {
      if (['error', 'warning'].includes(m.type()))
        problems.push(m.text().slice(0, 200));
    });
    page.on('pageerror', (e) => problems.push(e.message.slice(0, 200)));
    page.on('request', (r) => requests.push(r.url()));
    await page.addInitScript(() => {
      // record the theme class the moment the first frame is about to paint
      window.__themeAtFirstFrame = null;
      requestAnimationFrame(() => {
        window.__themeAtFirstFrame =
          document.documentElement.classList.contains('dark');
      });
    });
    await page.goto(base + path, { waitUntil: 'networkidle' });

    const counts = await page.evaluate(() => {
      const curtains = [
        ...document.querySelectorAll('[data-reveal="curtain"]'),
      ];
      const inView = curtains.filter((el) => {
        const r = el.getBoundingClientRect();
        return r.top < innerHeight && r.bottom > 0;
      });
      return {
        total: curtains.length,
        firstViewport: inView.length,
        overflow:
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth,
        dark: document.documentElement.classList.contains('dark'),
        atFirstFrame: window.__themeAtFirstFrame,
      };
    });
    check(
      `5  curtains per page <= 8 (${width}px)`,
      counts.total <= 8,
      `${counts.total}`,
    );
    check(
      `5  at most one curtain in the first viewport (${width}px)`,
      counts.firstViewport <= 1,
      `${counts.firstViewport}`,
    );
    check(
      `   no horizontal overflow (${width}px)`,
      counts.overflow <= 0,
      `${counts.overflow}px`,
    );
    check(
      `   no hydration/console problems (${width}px)`,
      problems.length === 0,
      problems.join(' | '),
    );
    if (width === 1280) {
      check(
        '   dark scheme applies the dark class before first paint',
        counts.dark && counts.atFirstFrame === true,
        `final=${counts.dark} firstFrame=${counts.atFirstFrame}`,
      );
      const google = requests.filter((u) =>
        /fonts\.(googleapis|gstatic)\.com/.test(u),
      );
      check(
        '   no Google Fonts requests',
        google.length === 0,
        google.join(', '),
      );
      const preloads = await page.evaluate(() =>
        [...document.querySelectorAll('link[rel="preload"][as="font"]')].map(
          (l) => l.getAttribute('href'),
        ),
      );
      check(
        '   Poppins 400 and 800 preloaded',
        preloads.some((h) => /poppins-latin-400/.test(h)) &&
          preloads.some((h) => /poppins-latin-800/.test(h)),
        preloads.length + ' preloads',
      );
    }
    await ctx.close();
  }

  // server HTML does not depend on the visitor's theme
  {
    const norm = (s) => s.replace(/u:\d+/g, 'u:0');
    const get = async (headers) =>
      norm(await (await fetch(base + path, { headers })).text());
    const [a, b] = await Promise.all([
      get({ 'sec-ch-prefers-color-scheme': 'light', cookie: 'theme=light' }),
      get({ 'sec-ch-prefers-color-scheme': 'dark', cookie: 'theme=dark' }),
    ]);
    check('   server HTML identical for light and dark visitors', a === b);
    check(
      '   server HTML has no dark class',
      !/<html[^>]*class="[^"]*dark/.test(a),
    );
  }
}

await browser.close();
const failed = results.filter((r) => !r.ok);
console.log(
  `\n${results.length - failed.length}/${results.length} checks passed`,
);
process.exit(failed.length ? 1 : 0);
