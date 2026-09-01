/* Builds the OG / share card.
   Phase-2 decision 5: ivory ground, the SMILING photo — chosen for WhatsApp
   recognition against the circulating poster. Real material only: the image is
   assets/derived/cutout-smiling.webp (the Phase-2 flood-fill cutout of the real
   studio photo) and the crest crop. Type is the locked pairing. Nothing generated.

   Authored as HTML and screenshotted, so the type stays in Cormorant/Montserrat
   rather than being re-drawn.

   node phase-4/make-og.mjs
*/
import { chromium } from 'playwright';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const W = 1200, H = 630;

const CARD = `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant:wght@500;600;700&family=Montserrat:wght@400;500;600&display=swap">
<style>
  :root{--navy:#0B1F3A;--ivory:#F6E9E0;--gold:#BFA671;--blushW:#E09590;--blushI:#B26B67;
        --serif:'Cormorant',Georgia,serif;--sans:'Montserrat',Arial,Helvetica,sans-serif}
  *{box-sizing:border-box;margin:0;padding:0}
  body{width:${W}px;height:${H}px;overflow:hidden;background:var(--ivory);
       font-family:var(--sans);color:var(--navy);position:relative;-webkit-font-smoothing:antialiased}
  .circle{position:absolute;top:34px;right:58px;width:452px;height:452px;border-radius:50%;
          background:var(--blushW)}
  .portrait{position:absolute;right:38px;bottom:22px;height:566px;width:auto;object-fit:contain;
            object-position:bottom center}
  .crest{position:absolute;top:34px;left:74px;width:56px;height:auto}
  .type{position:absolute;left:74px;top:150px;width:600px}
  .l1{font-family:var(--serif);font-weight:600;font-size:104px;line-height:.92;letter-spacing:.02em;
      text-transform:uppercase;color:var(--navy)}
  .l2{font-family:var(--serif);font-weight:600;font-size:104px;line-height:.92;letter-spacing:.02em;
      text-transform:uppercase;color:var(--blushI)}
  .forRow{display:flex;align-items:center;gap:12px;margin-top:34px}
  .forRow .rule{width:38px;height:1px;background:var(--gold)}
  .forRow .for{font-weight:500;font-size:13px;letter-spacing:.3em;text-transform:uppercase;color:var(--gold)}
  .office{font-weight:600;font-size:22px;letter-spacing:.17em;text-transform:uppercase;margin-top:16px;
          line-height:1.35}
  .uni{font-weight:500;font-size:14px;letter-spacing:.26em;text-transform:uppercase;margin-top:12px;
       color:rgba(11,31,58,.62)}
  .base{position:absolute;left:0;right:0;bottom:0;height:10px;background:var(--navy)}
</style></head><body>
  <div class="circle"></div>
  <img class="portrait" src="/assets/derived/cutout-smiling.webp" alt="">
  <img class="crest" src="/assets/derived/crest.png" alt="">
  <div class="type">
    <div class="l1">Maria</div>
    <div class="l2">Muwale</div>
    <div class="forRow"><div class="rule"></div><div class="for">For</div><div class="rule"></div></div>
    <div class="office">Female Academic<br>Representative</div>
    <div class="uni">Strathmore University</div>
  </div>
  <div class="base"></div>
</body></html>
`;

fs.mkdirSync('tools/renders', { recursive: true });
fs.writeFileSync('tools/renders/og-card.html', CARD);

const MIME = { '.html': 'text/html; charset=utf-8', '.webp': 'image/webp', '.png': 'image/png',
               '.jpeg': 'image/jpeg', '.jpg': 'image/jpeg' };
const root = process.cwd();
const server = http.createServer((req, res) => {
  const f = path.join(root, decodeURIComponent(req.url.split('?')[0]));
  if (!f.startsWith(root) || !fs.existsSync(f)) { res.writeHead(404).end(); return; }
  res.writeHead(200, { 'content-type': MIME[path.extname(f).toLowerCase()] || 'application/octet-stream' });
  fs.createReadStream(f).pipe(res);
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const base = 'http://127.0.0.1:' + server.address().port;

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
const page = await ctx.newPage();
await page.goto(base + '/tools/renders/og-card.html', { waitUntil: 'load' });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(600);

const missing = await page.evaluate(() => [...document.images]
  .filter(i => !i.complete || i.naturalWidth === 0).map(i => i.getAttribute('src')));
if (missing.length) { console.error('IMAGES FAILED TO LOAD: ' + missing.join(', ')); process.exit(1); }

fs.mkdirSync('site', { recursive: true });
await page.screenshot({ path: 'site/og.jpg', type: 'jpeg', quality: 86, clip: { x: 0, y: 0, width: W, height: H } });
await ctx.close(); await browser.close(); server.close();

console.log(`site/og.jpg  ${W}x${H}  ${fs.statSync('site/og.jpg').size} B`);
console.log('source: tools/renders/og-card.html');
