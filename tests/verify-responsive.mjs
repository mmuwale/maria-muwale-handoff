/* Mobile / responsive verification for the client's Next.js build.
   Run against a running `next start`. Reports geometry, not vibes.

     node verify-client.mjs [baseUrl]
*/
import { chromium } from 'playwright';

const BASE = process.argv[2] || 'http://127.0.0.1:3100';
const VIEWPORTS = [
  { name: 'phone-375', width: 375, height: 812 },
  { name: 'phone-430', width: 430, height: 932 },
  { name: 'desktop-1440', width: 1440, height: 900 },
];

const rect = async (loc) => loc.first().boundingBox();
const overlap = (a, b) =>
  !!a && !!b && !(a.x + a.width <= b.x || b.x + b.width <= a.x || a.y + a.height <= b.y || b.y + b.height <= a.y);

const results = [];
const fail = [];
const ok = (cell, name, pass, got) => {
  results.push({ cell, name, pass: !!pass, got });
  if (!pass) fail.push({ cell, name, got });
};

const browser = await chromium.launch();

for (const vp of VIEWPORTS) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e).slice(0, 120)));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text().slice(0, 120)); });

  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);

  const cell = vp.name;

  /* ---- hero: nothing overlaps the portrait, nothing hides under the header ---- */
  const portrait = await rect(page.locator('img[alt="Maria Muwale"]'));
  const question = await rect(page.locator('p', { hasText: 'What if our academic experience' }));
  const cta = await rect(page.locator('a', { hasText: 'Explore my vision' }));
  const header = await rect(page.locator('header'));
  const nameLine = await rect(page.locator('.op-writeon'));

  ok(cell, 'question does not overlap the portrait', !overlap(question, portrait), { question, portrait });
  ok(cell, 'primary CTA does not overlap the portrait', !overlap(cta, portrait), { cta });
  ok(cell, 'name is not hidden under the fixed header', nameLine && header && nameLine.y >= header.y + header.height - 1, { nameY: nameLine?.y, headerBottom: header ? header.y + header.height : null });
  ok(cell, 'portrait is a usable size', portrait && portrait.width >= 100, { portraitW: portrait?.width });

  /* ---- countdown fits on one row ---- */
  const cdCells = await page.locator('b').filter({ hasText: /^\d\d$/ }).all();
  const boxes = [];
  for (const c of cdCells) boxes.push(await c.boundingBox());
  const rows = new Set(boxes.filter(Boolean).map((b) => Math.round(b.y / 10)));
  ok(cell, 'countdown renders on a single row', boxes.length === 0 || rows.size === 1, { cells: boxes.length, rows: rows.size });

  /* ---- no horizontal scroll anywhere down the page ---- */
  const hs = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
  ok(cell, 'no horizontal scroll at rest', !hs, { scrollW: await page.evaluate(() => document.documentElement.scrollWidth), inner: vp.width });

  /* ---- walk the whole page; the Record must become fully visible somewhere ---- */
  const walk = await page.evaluate(async () => {
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    const inView = (e) => {
      const r = e.getBoundingClientRect();
      return r.left >= -1 && r.right <= window.innerWidth + 1 && r.top >= -1 && r.bottom <= window.innerHeight + 1;
    };
    const heading = () => [...document.querySelectorAll('h2')].find((x) => /^Record/i.test(x.textContent.trim()));
    const items = () => [...document.querySelectorAll('li')].filter((x) =>
      /Class representative|Academic subcommittee|Smart Learning Spaces - prototype|Director of ICT/.test(x.textContent));
    const H = document.documentElement.scrollHeight;
    let bestItems = 0, bestHeading = false, worstLeft = 0, hscroll = false, bestY = -1;
    for (let y = 0; y < H; y += Math.max(60, Math.round(window.innerHeight / 6))) {
      window.scrollTo(0, y);
      await sleep(70);
      if (document.documentElement.scrollWidth > window.innerWidth + 1) hscroll = true;
      const h = heading(), its = items();
      const vis = its.filter((e) => inView(e) && +getComputedStyle(e).opacity > 0.9).length;
      if (vis > bestItems) { bestItems = vis; bestY = y; }
      if (h && inView(h) && +getComputedStyle(h).opacity > 0.9) bestHeading = true;
      for (const e of [h, ...its]) if (e) worstLeft = Math.min(worstLeft, Math.round(e.getBoundingClientRect().left));
    }
    return { bestItems, bestHeading, worstLeft, hscroll, bestY, total: items().length };
  });

  ok(cell, 'Record heading becomes visible while scrolling', walk.bestHeading, walk);

  /* settle at the end of the pinned range: the items stagger in over ~900ms */
  const settled = await page.evaluate(async () => {
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    const sec = [...document.querySelectorAll('main > section')][1];
    window.scrollTo(0, sec.offsetTop + (sec.offsetHeight - window.innerHeight) * 0.95);
    await sleep(1600);
    const items = [...document.querySelectorAll('li')].filter((x) =>
      /Class representative|Academic subcommittee|Smart Learning Spaces - prototype|Director of ICT/.test(x.textContent));
    const inV = (e) => { const r = e.getBoundingClientRect();
      return r.left >= -1 && r.right <= window.innerWidth + 1 && r.top >= -1 && r.bottom <= window.innerHeight + 1; };
    return { visible: items.filter((e) => inV(e) && +getComputedStyle(e).opacity > 0.9).length, total: items.length,
             lefts: items.map((e) => Math.round(e.getBoundingClientRect().left)) };
  });
  ok(cell, 'all four Record items visible and settled', settled.visible === 4 && settled.total === 4, settled);
  ok(cell, 'Record content never sits off the left edge', walk.worstLeft >= 0, { worstLeft: walk.worstLeft });
  ok(cell, 'no horizontal scroll anywhere down the page', !walk.hscroll, walk.hscroll);

  ok(cell, 'no page or console errors', errors.length === 0, errors.slice(0, 3));

  await ctx.close();
}

/* ---- JS off: is the page still readable ---- */
for (const vp of [VIEWPORTS[0], VIEWPORTS[2]]) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
  const cell = vp.name + '-nojs';
  const text = (await page.locator('body').innerText()).replace(/\s+/g, ' ');
  ok(cell, 'name renders without JS', /MARIA/.test(text) && /MUWALE/.test(text), text.slice(0, 60));
  ok(cell, 'the question renders without JS', /What if our academic experience/.test(text), null);
  ok(cell, 'the four pillar titles render without JS',
    ['Smart Learning Spaces', 'Interfaculty Projects', 'Industrial Visits', 'Faculty Spotlight Week'].every((p) => text.includes(p)), null);
  const hs = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1).catch(() => false);
  ok(cell, 'no horizontal scroll without JS', !hs, null);
  await ctx.close();
}

/* ---- head: one h1, and the share card is present ---- */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  for (const path of ['/', '/manifesto']) {
    await page.goto(BASE + path, { waitUntil: 'networkidle' });
    const h1s = await page.locator('h1').count();
    ok('head', `exactly one h1 on ${path}`, h1s === 1, h1s);
    const html = await page.content();
    ok('head', `og:image present on ${path}`, /property="og:image"/.test(html), null);
  }
  for (const asset of ['/og.jpg', '/favicon.ico', '/apple-touch-icon.png']) {
    const r = await page.request.get(BASE + asset);
    ok('head', `${asset} returns 200`, r.status() === 200, r.status());
  }
  await ctx.close();
}

/* ---- the dash rule, on the rendered pages ---- */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  for (const path of ['/', '/manifesto']) {
    await page.goto(BASE + path, { waitUntil: 'networkidle' });
    const html = await page.content();
    const em = (html.match(/—/g) || []).length;
    const en = (html.match(/–/g) || []).length;
    ok('dashes', `zero em and en dashes on ${path}`, em === 0 && en === 0, { em, en });
  }
  await ctx.close();
}

await browser.close();

const pad = (s, n) => String(s).padEnd(n);
console.log('\n' + pad('cell', 16) + pad('check', 52) + 'result');
for (const r of results) console.log(pad(r.cell, 16) + pad(r.name, 52) + (r.pass ? 'ok' : 'FAIL'));
console.log('\n' + (fail.length ? fail.length + ' FAILING CHECK(S):' : 'all ' + results.length + ' checks pass'));
for (const f of fail) console.log('  ' + pad(f.cell, 16) + f.name + '  got=' + JSON.stringify(f.got));
process.exitCode = fail.length ? 1 : 0;
