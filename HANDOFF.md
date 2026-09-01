# Handoff

## What this is

The complete, live Maria Muwale campaign site, packaged so you can merge a second design
into it and hand it back. It is a live campaign asset for a real candidate in a real
election on 11 September 2026, not a demo.

## Who does what

**You** merge your design and return the folder. **I** verify and deploy.

The site is hosted on **Cloudflare Pages**, project `maria-muwale`, on **my** Cloudflare
account. You need no Cloudflare access and no credentials, and there is nothing for you to
configure. I run the deploy after the returned folder passes the pass described below.

This is worth knowing for one practical reason: **the host name is baked into the pages.**
Each page carries a `<link rel="canonical">` plus 15 share-card meta tags with absolute
`https://maria-muwale.pages.dev/...` URLs, and `og:image` points at the same host. If your
merge changes those, link previews break. If the site later moves to a custom domain, that
one string is the only thing to change, in both HTML files. Leave it alone.

## When I need it back

**No fixed date.** If you can turn it around the same day, do. What is fixed is the far end:

- Election **Friday 11 September 2026**.
- My own ceiling for a last deploy is **Tuesday 8 September**.
- After it returns I need time for the 16-cell pass, any repair your merge needs, the
  deploy, and a live verification against the deployed host. Budget a day for that, two if
  the pass comes back red.

Work back from 8 September yourself. Earlier is strictly better: every day it is back early
is a day the finished site is in front of voters.

## Scope: what is in

- `site/` exactly as deployed, byte for byte.
- `assets/` limited to the material the shipped page actually uses, plus the two studio
  photos and the campaign poster.
- `tests/resting.mjs` and one reference `tests/baseline/baseline.json`.
- `tools/make-og.mjs` and `tools/cut-favicon.py`, the two regeneration tools.
- `package.json`, `.gitattributes`, `.gitignore`.
- Six documents: this one, `README.md`, `ARCHITECTURE.md`, `CONSTRAINTS.md`,
  `KNOWN-ISSUES.md`, `CONTENT.md`.

## Scope: what is deliberately absent, and why

- **`node_modules/`.** Run `npm install`. The original copy holds Windows binaries.
- **`phase-1/`, `phase-2/`, `phase-3/`, and the render folders.** Frozen prototypes and
  throwaway output from six phases of design work. They are history, and shipping them
  would invite editing the wrong file.
- **Session transcripts and research docs.** Roughly 200 KB of process notes. Everything in
  them that still binds has been rewritten into the four documents here. Reading the
  originals would cost you a day and mislead you: several numbers in them were superseded.
- **`_archive/`, `tests/out/`, and every baseline except one.** `tests/baseline/` held 18
  runs from six phases. Only the reference run is useful to you.
- **`make-manifesto.mjs`.** This is a deliberate cut, not an oversight. It is a generator
  that used to build `manifesto.html`, and **its own header says it no longer builds the
  shipped page.** Four Phase-5 decisions were made by hand directly in the HTML after that
  generator was last touched. Running it would silently revert them. `manifesto.html` is
  now a hand-maintained file. Edit it directly.
- **`wrangler`.** You do not deploy, so it is not your dependency. That is the only
  difference between this `package.json` and the original, apart from pinning Playwright.
- **`assets/derived/cutout-side.webp` and two superseded portrait encodings.** Not used by
  the shipped build.

## Dependency chain

The runtime dependency list for the deployed site is short, and worth stating exactly
because it is the whole surface your merge can widen:

| | |
|---|---|
| **Build tooling** | None. No bundler, no transpiler, no CSS pipeline, no framework. |
| **GSAP 3.12.5 + ScrollTrigger** | **Vendored**, in `site/vendor/`. Not npm-installed, not from a CDN. Two `<script src>` tags. 115,594 B raw, 45,675 B gzipped. Do not swap these for CDN links: a CDN adds a third-party origin the page currently does not have, and the page must work when the scripts fail (see `ARCHITECTURE.md`). Do not upgrade GSAP without re-running the pass. |
| **Google Fonts** | **The one runtime external.** Cormorant and Montserrat, one stylesheet link plus `preconnect` to `fonts.googleapis.com` and `fonts.gstatic.com`. If it fails the page falls back to Georgia and Arial and stays readable. Self-hosting was considered and rejected; see `KNOWN-ISSUES.md`. |
| **Everything else** | Inlined. Two images are base64 in `index.html`. All SVG is hand-authored in the markup. There are no other network requests. |

For the test harness only:

| | |
|---|---|
| **Node** | 20 LTS or newer. Verified on **v22.16.0**, npm 10.9.2. |
| **Playwright** | Pinned to **1.62.1**, the version the reference baseline was recorded on. It ships Chromium 151. Pinned rather than floated on purpose: a different Playwright means a different Chromium, and the recorded numbers stop being comparable. |

First-time setup:

```
npm install
npm run setup
```

`npm run setup` is `playwright install chromium`. It downloads the browser once, into a
shared cache outside this folder.

## The harness

```
npm test
```

This is `node tests/resting.mjs --label=latest`. It starts a static server over `site/`,
drives Chromium across a matrix, and writes its result to `tests/baseline/latest.json`.

**`tests/baseline/baseline.json` is the reference run and is never written to.** It is the
recorded state of the site as shipped, and it is what you diff against. Every run goes to a
different file so it stays pristine. If you run the harness bare as `node tests/resting.mjs`
with no label, it *will* overwrite it, so use the npm scripts.

**The matrix is 16 cells:**

- `index.html` at 2 viewports (1440x900 desktop, 390x844 phone) x 3 modes (JS on, JS off,
  reduced motion) x 2 engines (GSAP present, GSAP blocked) = 12.
- `manifesto.html` at 2 viewports x 2 modes (JS on, JS off) = 4.

To label a run you want to keep separately, for example the one you send back with the
folder:

```
npm run test:label
```

That writes `tests/baseline/after-merge.json`. Diff either file against `baseline.json`.
The JSON records every measured value per cell, so a diff shows exactly which numbers your
merge moved, not just whether it passed.

### Reading the output

Each cell prints a line as it runs, then a table, then a verdict.

```
. desktop-js-gsap ... ok
. desktop-js-fallback ... ok
...
cell                   screens engine   hscr  sweep   record    ttl/say  vis  fonts  fails
desktop-js-gsap        12.53   gsap     no    0,0     1,1,1,1   4/4      1    yes    0
...

all checks pass
```

Columns:

| column | means | what a bad value looks like |
|---|---|---|
| `screens` | total page height in viewport-heights | a large unexplained jump means a stage lost its pin or a scene lost its height |
| `engine` | which render path actually ran | must match the cell. `fallback` in a `gsap` cell means GSAP failed to load |
| `hscr` | horizontal scroll | `YES` is always a failure |
| `sweep` | opacity of the two hero gold sweeps at rest | must be `0,0`. Anything else means the sweep parked on screen |
| `record` | opacity of the four Record items | must be `1,1,1,1` in every cell |
| `ttl/say` | pillar title cards / wording cards found | must be `4/4` |
| `vis` | pillars visible at the end of beat 4 | `1` with JS, `4` under reduced motion |
| `fonts` | whether the webfonts actually rendered | measured by advance width against the fallback, not by `document.fonts.check()`, which lies |
| `fails` | failing assertions in that cell | must be `0` |

### What "passing" means

**The last line must read `all checks pass`.**

**The exit code is always 0.** The harness calls `process.exit(0)` unconditionally, so
`npm test` will not fail a CI job and shell chaining will not catch a red run. Read the
output. If any check fails, the run prints `N FAILING CHECK(S):` followed by one line per
failure giving the cell, the assertion name, and the value it got.

A cell counts as passing only if every assertion in it passes. Among them:

- No page errors, no console errors, no horizontal scroll, in every cell.
- All four pillar titles and all four wordings present, in every cell, including with JS
  disabled.
- With JS off: beat 4 is not pinned, not clipped, and the eight cards stack in reading
  order with **zero overlapping pairs**. That is a geometry check, not a text check.
- With JS on: at most one pillar visible at a time across 40 samples of beat 4.
- Under reduced motion: all four pillars visible at rest.
- The Record items are visible and sitting on the navy slab, checked by rectangle
  containment.
- **Zero em dashes and zero en dashes on both pages.** Asserted every run. See
  `CONSTRAINTS.md`.
- The manifesto has exactly one script, that script is inline, and it is stateless: no
  timers, no clock, no storage, no network.
- Both manifesto back links are real `href` values that work with JS off.

### Why the harness is in the package

It is the page's contract. The site has three render paths and two of them are invisible
during normal development: you will not notice that you broke the JS-off path or the
reduced-motion path by looking at the page in a browser, because your browser runs neither.
Every one of the eight fixes in the last phase was verified through this harness, and two
of the bugs it caught were exactly this shape: content that `innerText` reported as present
while it sat below a clipped stage, invisible to a real reader.

Run it before you send the folder back. If it is red and you cannot get it green, send it
back red with the output, and say what you changed. That is far more useful than a guess.

## Other commands

```
npm run serve        serve site/ locally, print the URL
npm run serve:lan    serve on 0.0.0.0:8080 so a phone on the same network can reach it
npm run og           rebuild site/og.jpg from assets/
```

`npm run og` needs network access: it fetches Cormorant and Montserrat from Google Fonts and
screenshots a card. **If the fonts cannot load it bakes the fallback type into the image with
no error**, so only run it on a machine with a working connection, and look at the result.

`tools/cut-favicon.py` rebuilds the five icons from `assets/derived/crest.png`. It needs
Python with Pillow and NumPy. Run it from the folder root: `python tools/cut-favicon.py`.

`tools/make-og.mjs` differs from the original by four lines: its scratch directory was
`phase-4/renders/` and is now `tools/renders/`, because `phase-4/` is not in this package.
No behavioural change, and the output is identical.

## Sending it back

Send the whole folder back, the same way it came, with:

1. **What you changed**, in a sentence or two per area. Especially anything inside
   `site/index.html`.
2. **The harness output** from your last run, pasted as text.
3. **Anything you had to break** to make the merge work, and why. Say it plainly. It is much
   cheaper to fix something you flagged than something I find on the live host.

Do not deploy anything, and do not change `.gitattributes`. It contains `* -text`, which
stops Git rewriting line endings; without it every recorded byte count in these documents
becomes wrong.
