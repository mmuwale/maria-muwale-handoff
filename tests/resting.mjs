/* Whole-page resting-state pass — Maria Muwale campaign site.
   Standing rule (docs/08- §14): check the WHOLE page, every beat,
   JS on / JS off / reduced motion, on both engines. Not the part just changed.

     node tests/resting.mjs                 run the matrix, write tests/baseline/baseline.json
     node tests/resting.mjs --label=after   write under another label so runs can be diffed
     node tests/resting.mjs --serve         just serve site/ and print the URL (phone test)
     node tests/resting.mjs --serve --host=0.0.0.0 --port=8080
*/
import { chromium } from 'playwright';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const arg = (k, d) => {
  const hit = process.argv.find(a => a.startsWith('--' + k + '='));
  return hit ? hit.slice(k.length + 3) : d;
};
const flag = k => process.argv.includes('--' + k);

const SITE = path.join(ROOT, arg('root', 'site'));
const OUTDIR = path.join(ROOT, arg('out', 'tests/baseline'));
const LABEL = arg('label', 'baseline');
const HOST = arg('host', '127.0.0.1');
const PORT = Number(arg('port', '0'));

const PILLARS = ['Smart Learning Spaces', 'Interfaculty Projects', 'Industrial Visits', 'Faculty Spotlight Week'];

const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png',
  '.webp': 'image/webp', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.woff2': 'font/woff2',
};

function serve(root, host, port) {
  const server = http.createServer((req, res) => {
    const clean = decodeURIComponent(req.url.split('?')[0]);
    let f = path.join(root, clean === '/' ? '/index.html' : clean);
    if (!f.startsWith(root)) { res.writeHead(403).end(); return; }
    if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
    if (!fs.existsSync(f)) { res.writeHead(404, { 'content-type': 'text/plain' }).end('404 ' + clean); return; }
    res.writeHead(200, {
      'content-type': MIME[path.extname(f).toLowerCase()] || 'application/octet-stream',
      'cache-control': 'no-store',
    });
    fs.createReadStream(f).pipe(res);
  });
  return new Promise(r => server.listen(port, host, () => r({ server, port: server.address().port })));
}

/* ---------- in-page probes ---------- */

const atRest = (PILLARS_) => {
  const cs = el => getComputedStyle(el);
  const num = v => Math.round(parseFloat(v) * 1e4) / 1e4;
  const de = document.documentElement;
  const cards = [...document.querySelectorAll('.fCard')];
  const stage = document.getElementById('fStage');
  return {
    htmlClass: de.className,
    hasGsap: !!(window.gsap && window.ScrollTrigger),
    scrollTriggers: window.ScrollTrigger ? window.ScrollTrigger.getAll().length : 0,
    screensRaw: de.scrollHeight / window.innerHeight,
    scrollHeight: de.scrollHeight,
    innerHeight: window.innerHeight,
    sweepOpacity: [...document.querySelectorAll('.op-sweep')].map(e => num(cs(e).opacity)),
    recordAtRest: [...document.querySelectorAll('.record li')].map(e => num(cs(e).opacity)),
    recordCount: document.querySelectorAll('.record li').length,
    phraseCount: document.querySelectorAll('.b5Ph').length,
    titleCards: cards.filter(c => c.querySelector('.fTtl')).length,
    wordCards: cards.filter(c => c.querySelector('.fSay')).length,
    fAboveCards: document.querySelectorAll('#fAbove .fCard').length,
    fBelowCards: document.querySelectorAll('#fBelow .fCard').length,
    ticks: document.querySelectorAll('.fTick').length,
    peris: document.querySelectorAll('.fPeri').length,
    anchors: [...document.querySelectorAll('a')].map(a => ({ href: a.getAttribute('href'), text: a.textContent.trim() })),
    deadAnchors: document.querySelectorAll('a[href="#"]').length,
    ogTags: document.querySelectorAll('meta[property^="og:"],meta[name^="twitter:"]').length,
    /* innerText is the RENDERED text, so it is the right API for "is this readable" —
       but .fTtl is text-transform:uppercase, so compare case-insensitively. */
    pillarsInText: PILLARS_.map(t => document.body.innerText.toLowerCase().includes(t.toLowerCase())),
    fStagePosition: cs(stage).position,
    fStageClipped: stage.scrollHeight > stage.clientHeight + 1,
    fSceneHeight: document.getElementById('fScene').offsetHeight,
    fStageHeight: stage.offsetHeight,
    fSceneTop: document.getElementById('fScene').offsetTop,
    b5SceneHeight: document.getElementById('b5Scene').offsetHeight,
    b5StageHeight: document.getElementById('b5Stage').offsetHeight,
    b5SceneTop: document.getElementById('b5Scene').offsetTop,
    dwTop: document.querySelector('.defaultWrap').offsetTop,
    dwHeight: document.querySelector('.defaultWrap').offsetHeight,
    dwStageHeight: document.querySelector('.default').offsetHeight,
    /* the .fPeri rail copies .fTtl wholesale, so the rail proves the title was not edited */
    periLabels: [...document.querySelectorAll('.fPeri')].map(e => e.textContent),
    /* unscoped: under reduced motion the JS re-parents the wording cards into #fAbove,
       so '#fBelow .fSay' is legitimately empty there. Document order stays pillar order. */
    pillar1: (document.querySelector('.fSay') || {}).textContent || '',
    otherPillars: [...document.querySelectorAll('.fSay')].slice(1).map(e => e.textContent),
    /* dashes are counted on the raw source, not innerText: innerText applies
       text-transform and would not see them inside comments or meta at all */
    dashes: (() => { const h = document.documentElement.outerHTML;
      return (h.match(/\u2014/g) || []).length + (h.match(/\u2013/g) || []).length
           + (h.match(/&mdash;/g) || []).length + (h.match(/&ndash;/g) || []).length; })(),
    cdBoxShown: getComputedStyle(document.querySelector('.cd')).display !== 'none',
    cdRowShown: getComputedStyle(document.querySelector('.cdRow')).display !== 'none',
    cdRow: document.querySelector('.cdRow').innerText.replace(/\s+/g, ' ').trim(),
    cdLabel: document.getElementById('cdLabel').textContent.trim(),
  };
};

/* Record list, measured where it is meant to be readable, not at scroll 0:
   .js .record li is opacity:0 by design until .bandLayer gets .shown. */
const recordProbe = () => {
  const num = v => Math.round(parseFloat(v) * 1e4) / 1e4;
  const lis = [...document.querySelectorAll('.record li')];
  const vh = window.innerHeight;
  return {
    opacity: lis.map(e => num(getComputedStyle(e).opacity)),
    shown: document.getElementById('bandLayer').classList.contains('shown'),
    inViewport: lis.map(e => { const r = e.getBoundingClientRect();
      return r.top < vh && r.bottom > 0 && r.height > 0; }),
    /* the record must sit ON the navy slab, not on the ivory above it */
    onNavy: (() => { const n = document.querySelector('.bandLayer .f-navy').getBoundingClientRect();
      return lis.every(e => { const r = e.getBoundingClientRect();
        return r.top >= n.top - 1 && r.bottom <= n.bottom + 1; }); })(),
  };
};

/* In the static layouts the band is in normal flow, so 'scroll to the scene end' is
   meaningless — the honest question is whether each item can be brought on screen at all.
   A clipped-away element cannot. */
const recordReachable = () => [...document.querySelectorAll('.record li')].map(e => {
  e.scrollIntoView({ block: 'center' });
  const r = e.getBoundingClientRect();
  return r.top < window.innerHeight && r.bottom > 0 && r.height > 0;
});

const pillarsVisible = t => [...document.querySelectorAll('.fCard')]
  .filter(c => c.querySelector('.fTtl'))
  .filter(c => { const r = c.getBoundingClientRect();
    return parseFloat(getComputedStyle(c).opacity) >= t && r.width > 0 && r.height > 0; })
  .length;

const cardVector = () => {
  const num = v => Number(parseFloat(v).toFixed(4));
  const cards = [...document.querySelectorAll('.fCard')];
  const read = c => { const s = getComputedStyle(c); return [num(s.opacity), s.transform]; };
  return {
    t: cards.filter(c => c.querySelector('.fTtl')).map(read),
    s: cards.filter(c => c.querySelector('.fSay')).map(read),
  };
};

const phrasesProbe = () => [...document.querySelectorAll('.b5Ph')].map(e => {
  const v = getComputedStyle(e).clipPath;
  if (v === 'none') return { raw: 'none', rightPct: 0, open: true };
  const m = v.match(/inset\(([^)]+)\)/);
  if (!m) return { raw: v, rightPct: null, open: null };
  const parts = m[1].trim().split(/\s+/);
  const right = parts.length > 1 ? parts[1] : parts[0];
  const pct = right.endsWith('%') ? parseFloat(right) : (parseFloat(right) === 0 ? 0 : null);
  return { raw: v, rightPct: pct, open: pct === 0 };
});

/* Every .drop/.slide must end up revealed once the page has been read through.
   Nothing was asserting this, and it is exactly the class of bug docs/08- 14 warns about. */
const revealProbe = () => {
  const els = [...document.querySelectorAll('.drop,.slide')];
  return { total: els.length,
    inClass: els.filter(e => e.classList.contains('in')).length,
    hidden: els.filter(e => parseFloat(getComputedStyle(e).opacity) < 0.99)
               .map(e => e.className) };
};

const hScrollProbe = () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1;

/* An unresolved var(--pi) makes the declaration invalid at computed-value time and the
   layer silently paints nothing. And an inset:0 layer over unpositioned in-flow content
   paints ON TOP of it. Both fail silently, so both are asserted. */
const bgProbe = () => [...document.querySelectorAll('.fBg')].map(e => ({
  kind: e.classList.contains('dots') ? 'dots' : 'vig',
  painted: getComputedStyle(e).backgroundImage !== 'none',
  pi: getComputedStyle(e).getPropertyValue('--pi').trim(),
}));

const veilProbe = () => ['.slogan', '.cd .n', '.cdLabel', '.acts a', '.contacts a', '.closer',
    '.hash', '.baseline', '.bl-inner h2', '.record li', '.fTtl', '.b5Name']
  .map(sel => { const e = document.querySelector(sel); if (!e) return null;
    const r = e.getBoundingClientRect();
    const x = Math.round(r.left + r.width / 2), y = Math.round(r.top + r.height / 2);
    if (y < 0 || y > window.innerHeight || x < 0 || x > window.innerWidth) return null;
    const top = document.elementFromPoint(x, y);
    return top && top.classList.contains('fBg') ? sel : null; })
  .filter(Boolean);

const cardOverlap = () => {
  const rs = [...document.querySelectorAll('.fCard')].map(c => c.getBoundingClientRect());
  let worst = 0, pairs = 0;
  for (let i = 0; i < rs.length; i++) for (let j = i + 1; j < rs.length; j++) {
    const a = rs[i], b = rs[j];
    const w = Math.min(a.right, b.right) - Math.max(a.left, b.left);
    const h = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
    if (w > 1 && h > 1) { pairs++; worst = Math.max(worst, w * h); }
  }
  return { overlappingPairs: pairs, worstArea: Math.round(worst) };
};

/* visual top-to-bottom order of the beat-4 cards: t = title, s = wording */
const cardVisualOrder = () => [...document.querySelectorAll('.fCard')]
  .map(c => ({ kind: c.querySelector('.fTtl') ? 't' : 's', top: c.getBoundingClientRect().top }))
  .sort((a, b) => a.top - b.top).map(o => o.kind).join('');

/* ---------- one cell ---------- */

async function runCell(browser, base, { vp, mode, engine }) {
  const label = `${vp.name}-${mode}-${engine}`;
  const ctx = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    javaScriptEnabled: mode !== 'nojs',
    reducedMotion: mode === 'reduce' ? 'reduce' : 'no-preference',
    deviceScaleFactor: 1,
  });
  const page = await ctx.newPage();

  const blocked = new Set();
  if (engine === 'fallback') {
    for (const p of ['**/gsap.min.js', '**/ScrollTrigger.min.js']) {
      await page.route(p, r => { blocked.add(r.request().url()); r.abort(); });
    }
  }

  const pageErrors = [], consoleErrors = [], resourceErrors = [], requestFailed = [];
  page.on('pageerror', e => pageErrors.push(String(e).slice(0, 200)));
  page.on('console', m => {
    if (m.type() !== 'error') return;
    const t = m.text();
    (/Failed to load resource|net::ERR/.test(t) ? resourceErrors : consoleErrors).push(t.slice(0, 200));
  });
  page.on('requestfailed', r => requestFailed.push(r.url()));

  await page.goto(base + '/index.html', { waitUntil: 'load' });
  const fontsReady = await page.evaluate(() => document.fonts.ready.then(() => true)).catch(() => false);
  /* document.fonts.check() is a FALSE POSITIVE: it returns true when no @font-face rule
     matches the family at all, so a webfont that never loaded reads as loaded. Verified on
     Chromium 151 - check('600 16px NoSuchFontExistsAnywhere123') returns true, and with
     fonts.googleapis.com blocked the check still passes while the glyphs render as plain
     serif. Measure the rendered advance width instead: if Cormorant is not there, the string
     is laid out in the fallback and the two widths come back identical. */
  const fontsLoaded = await page.evaluate(async () => {
    await document.fonts.ready.catch(() => {});
    const w = fam => {
      const s = document.createElement('span');
      s.style.cssText = 'position:absolute;visibility:hidden;white-space:pre;font:600 64px ' + fam;
      s.textContent = 'MARIA MUWALE Handwriting';
      document.body.appendChild(s);
      const v = s.getBoundingClientRect().width; s.remove(); return v;
    };
    return w('Cormorant,serif') !== w('serif') && w('Montserrat,sans-serif') !== w('sans-serif');
  }).catch(() => null);
  await page.waitForTimeout(1700); // opener sweep: 1s animation + .5s delay

  const r = await page.evaluate(atRest, PILLARS);
  const screens = Math.round((r.screensRaw) * 100) / 100;
  const goTo = async y => { await page.evaluate(v => window.scrollTo(0, v), Math.round(y)); };

  // Record list, at the end of the beat-2/3 scene where the band is up
  await goTo(r.dwTop + (r.dwHeight - r.dwStageHeight));
  await page.waitForTimeout(900); // .36s stagger delay + .3s opacity transition
  const record = await page.evaluate(recordProbe);
  if (mode !== 'js') { record.reachable = await page.evaluate(recordReachable); }

  // end to end
  const bg = await page.evaluate(bgProbe);
  const veiledSet = new Set();

  const step = Math.round(r.innerHeight / 2);
  const stops = Math.ceil(r.scrollHeight / step) + 1;
  const hScrollAt = [];
  for (let i = 0; i <= stops; i++) {
    await goTo(i * step);
    await page.waitForTimeout(55);
    if (await page.evaluate(hScrollProbe)) hScrollAt.push(i * step);
    for (const v of await page.evaluate(veilProbe)) veiledSet.add(v);
  }
  await page.waitForTimeout(900);   // let the last batch stagger + transition land
  const reveal = await page.evaluate(revealProbe);

  const fTravel = r.fSceneHeight - r.fStageHeight;
  await goTo(r.fSceneTop + fTravel);
  await page.waitForTimeout(140);
  const pillarsAtSceneEnd = await page.evaluate(pillarsVisible, 0.5);

  await goTo(r.b5SceneTop + (r.b5SceneHeight - r.b5StageHeight));
  await page.waitForTimeout(140);
  const phrases = await page.evaluate(phrasesProbe);

  // 40 samples across beat 4 — only meaningful where the scrub actually runs
  let vector = null, maxSimul = null, maxSimulFaint = null;
  if (mode === 'js') {
    vector = []; maxSimul = 0; maxSimulFaint = 0;
    for (let i = 0; i < 40; i++) {
      await goTo(r.fSceneTop + fTravel * i / 39);
      await page.waitForTimeout(45);
      vector.push(await page.evaluate(cardVector));
      maxSimul = Math.max(maxSimul, await page.evaluate(pillarsVisible, 0.5));
      maxSimulFaint = Math.max(maxSimulFaint, await page.evaluate(pillarsVisible, 0.05));
    }
  }

  // static-stack checks — only where beat 4 is a stack
  let stack = null;
  if (mode !== 'js') {
    await goTo(r.fSceneTop);
    await page.waitForTimeout(90);
    stack = {
      overlap: await page.evaluate(cardOverlap),
      order: await page.evaluate(cardVisualOrder),
    };
  }

  await ctx.close();

  const realResourceErrors = resourceErrors.filter(t => ![...blocked].some(u => t.includes(u)));
  const realRequestFailed = requestFailed.filter(u => !blocked.has(u));

  return {
    label, viewport: vp.name, mode, engine,
    fontsReady, fontsLoaded,
    engineTaken: mode === 'nojs' ? 'none' : (r.hasGsap ? 'gsap' : 'fallback'),
    scrollTriggers: r.scrollTriggers, htmlClass: r.htmlClass,
    screens, scrollHeight: r.scrollHeight, innerHeight: r.innerHeight,
    hScroll: hScrollAt.length > 0, hScrollAt, reveal, bg, veiled: [...veiledSet],
    cdBoxShown: r.cdBoxShown, cdRowShown: r.cdRowShown, cdRow: r.cdRow, cdLabel: r.cdLabel,
    periLabels: r.periLabels, pillar1: r.pillar1, otherPillars: r.otherPillars, dashes: r.dashes,
    pageErrors, consoleErrors, resourceErrors: realResourceErrors, requestFailed: realRequestFailed,
    blockedOnPurpose: [...blocked],
    sweepOpacity: r.sweepOpacity,
    recordAtRest: r.recordAtRest, record,
    phraseCount: r.phraseCount, phrases,
    titleCards: r.titleCards, wordCards: r.wordCards,
    fAboveCards: r.fAboveCards, fBelowCards: r.fBelowCards, ticks: r.ticks, peris: r.peris,
    pillarsAtSceneEnd, maxSimul, maxSimulFaint,
    pillarsInText: r.pillarsInText, pillarsInTextAll: r.pillarsInText.every(Boolean),
    fStagePosition: r.fStagePosition, fStageClipped: r.fStageClipped,
    fSceneHeight: r.fSceneHeight, fStageHeight: r.fStageHeight,
    anchors: r.anchors, deadAnchors: r.deadAnchors, ogTags: r.ogTags,
    stack, vector,
  };
}

/* ---------- the manifesto page ---------- */

const manifestoProbe = (PILLARS_) => {
  const de = document.documentElement;
  const cs = el => getComputedStyle(el);
  const h2 = document.querySelector('h2.ph');
  return {
    screensRaw: de.scrollHeight / window.innerHeight,
    title: document.title,
    h1: document.querySelector('h1').textContent.trim(),
    pillarHeadText: h2 ? h2.textContent.trim() : null,
    pillarHeadSize: h2 ? Math.round(parseFloat(cs(h2).fontSize)) : null,
    pillarHeadColor: h2 ? cs(h2).color : null,
    h2Count: document.querySelectorAll('h2').length,
    subBlocks: document.querySelectorAll('.sub').length,
    numerals: document.querySelectorAll('.num').length,
    pillars: document.querySelectorAll('.pillar').length,
    tables: document.querySelectorAll('table').length,
    ogTags: document.querySelectorAll('meta[property^="og:"],meta[name^="twitter:"]').length,
    back: document.querySelector('.back') ? document.querySelector('.back').getAttribute('href') : null,
    pillarsInText: PILLARS_.map(t => document.body.innerText.toLowerCase().includes(t.toLowerCase())),
    quoteInText: document.body.innerText.includes('turn ideas into meaningful action'),
    scripts: document.querySelectorAll('script').length,
    scriptText: [...document.querySelectorAll('script')].map(s => s.textContent).join('\n'),
    scriptSrcs: [...document.querySelectorAll('script[src]')].map(s => s.getAttribute('src')),
    backLinks: [...document.querySelectorAll('a.back')].map(a => a.getAttribute('href')),
    codaParas: document.querySelectorAll('.coda p').length,
    /* textContent, not innerText: the ask is text-transform:uppercase and innerText
       returns it in caps. That trap has now cost three wrong assertions on this project. */
    askText: (document.querySelector('.ask span') || {}).textContent || '',
    askVisible: (() => { const e = document.querySelector('.ask span'); if (!e) return false;
      const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; })(),
    saidLefts: [...document.querySelectorAll('.pillar .said')].map(e => Math.round(e.getBoundingClientRect().left)),
    pillar1: (document.querySelector('.pillar .said') || {}).textContent || '',
    dashes: (() => { const h = document.documentElement.outerHTML;
      return (h.match(/\u2014/g) || []).length + (h.match(/\u2013/g) || []).length
           + (h.match(/&mdash;/g) || []).length + (h.match(/&ndash;/g) || []).length; })(),
  };
};

async function runManifesto(browser, base, { vp, mode }) {
  const label = 'manifesto-' + vp.name + '-' + mode;
  const ctx = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    javaScriptEnabled: mode !== 'nojs', deviceScaleFactor: 1,
  });
  const page = await ctx.newPage();
  const pageErrors = [], consoleErrors = [];
  page.on('pageerror', e => pageErrors.push(String(e).slice(0, 200)));
  page.on('console', m => { if (m.type() === 'error' && !/Failed to load resource|net::ERR/.test(m.text()))
    consoleErrors.push(m.text().slice(0, 200)); });

  await page.goto(base + '/manifesto.html', { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready).catch(() => {});
  await page.waitForTimeout(700);
  const r = await page.evaluate(manifestoProbe, PILLARS);

  const step = Math.round(vp.height / 2);
  const hScrollAt = [];
  const H = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y <= H; y += step) {
    await page.evaluate(v => window.scrollTo(0, v), y);
    await page.waitForTimeout(45);
    if (await page.evaluate(hScrollProbe)) hScrollAt.push(y);
  }
  await ctx.close();

  const c = { label, viewport: vp.name, mode, ...r,
    screens: Math.round(r.screensRaw * 100) / 100,
    hScroll: hScrollAt.length > 0, hScrollAt, pageErrors, consoleErrors };

  const checks = [];
  const eq = (n, got, want) => checks.push({ name: n, got, want, pass: JSON.stringify(got) === JSON.stringify(want) });
  const ok = (n, pass, got) => checks.push({ name: n, got, want: 'ok', pass: !!pass });
  ok('no page errors', pageErrors.length === 0, pageErrors);
  ok('no console errors', consoleErrors.length === 0, consoleErrors);
  ok('no horizontal scroll', !c.hScroll, hScrollAt);
  /* Was `scripts === 0` until 31 Aug. The owner added a bottom Back link that restores
     the reader's position on the campaign page, which cannot be done without script.
     The property that actually mattered - no duplicated countdown logic, nothing
     stateful, nothing that can be wrong tomorrow - is asserted directly instead. */
  eq('exactly one script on the page', r.scripts, 1);
  /* The script must be INLINE. Without this, swapping the inline block for a
     <script src="..."> keeps the count at 1 and leaves textContent empty, so the
     stateless regex below would pass vacuously on code it never read. */
  eq('that one script is inline, not a src the check below cannot read', r.scriptSrcs, []);
  ok('that script is stateless: no timers, no clock, no storage, no network',
     !/setInterval|setTimeout|requestAnimationFrame|new Date|Date\.now|localStorage|sessionStorage|indexedDB|document\.cookie|fetch\(|XMLHttpRequest|sendBeacon|pushState|replaceState|document\.write|eval\(|new Function/.test(r.scriptText),
     r.scriptText.slice(0, 80));
  eq('both back links are real hrefs and work with JS off', r.backLinks, ['/', '/']);
  ok('all four pillar titles rendered', r.pillarsInText.every(Boolean), r.pillarsInText);
  ok('the WHY ME quote is rendered', r.quoteInText, r.quoteInText);
  eq('four pillars', r.pillars, 4);
  eq('no KPI tables (B-nokpi)', r.tables, 0);
  ok('share-card meta present', r.ogTags >= 14, r.ogTags);
  eq('back link points at the campaign page', r.back, '/');
  // the owner's canvas edits, as saved
  eq('H1 as edited', r.h1, 'campaignManifesto');
  eq('pillars heading as edited', r.pillarHeadText, 'THE 4 PILLARS');
  eq('pillars heading colour as edited', r.pillarHeadColor, 'rgb(193, 193, 192)');
  eq('sub-block removed', r.subBlocks, 0);
  eq('numerals removed', r.numerals, 0);
  eq('no em or en dashes anywhere in the page', r.dashes, 0);
  eq('the coda has its two paragraphs', r.codaParas, 2);
  ok('the ask states the date and is visible',
     /Vote 11 September 2026/.test(r.askText) && r.askVisible, r.askText.slice(0, 44));
  ok('pillar 1 reads "A proposed feature"', /^A proposed feature integrated into the MyStrath app/.test(r.pillar1), r.pillar1.slice(0, 46));
  /* 'INTERFACULTY' is one unbreakable word and an fr column grew to fit it, shoving that
     pillar's body text right of the other three. This assertion found that bug live. */
  ok('all four pillar bodies share a left edge',
     r.saidLefts.length === 4 && Math.max(...r.saidLefts) - Math.min(...r.saidLefts) <= 1, r.saidLefts);
  eq('only one h2 (Why me removed)', r.h2Count, 1);
  if (vp.name === 'desktop') eq('heading is 48px at desktop', r.pillarHeadSize, 48);
  if (vp.name === 'phone') ok('heading shrinks below 48px on a phone', r.pillarHeadSize < 48, r.pillarHeadSize);
  c.checks = checks;
  return c;
}

/* ---------- expectations ---------- */

function check(c) {
  const out = [];
  const eq = (name, got, want) => out.push({ name, got, want, pass: JSON.stringify(got) === JSON.stringify(want) });
  const ok = (name, pass, got) => out.push({ name, got, want: 'ok', pass: !!pass });

  ok('no page errors', c.pageErrors.length === 0, c.pageErrors);
  ok('no console errors', c.consoleErrors.length === 0, c.consoleErrors);
  ok('no horizontal scroll', !c.hScroll, c.hScrollAt);
  ok('every .drop/.slide revealed after a read-through', c.reveal.hidden.length === 0, c.reveal.hidden);
  ok('background layers all paint', c.bg.every(l => l.painted), c.bg.filter(l => !l.painted));
  ok('nothing veiled by a background layer', c.veiled.length === 0, c.veiled);
  eq('sweep opacity at rest', c.sweepOpacity, [0, 0]);
  ok('share card meta present', c.ogTags >= 14, c.ogTags);
  eq('no em or en dashes anywhere in the page', c.dashes, 0);
  ok('pillar 1 reads "A proposed feature"', /^A proposed feature integrated into the MyStrath app/.test(c.pillar1), c.pillar1.slice(0, 46));
  /* the rail is built by JS, so it only exists in the js cells */
  if (c.mode === 'js') eq('the .fPeri rail still reads the bare pillar names', c.periLabels,
     ['Smart Learning Spaces', 'Interfaculty Projects', 'Industrial Visits', 'Faculty Spotlight Week']);
  ok('the other three pillar wordings are untouched',
     c.otherPillars.length === 3 && c.otherPillars.every(t => !/proposed/.test(t)), c.otherPillars.length);
  /* before the election the countdown must read 'N DAYS : NN HOURS' with JS, and hide its
     numbers without JS - never 'Now Days : Hours' or a frozen pair of em-dashes. */
  if (c.mode === 'nojs') ok('countdown numbers hidden without JS', !c.cdRowShown, c.cdRow);
  else ok('countdown counting down cleanly', /^\d+ DAYS : \d\d HOURS$/.test(c.cdRow), c.cdRow);
  ok('countdown label states the vote', /Vote 11 September/.test(c.cdLabel), c.cdLabel);
  eq('record li opacity at the band', c.record.opacity, [1, 1, 1, 1]);
  if (c.mode === 'js') ok('record li on screen at the band', c.record.inViewport.every(Boolean), c.record.inViewport);
  else ok('record li reachable by scrolling', c.record.reachable.every(Boolean), c.record.reachable);
  ok('record li on the navy slab', c.record.onNavy, c.record.onNavy);
  ok('3 phrases fully open at scene end', c.phrases.length === 3 && c.phrases.every(p => p.open),
    c.phrases.map(p => p.rightPct));
  if (c.mode !== 'nojs') eq('engine taken', c.engineTaken, c.engine);
  if (c.mode === 'js') {
    ok('<=1 pillar visible across 40 samples', c.maxSimul <= 1, c.maxSimul);
    eq('pillars visible at scene end', c.pillarsAtSceneEnd, 1);
  }
  if (c.mode === 'reduce') eq('pillars visible (reduced)', c.pillarsAtSceneEnd, 4);
  if (c.mode === 'nojs') {
    ok('all four pillar titles in JS-off text', c.pillarsInTextAll, c.pillarsInText);
    eq('four title + four wording cards in the HTML', [c.titleCards, c.wordCards], [4, 4]);
    ok('beat-4 stage not pinned', c.fStagePosition !== 'sticky', c.fStagePosition);
    ok('beat-4 stage not clipped', !c.fStageClipped, c.fStageClipped);
    eq('static stack reads title,wording x4', c.stack && c.stack.order, 'tstststs');
  }
  if (c.mode !== 'js' && c.stack) {
    ok('no card overlap in the static stack', c.stack.overlap.overlappingPairs === 0, c.stack.overlap);
  }
  return out;
}

/* ---------- main ---------- */

const VIEWPORTS = [{ name: 'desktop', width: 1440, height: 900 }, { name: 'phone', width: 390, height: 844 }];
const MODES = ['js', 'nojs', 'reduce'];
const ENGINES = ['gsap', 'fallback'];

const { server, port } = await serve(SITE, HOST, PORT);
const base = `http://${HOST === '0.0.0.0' ? '127.0.0.1' : HOST}:${port}`;

if (flag('serve')) {
  console.log('serving ' + SITE);
  console.log('  local: ' + base + '/');
  if (HOST === '0.0.0.0') console.log('  LAN:   http://192.168.100.4:' + port + '/');
  console.log('Ctrl-C to stop.');
} else {
  fs.mkdirSync(OUTDIR, { recursive: true });
  const browser = await chromium.launch();
  const cells = [];
  for (const vp of VIEWPORTS) for (const mode of MODES) for (const engine of ENGINES) {
    process.stdout.write(`. ${vp.name}-${mode}-${engine} ... `);
    const c = await runCell(browser, base, { vp, mode, engine });
    c.checks = check(c);
    cells.push(c);
    const bad = c.checks.filter(k => !k.pass);
    console.log(bad.length ? 'FAIL(' + bad.length + ')' : 'ok');
  }
  for (const vp of VIEWPORTS) for (const mode of ['js', 'nojs']) {
    process.stdout.write(`. manifesto-${vp.name}-${mode} ... `);
    const c = await runManifesto(browser, base, { vp, mode });
    cells.push(c);
    const bad = c.checks.filter(k => !k.pass);
    console.log(bad.length ? 'FAIL(' + bad.length + ')' : 'ok');
  }
  await browser.close();
  server.close();

  const file = path.join(OUTDIR, LABEL + '.json');
  fs.writeFileSync(file, JSON.stringify({ label: LABEL, when: new Date().toISOString(), cells }, null, 1));

  const pad = (s, n) => String(s).padEnd(n);
  console.log('\n' + pad('cell', 23) + pad('screens', 8) + pad('engine', 9) + pad('hscr', 6) +
    pad('sweep', 8) + pad('record', 10) + pad('ttl/say', 9) + pad('vis', 5) + pad('fonts', 7) + 'fails');
  for (const c of cells) {
    const bad = c.checks.filter(k => !k.pass);
    if (!c.sweepOpacity) {   // manifesto cell: fewer columns
      console.log(pad(c.label, 23) + pad(c.screens, 8) + pad(c.mode, 9) +
        pad(c.hScroll ? 'YES' : 'no', 6) + pad('-', 8) + pad('-', 10) +
        pad(c.pillars + ' pil', 9) + pad(c.ogTags, 5) + pad('-', 7) +
        (bad.length ? bad.map(k => k.name).join('; ') : '-'));
      continue;
    }
    console.log(pad(c.label, 23) + pad(c.screens, 8) + pad(c.engineTaken, 9) +
      pad(c.hScroll ? 'YES' : 'no', 6) + pad(c.sweepOpacity.join(','), 8) +
      pad(c.record.opacity.join(','), 10) + pad(c.titleCards + '/' + c.wordCards, 9) +
      pad(c.pillarsAtSceneEnd, 5) + pad(c.fontsLoaded ? 'yes' : 'NO', 7) +
      (bad.length ? bad.map(k => k.name).join('; ') : '-'));
  }
  const fails = cells.flatMap(c => c.checks.filter(k => !k.pass).map(k => ({ cell: c.label, ...k })));
  console.log('\n' + (fails.length ? fails.length + ' FAILING CHECK(S):' : 'all checks pass'));
  for (const f of fails) console.log('  ' + pad(f.cell, 23) + ' ' + f.name + '  got=' + JSON.stringify(f.got));
  console.log('\nwritten: ' + path.relative(ROOT, file));
  process.exit(0);
}
