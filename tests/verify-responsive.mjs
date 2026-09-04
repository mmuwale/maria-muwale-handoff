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

/* Every width the mobile hero layout has to survive, not just two of them.
   Tailwind's sm: breakpoint is 640, so 431..639 is still the phone layout and
   is exactly where a portrait sized by width rather than by its grid row grows
   tall enough to slide up behind the office lines. That band shipped broken
   because this file only tested 375 and 430. */
const HERO_SWEEP = [];
for (let w = 320; w <= 1600; w += 20) HERO_SWEEP.push(w);

/* The owner accepted overlap between the bottom-left block and the
   owner asked for. The button and cells are opaque and the label carries its
   131px at 320 and gone by 540, with the portrait at the reference size the
   own ground, so all three read over her. Name and office stay at zero. */
const CTA_OVERLAP_BUDGET_PX = 140;

const rect = async (loc) => loc.first().boundingBox();

/* The portrait is object-contain with a transparent cut-out, so its element
   box is much wider than the pixels that are actually painted. Comparing
   against the box produces false overlaps wherever the box is letterboxed.
   This returns the rect the image really occupies. */
const paintedRect = async (page, selector) =>
  page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    const nw = el.naturalWidth, nh = el.naturalHeight;
    if (!nw || !nh) return { x: r.left, y: r.top, width: r.width, height: r.height };
    const scale = Math.min(r.width / nw, r.height / nh);
    const w = nw * scale, h = nh * scale;
    const pos = getComputedStyle(el).objectPosition;
    const bottom = /bottom/.test(pos);
    return { x: r.left + (r.width - w) / 2, y: bottom ? r.bottom - h : r.top + (r.height - h) / 2, width: w, height: h };
  }, selector);
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
  const portrait = await paintedRect(page, 'img[alt="Maria Muwale"]');
  const officeLine = await rect(page.locator('text=Female Academic Representative').first());
  const cta = await rect(page.locator('a', { hasText: 'Explore my vision' }));
  ok(cell, 'the Meet Maria button is gone', await page.locator('a', { hasText: 'Meet Maria' }).count() === 0, await page.locator('a', { hasText: 'Meet Maria' }).count());
  const header = await rect(page.locator('header'));
  const nameLine = await rect(page.locator('.op-writeon'));

  ok(cell, 'office line does not overlap the portrait', !overlap(officeLine, portrait), { officeLine, portrait });
  const heroText = (await page.locator('section').first().innerText()).replace(/\s+/g, ' ');
  ok(cell, 'the hero no longer carries the question paragraph',
    !/What if our academic experience/i.test(heroText), heroText.slice(0, 70));
  ok(cell, 'the name does not overlap the portrait', !overlap(nameLine, portrait), { nameLine, portrait });
  ok(cell, 'name is not hidden under the fixed header', nameLine && header && nameLine.y >= header.y + header.height - 1, { nameY: nameLine?.y, headerBottom: header ? header.y + header.height : null });
  ok(cell, 'portrait is a usable size', portrait && portrait.width >= 100, { portraitW: portrait?.width });

  /* ---- her name must never be cut off by its wrapper ---- */
  const nameCut = await page.evaluate(() => {
    const out = [];
    document.querySelectorAll('.op-writeon').forEach((span) => {
      const wrap = span.parentElement;
      const rng = document.createRange();
      rng.selectNodeContents(span.firstChild);
      const cut = Math.round(rng.getBoundingClientRect().right - wrap.getBoundingClientRect().right);
      if (cut > 1) out.push({ text: span.textContent.trim(), cut });
    });
    return out;
  });
  ok(cell, 'her name is not clipped by its wrapper', nameCut.length === 0, nameCut);

  /* ---- the countdown sits at the foot of the hero, and says 9:00 am ---- */
  {
    const hero = page.locator('section').first();
    const label = hero.locator('text=/Vote 11 September/').first();
    const lr = await rect(label);
    const heroBox = await rect(hero);
    ok(cell, 'countdown label is inside the hero', !!lr, lr);
    ok(cell, 'countdown sits in the lower half of the hero',
      !!lr && !!heroBox && lr.y > heroBox.y + Math.min(heroBox.height, vp.height) * 0.5,
      { labelY: lr && Math.round(lr.y), viewport: vp.height });
    const txt = lr ? await label.innerText() : '';
    ok(cell, 'countdown label drops the noon clause', /9:00\s*am\s*$/i.test(txt.trim()), txt.trim());
  }

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

/* ---- the hero must not overlap itself at ANY width ---- */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  for (const w of HERO_SWEEP) {
    await page.setViewportSize({ width: w, height: w < 640 ? 812 : 900 });
    await page.waitForTimeout(350);
    const portraitR = await paintedRect(page, 'img[alt="Maria Muwale"]');
    const parts = {
      name: await rect(page.locator('h1')),
      office: await rect(page.locator('text=Female Academic Representative').first()),
      institution: await rect(page.locator('text=Strathmore University').first()),
      cta: await rect(page.locator('a', { hasText: 'Explore my vision' })),
    };
    const hit = Object.entries(parts).filter(([, r]) => overlap(r, portraitR)).map(([k]) => k);
    /* Only meaningful below the sm breakpoint. At 640 and up the layout is two
       columns and the composition deliberately lets the portrait's frame and
       the blush circle sit behind the name, so an overlap there is the design,
       not a defect. Below 640 it is a single column and any overlap means text
       is sitting on the photograph. */
    if (w < 900) {
      const overlapPx = (r) => (r && portraitR)
        ? Math.max(0, Math.min(r.x + r.width, portraitR.x + portraitR.width) - Math.max(r.x, portraitR.x)) : 0;
      const hard = ['name', 'office', 'institution'].filter((k) => hit.includes(k));
      ok('hero-sweep', `the name and office never touch the portrait at ${w}px`, hard.length === 0, hard);
      ok('hero-sweep', `the button overlaps the portrait by at most ${CTA_OVERLAP_BUDGET_PX}px at ${w}px`,
        overlapPx(parts.cta) <= CTA_OVERLAP_BUDGET_PX, Math.round(overlapPx(parts.cta)));
    }
    const hs = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    ok('hero-sweep', `no horizontal scroll at ${w}px`, !hs, null);
    const cut = await page.evaluate(() => {
      const out = [];
      document.querySelectorAll('.op-writeon').forEach((span) => {
        const rng = document.createRange();
        rng.selectNodeContents(span.firstChild);
        const c = Math.round(rng.getBoundingClientRect().right - span.parentElement.getBoundingClientRect().right);
        if (c > 1) out.push(span.textContent.trim() + ' cut ' + c + 'px');
      });
      return out;
    });
    ok('hero-sweep', `her name is not clipped at ${w}px`, cut.length === 0, cut);
  }
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
