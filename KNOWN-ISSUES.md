# Known issues and open judgement calls

Everything here is known. None of it is an oversight. Each entry carries the reasoning, so
you inherit the thinking rather than just the defect, and so you can tell the difference
between something waiting to be fixed and something already decided.

Split into three parts: **defects not fixed**, **decisions you might disagree with**, and
**things only a real phone can confirm**.

---

# Part 1: defects not fixed

## 1.1 `index.html` has no `<h1>`. The riskiest item here.

Her name, the office line and all four pillar titles are plain `<div>`s. The entire heading
outline of the campaign page is **one orphan `<h2>` reading "Record"**. There is no `<main>`.

`manifesto.html` does it correctly, which is exactly what makes the campaign page look like
an oversight rather than a choice.

**Why it is not fixed.** It is markup-only, but the elements involved are the beat-4 cards
that the JavaScript builder queries by class and the CSS orders by `nth-child` for the JS-off
path. Changing `<div class="fTtl">` to `<h3 class="fTtl">` touches:

- `A = above.querySelectorAll('.fCard')` and the `.fTtl` lookup inside it,
- the `html:not(.js) #fAbove .fCard:nth-child(n){order:...}` rules,
- `aria-labelledby="fTtl1"` on the wording cards, which must keep pointing at the right ids,
- default UA margins on heading elements, inside absolutely positioned cards whose geometry
  `fMeasure()` computes.

It needs the full 16-cell pass behind it, and it was deferred when the remaining time was
better spent on things a voter would actually notice.

**If you fix it:** do it as its own change, run `npm test` before and after, and diff the
`screens` column. A heading margin appearing inside `.fCard` will move the beat-4 geometry.

## 1.2 Instagram and TikTok opened in the same tab. FIXED 1 September.

Kept here so you do not "fix" it again or wonder why the markup looks the way it does.

```html
<a class="drop" href="https://instagram.com/maria.muwale" target="_blank" rel="noopener">Instagram @maria.muwale</a>
<a class="drop" href="https://tiktok.com/@maria.muwale" target="_blank" rel="noopener">TikTok @maria.muwale</a>
```

The two outbound social links used to navigate away from the campaign site in the same tab.
`target="_blank"` and `rel="noopener"` were added and deployed on 1 September. Current
browsers imply `noopener` for `target="_blank"` anyway; it is stated explicitly because
relying on an implication is not the same as saying it.

Cost: 62 bytes. All 16 cells re-passed with zero page-height drift. **These are the only two
`target="_blank"` attributes on the site.** Every other link is internal and should stay in
the same tab.

## 1.3 "Vote 11 September" looks like a button and is inert

```html
<div class="primary drop">Vote 11 September</div>
<a class="drop" id="shareLink" href="#">Share this page</a>
```

The first is a `<div>`. It has the same gold border, the same padding and the same type as
the working Share link directly beneath it, because `.acts a, .acts .primary` share a rule
and the filled variant only applies to `a.primary`.

**Why it is not fixed.** It was decided in Phase 5 to be a label, not an action: there is
nothing to link it to. There is no online ballot. The affordance cost was recorded and
accepted rather than argued away.

**If you touch it,** the honest options are to keep it a label and make it look less like a
button, or to leave it alone. Do not make it a link to nowhere.

## 1.4 The `writeon` listener race

Fully described in `ARCHITECTURE.md` section 10. Summary:

The `animationend` listener that releases the hero name's clip-path is registered after the
two blocking vendor scripts. On a slow load the animation finishes first and the listener
never fires. **This was measured on the live host and it does fire in production**: missed at
600 kbps and at 1500 kbps, caught only at 4000 kbps.

**Why it is not fixed: the consequence is nil, and that is measured, not assumed.** The
animation ends on an *expanded* clip, `inset(0 -0.3em 0 0)`, and `animation-fill-mode: both`
parks it there. A pixel diff of the parked state against `clip-path:none` at 390, 430 and
1440 gives **0 differing pixels at all three widths**. The name is all-caps with no
descenders.

Note that the Phase-6 fix which made the name animate at first paint (1583 ms to -19 ms at
600 kbps) **widened** this window rather than narrowing it. That was accepted for the same
reason.

**The trap:** this stays harmless only while the `to` keyframe is generous and the name has
no descenders. See `ARCHITECTURE.md` for the exact list of changes that would make it bite.

## 1.5 About 124 KB of base64 is inlined in front of first paint

Two images, uncacheable, in the document body. Consequences:

- A returning visitor re-downloads them, because they cannot be cached separately.
- A cold link-preview scrape reads through them. The document is 204,660 B rather than the
  182,076 B it was two phases ago, so a cold uncompressed scrape is about 12% slower. The
  share tags are inside the first ~2,000 bytes, so a streaming scraper still has them
  immediately.

**Why it is not fixed.** Pulling them out would shrink a cold scrape and improve caching, and
it changes how the hero paints first. The hero currently paints with no image request at all,
which is the reason it was done this way. Judged not worth it. Revisit only if the hero
images are being reworked anyway, so the two changes are verified together.

## 1.6 The hero crest has no source file in this package

**This one is new and is not in the original notes, so read it carefully.**

The crest inlined in the hero is a **198x212 palette PNG with 96 colours**, 18,169 B decoded.
`assets/derived/crest.png` is the same Strathmore crest artwork at **102x113 in RGB**, 16,798
B. They are the same drawing at different resolutions. **Neither is derived from the other in
this package, and nothing here is byte-identical to the inlined blob.**

Consequences:

- **The favicons and the hero crest come from different files.** `tools/cut-favicon.py` cuts
  the five icons from the 102x113 `crest.png`. It cannot reproduce the hero crest.
- If you need to change the hero crest, you can only work from `crest.png` and accept a
  different rendition.

The crest itself is also flagged on quality grounds: at its rendered 52 px it was measured
against the full-colour sources and found indistinguishable, so restoring colour buys
nothing. The only real improvement is official artwork from Strathmore, which requires
approval from `communications@strathmore.edu`. **An image model is not an option**; see
`CONSTRAINTS.md` section 1.

## 1.7 Google Fonts is the one runtime external, and is not self-hosted

Cormorant and Montserrat load from `fonts.googleapis.com` with `preconnect` to both origins.
If it fails the page falls back to Georgia and Arial and stays entirely readable.

**Why it is not fixed.** Self-hosting the two families is the remaining load-time gain and
would remove the last third-party origin. It was not done because it changes type rendering,
and there was no longer anyone available to verify that the change was neutral at real size
on a real phone. Shipping an unverified type change in the last week was the worse risk.

## 1.8 Forced dark mode on Samsung Internet

Samsung Internet **ignores `prefers-color-scheme`** and applies its own proprietary colour
transform to the page. It honours `color-scheme` only behind a Labs flag.

`<meta name="color-scheme" content="light">` is on both pages. It is correct, it costs
nothing, and **it is not a fix**.

**Why it is not fixed: no reliable fix exists.** The transform is applied by the browser
below the level any page CSS can reach. The only workaround is on the user's side: Samsung
Internet, Settings, Labs, "Use website dark theme".

This matters more than it sounds, because Samsung Internet has real share on Android in
Kenya. It is a known cosmetic degradation, not a defect to chase.

## 1.9 The harness always exits 0

`tests/resting.mjs` ends with `process.exit(0)` unconditionally. A failing run prints
`N FAILING CHECK(S):` and still exits successfully.

**Consequence:** `npm test` cannot gate CI and shell chaining will not catch a red run. Read
the output. The last line must read `all checks pass`.

Left as is because it was always run by hand and read by a human. If you wire it into
anything automated, fix this first.

## 1.10 A hardcoded LAN address in the harness

`tests/resting.mjs` prints a hardcoded `http://192.168.100.4:PORT/` when run with
`--serve --host=0.0.0.0`. That was my machine. It is a private-range address, so it leaks
nothing, but on your network the printed URL will be wrong. Use your own machine's address.

Cosmetic. Only affects `npm run serve:lan`.

---

# Part 2: decisions you might disagree with

These are settled, not broken. They are here so you know they were considered.

## 2.1 No vignette on beat 3's band

The Record band carries `<div class="fBg dots">` and no `.fBg.vig`, unlike beats 4 and 5 and
the ask, which carry both. A judgement call about how heavy the band should feel at the
moment it buries beat 2, not an oversight. **Open to being overruled.**

## 2.2 The beat-1 scroll lock was never built

The idea was to hold the reader at the hero until the opening animation completed. Not built,
for two reasons. The name now animates before first paint, so it may have nothing left to
solve. And **a scroll lock that fails to release on a slow phone is the worst failure mode
available in election week**: a site nobody can scroll.

## 2.3 The manifesto is no longer script-free, deliberately

`manifesto.html` used to have zero scripts, and the harness asserted `scripts === 0`. It now
has exactly one, and the assertion was **rewritten rather than dropped**:

- `exactly one script on the page`
- `that one script is inline` (checks `script[src]` is empty first)
- `that script is stateless: no timers, no clock, no storage, no network` (a blocklist regex
  covering `setTimeout`, `setInterval`, `Date`, `localStorage`, `XMLHttpRequest`,
  `sendBeacon`, `pushState`, `replaceState`, `document.write`, `indexedDB`,
  `document.cookie`, `eval`, `new Function`)
- `both back links are real hrefs and work with JS off`

The script restores the reader's scroll position when they go back to the campaign page, and
there is no markup that can do that. The original reason for the zero-script rule was a
refusal to duplicate the countdown's three-state logic, which was the source of the worst bug
in this project. That reasoning covers stateful, time-dependent code. It does not reach one
stateless click handler.

**Do not "restore" `scripts === 0`.** It was a proxy for a property, and the property is now
tested directly.

The script is also defensive by design: it only upgrades the links to `history.back()` when
the visitor demonstrably arrived from the campaign page on the same origin, so it can never
walk someone off the site.

## 2.4 Open judgement calls, never resolved

Five things that were noticed, discussed, and left. They are aesthetic, all on desktop, and
none of them is a defect:

1. **Right-edge stone clip** on the last desktop stone at 1440.
2. **Beat-5 tail:** about 29 svh of hold after the last phrase writes.
3. **Beat-6 spacing:** the desktop gap between the slogan block and the sparkle line.
4. **The hero date line:** restore it on the opener, or leave the date to the ask? Currently
   the date appears only in beat 6 and in the manifesto.
5. **The signature moment is still unnamed.** The page has no single frame that someone would
   screenshot and send to a friend. This was recognised and never resolved.

If your merge happens to settle any of these, say so when you send it back.

---

# Part 3: two things only a real phone can confirm

Both shipped in the last phase and **cannot be verified by the harness**. If your merge
touches either area, they need re-checking on a physical device, not in a browser window.

## 3.1 The `svh` / `dvh` stack against a retracting address bar

**Headless Chromium has no toolbar, so it reports `svh`, `lvh` and `dvh` as the same number.**
The fix is therefore invisible to `npm test`, which will pass whether the stack is right or
wrong.

To check it: open the site on a phone, scroll the hero slowly until the address bar
retracts, and confirm the navy floor line stays welded to the bottom edge of the screen with
no strip of the next section appearing beneath it. Repeat at beat 4 and beat 5.

See `ARCHITECTURE.md` section 4 for what the stack is and why.

## 3.2 The portrait sharpening

The hero portrait was rebuilt from a full-resolution cut-out (820x1181 to 886x1275) and given
a light sharpen, measured as edge energy 98 to 174. **Whether that is the right amount is a
judgement at real size on a real screen**, and no assertion can make it.

If you re-encode the portrait for any reason, look at it on a phone before you send it back.

---

## One more thing that is not an issue

Two behaviours look like defects and are not. Both were measured. Do not "fix" either:

- **The Android share sheet shows no preview card.** Expected. The card is rendered by the
  receiving app, not by the sheet.
- **A cold WhatsApp scrape takes a few seconds to show the card.** Expected for a first
  scrape. The share tags sit in the first ~1% of the document, so a streaming scraper has
  them immediately.
