// Runs axe-core (WCAG 2 A/AA rules) on pages in light and dark mode, after scrolling
// so reveal-gated content is visible.
//
//   node scripts/check-a11y.mjs [baseUrl] [path ...]    # default http://localhost:4173 /styleguide /login
// On Windows Git Bash prefix with MSYS_NO_PATHCONV=1 so "/path" is not rewritten.
import AxeBuilder from '@axe-core/playwright';
import { chromium } from 'playwright';

const args = process.argv.slice(2);
const base = args[0]?.startsWith('http')
  ? args.shift()
  : 'http://localhost:4173';
const paths = args.length ? args : ['/styleguide', '/login'];

const browser = await chromium.launch();
let violations = 0;

for (const path of paths) {
  for (const scheme of ['light', 'dark']) {
    const ctx = await browser.newContext({
      colorScheme: scheme,
      reducedMotion: 'reduce',
      viewport: { width: 1280, height: 900 },
    });
    const page = await ctx.newPage();
    await page.goto(base + path, { waitUntil: 'networkidle' });
    const h = await page.evaluate(() => document.body.scrollHeight);
    for (let y = 0; y < h; y += 500) {
      await page.evaluate((yy) => window.scrollTo(0, yy), y);
      await page.waitForTimeout(80);
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(600);
    const result = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    violations += result.violations.length;
    console.log(
      `${result.violations.length ? 'FAIL' : 'PASS'}  ${path} (${scheme}): ${result.violations.length} violations`,
    );
    for (const v of result.violations) {
      console.log(`   ${v.impact}  ${v.id}: ${v.help}`);
      for (const n of v.nodes.slice(0, 3))
        console.log(
          `      ${n.target.join(' ')}  ${n.failureSummary?.split('\n')[1] ?? ''}`,
        );
    }
    await ctx.close();
  }
}

await browser.close();
process.exit(violations ? 1 : 0);
