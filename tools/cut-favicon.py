"""Cut the shipping favicon files from the real Strathmore crest in the repo.

The crest artwork in assets/derived/crest.png sits off-centre inside its own frame -
left margin 27px against 6px on the right, top 23px against 0 at the bottom - and the
frame is 102x113, so a browser squashed it into the square tab slot on top of that
offset. That is the whole defect. This script trims the artwork out of its ivory
ground and re-seats it centred on a square ivory canvas, then cuts each size.

Real material: this is the crest already in the repo, moved and resampled. Nothing
is redrawn. (phase-4/make-favicon.mjs holds a hand-drawn reduction that was built,
compared and NOT chosen - see docs/00- item 8.)

    python phase-4/cut-favicon.py
"""
from PIL import Image, ImageFilter
import numpy as np, struct, io, os

SRC, DST = 'assets/derived/crest.png', 'site'
IVORY, SIZES = (246, 233, 224), (16, 32, 48)
PAD = 0.06                      # breathing room around the artwork, share of its height

im = Image.open(SRC).convert('RGB')
a = np.asarray(im).astype(int)
mask = (np.abs(a - np.array([245, 233, 221])).max(axis=2) > 14)
ys, xs = np.where(mask)
art = im.crop((xs.min(), ys.min(), xs.max() + 1, ys.max() + 1))
w, h = art.size
side = round(h * (1 + 2 * PAD))
canvas = Image.new('RGB', (side, side), IVORY)
canvas.paste(art, ((side - w) // 2, (side - h) // 2))       # centred, both axes
print(f"  artwork {w}x{h} re-seated centred on a {side}x{side} ivory square")
print(f"  margins now: left/right {(side-w)//2}, top/bottom {(side-h)//2}")

def cut(n):
    im = canvas.resize((n, n), Image.LANCZOS)
    return im.filter(ImageFilter.UnsharpMask(radius=0.6, percent=55, threshold=0))

for n in SIZES:
    cut(n).save(f'{DST}/favicon-{n}.png', optimize=True)
cut(180).save(f'{DST}/apple-touch-icon.png', optimize=True)

# Multi-size .ico for the default /favicon.ico request. Built by hand because PIL's
# ICO writer resizes without the per-size sharpening. Embedded PNG, allowed since Vista.
blobs = []
for n in SIZES:
    b = io.BytesIO(); cut(n).save(b, 'PNG', optimize=True); blobs.append(b.getvalue())
out = struct.pack('<HHH', 0, 1, len(blobs))
off = 6 + 16 * len(blobs)
for n, b in zip(SIZES, blobs):
    out += struct.pack('<BBBBHHII', n, n, 0, 0, 1, 32, len(b), off); off += len(b)
open(f'{DST}/favicon.ico', 'wb').write(out + b''.join(blobs))

for f in ['favicon-16.png','favicon-32.png','favicon-48.png','apple-touch-icon.png','favicon.ico']:
    print(f"  {f:24s} {os.path.getsize(f'{DST}/{f}'):>7} B")
