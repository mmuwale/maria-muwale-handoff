# Architecture

How `site/index.html` works. Read this before merging anything into it.

The whole campaign page is one file: markup, CSS and JavaScript inline, plus two vendored
scripts and two base64 images. There is no framework and no build step. That is not
minimalism for its own sake; it is what makes the three render paths below tractable.

---

## 1. Three render paths, not one

The page renders three different ways. **All three are asserted by `npm test`, and two of
them are invisible while you develop**, because your browser runs neither.

### Path A: GSAP

`vendor/gsap.min.js` and `vendor/ScrollTrigger.min.js` load as two blocking `<script src>`
tags. At the bottom of the page:

```js
if (window.gsap && window.ScrollTrigger) withGsap();
else fallback();
```

`withGsap()` creates one ScrollTrigger per scene through a single helper:

```js
function scrub(sceneEl, stageEl, fn){
  ScrollTrigger.create({
    trigger: sceneEl,
    start: 'top top',
    end: function(){ return '+=' + Math.max(1, sceneEl.offsetHeight - stageEl.offsetHeight); },
    onUpdate: function(self){ fn(self.progress); },
    onRefresh: function(self){ fn(self.progress); },
    invalidateOnRefresh: true
  });
}
```

ScrollTrigger owns three things and only three: **progress maths, the refresh lifecycle,
and the batched reveals**. It does not pin anything. See section 3.

The end distance is `scene height minus stage height`. That single expression is why the
scene heights in section 4 mean what they mean.

### Path B: the no-GSAP fallback

If either vendored script fails to load, `fallback()` runs instead. It computes the same
progress values from `getBoundingClientRect()` and drives the same beat functions, off a
**passive scroll listener throttled through `requestAnimationFrame`**:

```js
addEventListener('scroll', function(){ if(!q){q=true;requestAnimationFrame(read);} },{passive:true});
addEventListener('resize', function(){ fMeasure(); read(); });
```

Reveals come from an `IntersectionObserver` instead of `ScrollTrigger.batch`. Sticky
positioning is unaffected, because it was never GSAP's job.

This path is not a degraded mode. It renders the same page. The harness runs **every cell
twice**, once with GSAP available and once with it blocked, and asserts the two produce the
same page height and the same resting state.

**Breaks if:** you make any beat function depend on a GSAP object, a GSAP tween, or
`self.direction`. The beat functions take a single number between 0 and 1 and nothing else.
Keep it that way.

### Path C: reduced motion

`matchMedia('(prefers-reduced-motion:reduce)')`. This path **returns before any scroll
wiring exists**:

```js
if(reduce.matches){
  document.querySelectorAll('.drop,.slide').forEach(function(el){el.classList.add('in');});
  A.forEach(function(el){el.style.opacity=1;}); B.forEach(function(el){el.style.opacity=1;});
  if(above){ A.forEach(function(a,i){ above.appendChild(a); above.appendChild(B[i]); });
             stage.classList.add('fStatic'); }
  var dStage=document.querySelector('.default'); if(dStage) dStage.classList.add('dStatic');
  beat5(1);
  return;
}
```

Note what it does: it re-parents the beat-4 cards into reading order, switches two stages to
static layout classes, and runs beat 5 at progress 1 so the stones are already seated. Then
it returns. No ScrollTrigger, no scroll listener, no rAF.

**The countdown and the share button are wired above this block on purpose**, so they run in
all three paths.

### And a fourth state: JS off entirely

The first thing in `<body>` is:

```html
<script>document.documentElement.className='js';</script>
```

Every rule that hides something for later reveal is scoped to `.js`:

```css
.drop{opacity:1}
.js .drop{opacity:0;transform:translateY(-40px)}
.js .record li{opacity:0;transform:translateY(-16px)}
.js .fCard{position:absolute;left:0;right:0;opacity:0}
```

With JS disabled the class is never set, so **nothing is hidden and nothing needs revealing**.
The `html:not(.js)` rules then unpin the stages and let every scene lay out at
`height:auto`.

**Breaks if:** you add a reveal that hides its element by default and only shows it in
JavaScript. Anything hidden at rest must be hidden by a `.js`-scoped rule, or it disappears
for readers with JS off. Two bugs of exactly this shape shipped and were caught by the
harness; `innerText` reported the content as present while it sat below a clipped stage.

---

## 2. The six beats and who owns each

| beat | scene element | sticky stage inside it | what happens |
|---|---|---|---|
| 1 opener | `section.opener` | `div.op-stage#opStage` | name writes on, portrait and circle drift out |
| 2 the default | `section.defaultWrap` | `div.default` | question and three boxes; blush circle grows |
| 3 the record | *same section* | *same stage* | `div.bandLayer#bandLayer` creeps up inside the stage and buries beat 2 |
| 4 the foundation | `section.fScene#fScene` | `div.fStage#fStage` | four pillars, one at a time, over a loaded beam |
| 5 the stones | `section.b5Scene#b5Scene` | `div.b5Stage#b5Stage` | MUWALE means stones; six stones land, three phrases write |
| 6 the ask | `section.ask` | none, normal flow | slogan, countdown, actions, contacts, closer |

Then a bare `<footer>` that carries only the two background layers.

**Beats 2 and 3 share one section and one stage.** This is the single most surprising thing
about the structure. `beat23(p)` scales the circle, translates `.bandLayer` from
`translateY(105vh)` up past the viewport, fades `.dContent` out, and toggles `.shown` on the
band past 55% to stagger the Record items in. The band is a layer **inside** an
`overflow:hidden` stage, which is why the JS-off and reduced-motion paths need the explicit
`.dStatic` / `html:not(.js) .default` rules that set the stage to `position:relative;
height:auto` and put the band back in normal flow. Without them the Record exists in the DOM
and is unreachable.

**Breaks if:** you insert a section between `.defaultWrap` and `.fScene` without giving it
its own scene/stage pair, or you give `.bandLayer` a transform in CSS that the JS then
overwrites.

---

## 3. Pinning is CSS `position:sticky`. Not GSAP.

Every pinned stage is:

```css
position:sticky; top:0;
```

ScrollTrigger's `pin:` option is **not used anywhere**. This is a deliberate, load-bearing
decision. The browser composites native sticky on the compositor thread and it survives
mobile toolbar resize; ScrollTrigger's pin-spacer inserts a wrapper element whose height is
computed once and does not, so on a phone where the address bar retracts mid-scroll a
pin-spacer produces a visible jump.

**Breaks if:** you convert a stage to `pin:true` to "make it work with GSAP". You will get a
page that looks correct on a desktop and jumps on every phone, and you will silently break
the fallback path, which has no GSAP to do the pinning at all.

---

## 4. The `svh` / `dvh` stack on the four sticky stages

Each of the four sticky stages declares its height more than once:

```css
.op-stage{ ... height:100vh;height:100svh;height:100dvh; ... }
.default { ... height:100vh;height:100svh;height:100dvh; ... }
.fStage  { ... height:100svh;height:100dvh; ... }
.b5Stage { ... height:100svh;height:100dvh; ... }
```

This is a deliberate cascade, not duplication. Each later declaration overrides the one
before it **in browsers that understand the unit**, and is ignored as invalid in browsers
that do not. Old browsers get `vh`, everything current gets `dvh`.

Why it matters: on a phone, `100vh` is the **large** viewport, measured as though the address
bar were retracted. A sticky stage that is `100vh` tall is therefore taller than what you can
actually see while the address bar is showing, so the bottom of the stage sits below the fold.
For the opener, that bottom edge is the navy `.heroline`. As the toolbar retracts, the extra
height comes into view and the next section shows through as a strip along the bottom edge.

`100dvh` tracks the live viewport, so the stage is always exactly as tall as the visible area.

The scene heights that wrap them use the **small** viewport unit:

```css
.opener    { height:190vh  }
.defaultWrap{ height:300vh }
.fScene    { height:355svh }
.b5Scene   { height:300svh }
```

Scroll distance for a scene is `scene height minus stage height`, so `.fScene` at `355svh`
over a `100dvh` stage gives roughly **2.55 screens** of pinned scroll. Changing the scene
height is how you change how long a beat lasts.

**Breaks if:** you normalise these to a single unit. Collapsing the stack to `100vh` brings
the toolbar strip back on every phone. Collapsing it to `100dvh` alone drops old browsers.
And note this **cannot be verified in headless Chromium**, which has no toolbar and reports
`svh`, `lvh` and `dvh` as the same number. It has to be checked on a real phone.

---

## 5. Beat 4: the builder

Beat 4 is the most intricate part of the page and the part most likely to break.

### What is real HTML and what is built

The four pillars are **real markup**, in two sibling slots:

```html
<div class="fSlot above" id="fAbove">
  <div class="fCard"><div class="fTtl" id="fTtl1">Smart Learning Spaces</div></div>
  ... four titles ...
</div>
<div class="fSlot below" id="fBelow">
  <div class="fCard" role="group" aria-labelledby="fTtl1"><p class="fSay">...</p></div>
  ... four wordings ...
</div>
```

Only the **beam bearing points** (`.fTick`) and the **desktop periphery labels** (`.fPeri`)
are created in JavaScript, one per title. They are decoration for a beam that does not exist
without JS.

```js
A = [...above.querySelectorAll('.fCard')];   // titles
B = [...below.querySelectorAll('.fCard')];   // wordings
```

**`A[i]` and `B[i]` must stay paired.** `beat4()` dereferences `B[i]` unguarded. Four titles
and three wordings throws a TypeError on the first scroll event and takes the whole page
script with it.

### `fMeasure()`

Runs on load, on resize, and on every `ScrollTrigger` `refreshInit`. It reads the live stage
box and positions the two slots around the beam line:

```js
W = stage.offsetWidth; H = stage.offsetHeight;
var across = W >= 900;
LY = Math.round(H * (across ? 0.60 : 0.50));
```

`LY` is the beam's Y in pixels. Titles sit above it, wordings below it, ticks and periphery
labels on it at `((i+.5)/N)` across the width. The desktop and phone gaps differ (34/40 px
versus 26/28 px).

### `LEAD`, `TRAV`, and `355svh`

```js
var LEAD = .05, TRAV = .88;
function stepF(p){
  var seg = N-1, r = p*seg, i = Math.min(seg-1, Math.floor(r)), t = r-i;
  return i + sm(c01((t-LEAD)/TRAV));
}
```

Four pillars means **three handoffs**. `p` (0 to 1 across the scene) is stretched over three
segments; `t` is the progress within one handoff.

- **`LEAD = .05`** is dead scroll at the **start** of each handoff, before the next pillar
  begins to move. `(t-LEAD)` is negative there and clamps to 0.
- **`TRAV = .88`** is the share of each handoff the transition actually occupies.
- What is left, `1 - LEAD - TRAV = .07`, is dead scroll at the **end**.
- So the frozen share of each handoff is `1 - TRAV`, currently **12%**.

These were `LEAD .10, TRAV .62` before the last phase, a **38%** freeze, and the beat felt
stuck. They were retuned to `.05` and `.88` while the scene was shortened from `460svh` to
**`355svh`**, so the beat got shorter without any single pillar handoff getting faster: the
scroll spent on one handoff moved 632px to 636px, and the cards travel identical distances
to within 0.1px. The dead time was removed, not the motion.

`maxSimul` in the harness stays at **1**: beat 4 is strictly one pillar at a time. That is an
assertion, not an aspiration.

**Breaks if:**
- You add or remove a pillar without updating both slots. `N` is derived, so the maths
  adapts, but the JS-off ordering rules in CSS are hardcoded to four:
  ```css
  html:not(.js) #fAbove .fCard:nth-child(1){order:1}
  html:not(.js) #fBelow .fCard:nth-child(1){order:2}
  ... through 4 ...
  ```
  A fifth pillar renders in the wrong order with JS off, and the harness asserts the stack
  order is exactly `tstststs`.
- You raise `TRAV` above `1 - LEAD`. The clamp saturates and the last part of each handoff
  does nothing visible.
- You shorten `.fScene` much below `355svh`. The pillars start overlapping and `maxSimul`
  goes above 1.

---

## 6. The two base64 images, and what that means for the hero

`index.html` contains exactly two `data:` images, both inside `.op-stage`:

| | decoded | source in this package |
|---|---|---|
| `.op-crest` | PNG, **198x212**, palette, 96 colours, 18,169 B | **none is byte-identical** |
| `.op-portrait#opPortrait` | WebP, 91,612 B | `assets/derived/cutout-smiling-v2-inline-q75.webp`, byte for byte |

Two consequences.

**The portrait is reproducible. The crest is not.** `assets/derived/crest.png` is the same
Strathmore crest artwork but at **102x113 in RGB**, a smaller crop. It is what
`tools/cut-favicon.py` cuts the five favicons from. It is **not** the source of the 198x212
blob in the hero, and nothing in this package is. If you need to change the hero crest you
will have to work from `crest.png` and accept a different rendition, or ask for the original.

**Around 124 KB of base64 sits in front of first paint and is uncacheable.** It also slows a
cold link-preview scrape, because a scraper reading the document from the top passes through
it. The share-card meta tags are deliberately in the first ~2,000 bytes so a streaming
scraper has them before it reaches the images. Keep any new `<head>` content above them.

### Paint order in the hero is z-index, not DOM order

The two `<img>` tags sit **after** `.op-name` in the markup, and every child of the stage
carries an explicit `z-index`:

```
circle 1 · crest 2 · portrait 3 · name 4 · cue 5 · heroline 6
```

This was done so that paint order does not depend on DOM order, which frees the markup to
put the name first for reading order and for the write-on animation to start at first paint.

**Breaks if:** you strip the `z-index` values as redundant. They are the only thing holding
the composition together, and the failure is subtle: the portrait paints over the name.

Also in the hero: `beat1(s)` drives `.op-name` (translate and scale, origin `left top`),
`#opSub` opacity, `#opPortrait` (translateX and opacity), and `#opCircle`. It writes inline
styles, so any CSS `transform` you add to those four elements will be overwritten on the
first scroll event.

---

## 7. `:root` is the single place colour and type live

```css
:root{
  --navy:#0B1F3A; --ivory:#F6E9E0; --gold:#BFA671; --goldD:#A87B47;
  --blushW:#E09590; --blushI:#B26B67; --blushN:#D9A3A8;
  --serif:'Cormorant',Georgia,serif;
  --sans:'Montserrat',Arial,Helvetica,sans-serif;
  --pi:1
}
```

Every colour and both font stacks come from here. There are no hardcoded hex values in the
rules except inside `rgba()` tints of navy and ivory, and inside the hand-authored SVG stone
fills in beat 5.

`--pi` is **pattern intensity**, the single dial for the locked background. The two
background layers compute from it:

```css
.fBg.dots{background-image:radial-gradient(rgb(191 166 113 / calc(11% * var(--pi))) 1.1px,transparent 1.2px);background-size:18px 18px}
.fBg.vig{background:radial-gradient(115% 78% at 50% 42%,transparent 40%,rgb(4 12 24 / calc(48% * var(--pi))) 100%)}
```

Stages that carry the background re-declare `--pi` locally, so one ground can be turned down
without touching the others.

**`manifesto.html` has its own separate `:root` block** with the same tokens plus `--navyD`.
The two files do not share a stylesheet. Changing a colour means changing it in both.

**Breaks if:** you introduce a second source of truth for colour, or hardcode a hex where a
token exists. The palette is contractual with the candidate; see `CONSTRAINTS.md`.

---

## 8. The `.drop` / `.slide` reveal system

Two classes, used throughout beats 2 and 6.

```css
.drop{opacity:1}                                     /* visible when JS never runs */
.js .drop{opacity:0;transform:translateY(-40px)}
.js .drop.in{opacity:1;transform:translateY(0);
  transition:transform .48s cubic-bezier(.55,0,.9,.3),opacity .22s ease-out}
.js .drop.in.settled{animation:settle .17s ease-out}  /* a 6px overshoot on landing */

.js .slide{opacity:0;transform:translateX(30%)}
.js .slide.in{opacity:1;transform:translateX(0);
  transition:transform .42s cubic-bezier(.2,.7,.2,1),opacity .2s ease-out}
```

`.in` is added by whichever path is running:

- **GSAP:** `ScrollTrigger.batch('.drop,.slide', {start:'top 88%', once:true})`, staggered
  120 ms apart, with `.settled` added 470 ms later.
- **Fallback:** an `IntersectionObserver` at `rootMargin:'0px 0px -12% 0px'`, `threshold:.15`,
  unobserving on first hit.
- **Reduced motion:** added to everything immediately, and the whole reduced-motion media
  query kills all animation and transition anyway.

**Breaks if:** you add `.drop` to something that must be readable without JS and then also
hide it in an unscoped rule. The `.js` scope is the entire safety mechanism. The harness
asserts every `.drop`/`.slide` element is revealed after a read-through, in every cell.

---

## 9. The countdown

```js
var voteStart = new Date('2026-09-11T09:00:00+03:00'),
    voteEnd   = new Date('2026-09-11T12:00:00+03:00'),
    results   = new Date('2026-09-11T13:30:00+03:00');
```

**A fixed instant with an explicit offset**, not a relative duration and not a local-time
string. It subtracts the visitor's clock, so it is correct from any timezone. `tick()` runs
once on load and then on `setInterval(tick, 60000)`.

Four states:

1. Before 9:00 am on 11 September: days and hours.
2. Between 9:00 and noon: the row collapses to the single word `Now`, and the label becomes
   `Polls are open · close at noon`.
3. Between noon and 1:30 pm: label becomes `Results at 1:30 pm`.
4. **After 1:30 pm the block removes itself**: `box.style.display='none'`.

That last state is deliberate. After the results hour the countdown has nothing true left to
say, and the outcome is not ours to write, so it disappears rather than freezing on a stale
number. **If a post-election message is wanted, the words have to come from the candidate.**

With JS off, `html:not(.js) .cdRow{display:none}` hides the numerals, and `.cdLabel` still
reads `Vote 11 September · 9:00 am - noon`. The facts survive without the clock.

**Breaks if:** you localise those dates, drop the `+03:00` offset, or make the interval
faster. This is the code behind the worst bug in the project's history; it is now correct
through election day and after. Do not rewrite it.

---

## 10. The `writeon` clip-path release, and its known race

The hero name is revealed by a clip-path animation:

```css
.js .op-name .l1,.op-name .l2{animation:writeon .75s cubic-bezier(.2,.7,.2,1) both}
.js .op-name .l2{animation-delay:.18s}
@keyframes writeon{ from{clip-path:inset(0 100% 0 0)} to{clip-path:inset(0 -0.3em 0 0)} }
```

and released by a listener:

```js
document.querySelectorAll('.op-name .l1,.op-name .l2').forEach(function(el){
  el.addEventListener('animationend',function(e){
    if(e.animationName==='writeon') el.style.setProperty('clip-path','none','important');
  });
});
```

**The listener is registered in the inline script at the bottom of the page, which is after
the two blocking `<script src>` vendor tags.** The animation is started by CSS at first paint.
On a slow connection the animation can finish before the listener attaches, and the release
never fires.

This race is **real and confirmed in production**. Measured on the live host: at 600 kbps the
animation runs 1105 ms to 1824 ms and the listener misses it; at 1500 kbps, 1184 ms to
1920 ms, missed; only at 4000 kbps does `clip-path` reach `none`.

**It is currently harmless, and the reason is the `to` keyframe.** It ends at
`inset(0 -0.3em 0 0)`, an **expanded** clip, and `both` parks it there. A pixel diff of the
parked state against `clip-path:none` at 390, 430 and 1440 gives **0 differing pixels at all
three widths.** The name is all-caps with no descenders, so nothing reaches the clip edge.

**Breaks if:** you change the `to` keyframe to `inset(0 0 0 0)` or `inset(0)`, change the
name to mixed case or an italic face, add a descender, or add a glyph that overhangs its
box. The clip stops being generous, the race stops being harmless, and on a slow phone the
candidate's name is permanently cut off. If you need to touch that keyframe, move the
listener registration into a small inline script in `<head>` first.

---

## The sweep

One more hero detail, because it has already been a defect once. Each name line wraps its
word:

```html
<div class="l1"><span class="wd">MARIA<span class="op-sweep"></span></span></div>
```

```css
.op-name .wd{position:relative;display:inline-block;vertical-align:top}
```

The `.wd` wrapper is what bounds the gold sweep to the letters. Before it existed the sweep
ran 354 px past the word and over the blush circle. **`vertical-align:top` is load-bearing**:
without it the inline-block baseline alignment grows the name block.

The sweep keyframes must start and end at `opacity:0`:

```css
@keyframes sweep{0%{left:-34%;opacity:0}12%{opacity:1}78%{opacity:1}100%{left:66%;opacity:0}}
```

It is a pass, not an object. The animation uses `both`, so a non-zero end opacity parks a
gold slab beside the name for the life of the page. The harness asserts sweep opacity is
`0,0` at rest in every cell.
