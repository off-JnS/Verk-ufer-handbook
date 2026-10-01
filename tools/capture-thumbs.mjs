// Regenerates the gallery thumbnails in assets/thumbs/ for the hub page.
//
// Usage (from the repo root, no package.json needed):
//   npx -y -p playwright node tools/capture-thumbs.mjs
//
// Serves the repo with python3's http.server, opens every demo once as a
// desktop and once as a phone, and writes <slug>-desktop.webp and
// <slug>-phone.webp. The WebP encoding is done by Chromium's own canvas, so
// no image tooling beyond Playwright is required.

import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'assets', 'thumbs');
const PORT = 8765;

// Keep in sync with the [data-demo] gallery cards in index.html.
const SLUGS = [
  'gastro-basic', 'friseur-basic', 'tischlerei-basic',
  'immobilien-professional', 'zahnarzt-professional', 'architektur-professional',
  'maritim-premium', 'windenergie-premium', 'aviation-premium',
  'ehsos-referenz'
];

const SHOTS = [
  // Displayed at up to ~480 CSS px in the gallery, so 960 covers 2x screens.
  { kind: 'desktop', viewport: { width: 1280, height: 800 }, scale: 1, isMobile: false, out: 960, q: 0.72 },
  // Shown as a small phone inset, ~110 CSS px wide.
  { kind: 'phone', viewport: { width: 390, height: 844 }, scale: 2, isMobile: true, out: 260, q: 0.78 }
];

const server = spawn('python3', ['-m', 'http.server', String(PORT), '--bind', '127.0.0.1'], {
  cwd: ROOT, stdio: 'ignore'
});
await new Promise((r) => setTimeout(r, 800));

// Uses the locally installed Google Chrome, so no browser download is needed.
// The GPU flags let headless Chrome render the WebGL globe on maritim-premium.
const browser = await chromium.launch({
  channel: 'chrome',
  args: ['--enable-gpu', '--use-angle=metal', '--ignore-gpu-blocklist', '--enable-unsafe-swiftshader']
});

// A blank page used only to re-encode PNG screenshots as WebP.
const encoder = await browser.newPage();

async function toWebp(png, width, quality) {
  const dataUrl = 'data:image/png;base64,' + png.toString('base64');
  const out = await encoder.evaluate(async ({ dataUrl, width, quality }) => {
    const img = new Image();
    img.src = dataUrl;
    await img.decode();
    const c = document.createElement('canvas');
    c.width = width;
    c.height = Math.round(img.height * width / img.width);
    const ctx = c.getContext('2d');
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, 0, 0, c.width, c.height);
    return c.toDataURL('image/webp', quality);
  }, { dataUrl, width, quality });
  return Buffer.from(out.split(',')[1], 'base64');
}

try {
  await mkdir(OUT, { recursive: true });
  for (const shot of SHOTS) {
    const context = await browser.newContext({
      viewport: shot.viewport,
      deviceScaleFactor: shot.scale,
      isMobile: shot.isMobile,
      hasTouch: shot.isMobile,
      reducedMotion: 'no-preference'
    });
    // Ehso's shows a consent banner on first visit; pretend it was answered.
    await context.addInitScript(() => {
      try { localStorage.setItem('ehsos_cookie_consent', 'rejected'); } catch (e) {}
    });
    for (const slug of SLUGS) {
      const page = await context.newPage();
      const url = `http://127.0.0.1:${PORT}/${slug}/index.html`;
      await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 }).catch(() => {});
      // Loaders dismiss after ~1.2 s; give hero animations time to settle.
      await page.waitForTimeout(2800);
      const png = await page.screenshot({ type: 'png' });
      const webp = await toWebp(png, shot.out, shot.q);
      const file = join(OUT, `${slug}-${shot.kind}.webp`);
      await writeFile(file, webp);
      console.log(`${slug}-${shot.kind}.webp  ${(webp.length / 1024).toFixed(0)} KB`);
      await page.close();
    }
    await context.close();
  }
} finally {
  await browser.close();
  server.kill();
}
