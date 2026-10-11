// Renders the sales video in assets/video/ from tools/video/storyboard.html.
//
// Usage (from the repo root):
//   npm i --no-save playwright ffmpeg-static
//   node tools/render-video.mjs            # stills + video + poster
//   node tools/render-video.mjs --stills   # only re-capture the demo stills
//   node tools/render-video.mjs --video    # only re-render, reuse the stills
//   node tools/render-video.mjs --preview 4.6,12,36   # PNG frames to tools/video/stills/preview/
//
// Step 1 captures full-page stills of the demos (desktop 1280 px wide and
// phone 390 px @2x) into tools/video/stills/, with prefers-reduced-motion so
// every scroll reveal is already visible. Step 2 opens the storyboard at
// 1920x1080, seeks its Web Animations timeline frame by frame and pipes the
// screenshots into ffmpeg (H.264, yuv420p, faststart — plays everywhere,
// including iOS Safari). The storyboard is fully deterministic: no clock,
// no requestAnimationFrame, every frame is a pure function of its time.
//
// ffmpeg comes from the ffmpeg-static package, or from $FFMPEG / PATH.

import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const STILLS = join(ROOT, 'tools', 'video', 'stills');
const OUT = join(ROOT, 'assets', 'video');
const PORT = 8766;
const FPS = 30;

const argv = process.argv.slice(2);
const args = new Set(argv);
const previewAt = args.has('--preview') ? argv[argv.indexOf('--preview') + 1].split(',').map(Number) : null;
const doStills = !args.has('--video') && !previewAt;
const doVideo = !args.has('--stills') && !previewAt;

function ffmpegPath() {
  if (process.env.FFMPEG) return process.env.FFMPEG;
  try { return createRequire(import.meta.url)('ffmpeg-static'); } catch { return 'ffmpeg'; }
}
const FFMPEG = ffmpegPath();

// Keep in sync with the image paths used in storyboard.html.
const DESKTOP = ['gastro-basic', 'zahnarzt-professional', 'maritim-premium', 'ehsos-referenz'];
const PHONE = ['friseur-basic', 'tischlerei-basic', 'immobilien-professional', 'windenergie-premium'];
const MAX_H = { desktop: 3200, phone: 3600 };

const server = spawn('python3', ['-m', 'http.server', String(PORT), '--bind', '127.0.0.1'], {
  cwd: ROOT, stdio: 'ignore'
});
await new Promise((r) => setTimeout(r, 800));

const browser = await chromium.launch({
  channel: 'chrome',
  args: ['--enable-gpu', '--use-angle=metal', '--ignore-gpu-blocklist', '--enable-unsafe-swiftshader']
});

try {
  if (doStills) await captureStills();
  if (doVideo) await renderVideo();
  if (previewAt) await renderPreview(previewAt);
} finally {
  await browser.close();
  server.kill();
}

async function captureStills() {
  await mkdir(STILLS, { recursive: true });
  const meta = {};
  const jobs = [
    ...DESKTOP.map((slug) => ({ slug, kind: 'desktop', viewport: { width: 1280, height: 800 }, scale: 1, isMobile: false })),
    ...PHONE.map((slug) => ({ slug, kind: 'phone', viewport: { width: 390, height: 844 }, scale: 2, isMobile: true }))
  ];
  for (const job of jobs) {
    const ctx = await browser.newContext({
      viewport: job.viewport,
      deviceScaleFactor: job.scale,
      isMobile: job.isMobile,
      hasTouch: job.isMobile,
      reducedMotion: 'reduce'
    });
    const page = await ctx.newPage();
    await page.goto(`http://127.0.0.1:${PORT}/${job.slug}/index.html`, { waitUntil: 'networkidle' });
    // Ehso's shows a cookie banner after a short delay; decline it so it
    // does not cover the hero.
    if (job.slug === 'ehsos-referenz') {
      await page.getByRole('button', { name: /ablehnen/i }).first().click({ timeout: 6000 }).catch(() => {});
    }
    // Walk down the page once so lazy images load, then return to the top.
    await page.evaluate(async () => {
      for (let y = 0; y < document.documentElement.scrollHeight; y += 600) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 120));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1800);
    const info = await page.evaluate(() => {
      const k = document.querySelector('#kontakt');
      return {
        height: document.documentElement.scrollHeight,
        kontakt: k ? Math.round(k.getBoundingClientRect().top + window.scrollY) : null
      };
    });
    const height = Math.min(info.height, MAX_H[job.kind]);
    const file = `${job.slug}-${job.kind}.jpg`;
    await page.screenshot({
      path: join(STILLS, file),
      type: 'jpeg',
      quality: 86,
      fullPage: true,
      clip: { x: 0, y: 0, width: job.viewport.width, height }
    });
    meta[file] = { width: job.viewport.width, height, kontakt: info.kontakt };
    console.log(`still  ${file}  ${job.viewport.width}x${height}`);
    await ctx.close();
  }
  await writeFile(join(STILLS, 'meta.json'), JSON.stringify(meta, null, 2));
}

function ffmpeg(argv) {
  const p = spawn(FFMPEG, ['-hide_banner', '-loglevel', 'error', '-y', ...argv], { stdio: ['pipe', 'inherit', 'inherit'] });
  const done = new Promise((res, rej) => p.on('close', (c) => (c === 0 ? res() : rej(new Error(`ffmpeg exited ${c}`)))));
  return { stdin: p.stdin, done };
}

async function write(stream, buf) {
  if (!stream.write(buf)) await new Promise((r) => stream.once('drain', r));
}

async function openStoryboard() {
  const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => console.error('storyboard:', e.message));
  await page.goto(`http://127.0.0.1:${PORT}/tools/video/storyboard.html`, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => window.STORYBOARD_READY === true);
  return { ctx, page };
}

async function renderPreview(times) {
  const dir = join(STILLS, 'preview');
  await mkdir(dir, { recursive: true });
  const { ctx, page } = await openStoryboard();
  for (const t of times) {
    await page.evaluate((t) => window.seek(t), t);
    await page.screenshot({ path: join(dir, `t${t}.png`) });
  }
  console.log(`preview  ${times.length} frames in tools/video/stills/preview/`);
  await ctx.close();
}

async function renderVideo() {
  await mkdir(OUT, { recursive: true });
  const { ctx, page } = await openStoryboard();
  const { duration, poster } = await page.evaluate(() => ({ duration: window.DURATION, poster: window.POSTER_TIME }));
  const frames = Math.round(duration * FPS);

  const enc = ffmpeg([
    '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '21', '-tune', 'animation',
    '-pix_fmt', 'yuv420p', '-profile:v', 'high', '-movflags', '+faststart',
    join(OUT, 'verkaufsvideo.mp4')
  ]);
  const t0 = Date.now();
  for (let i = 0; i < frames; i++) {
    await page.evaluate((t) => window.seek(t), i / FPS);
    await write(enc.stdin, await page.screenshot({ type: 'jpeg', quality: 95 }));
    if (i % (FPS * 5) === 0) {
      const s = ((Date.now() - t0) / 1000).toFixed(0);
      console.log(`frame ${i}/${frames}  (${s}s)`);
    }
  }
  enc.stdin.end();
  await enc.done;

  // Poster: a 1280-wide still of the moment named by the storyboard.
  await page.evaluate((t) => window.seek(t), poster);
  const posterEnc = ffmpeg([
    '-f', 'image2pipe', '-c:v', 'png', '-i', '-', '-vf', 'scale=1280:-2', '-q:v', '3',
    join(OUT, 'verkaufsvideo-poster.jpg')
  ]);
  posterEnc.stdin.end(await page.screenshot({ type: 'png' }));
  await posterEnc.done;
  console.log(`video  assets/video/verkaufsvideo.mp4  ${frames} frames, ${duration}s`);
  await ctx.close();
}
