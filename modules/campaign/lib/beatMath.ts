/** Clamp to [0, 1]. */
export function c01(n: number) {
  return Math.min(1, Math.max(0, n));
}

/** Smoothstep easing for a 0-1 progress value. */
export function sm(t: number) {
  const x = c01(t);
  return x * x * (3 - 2 * x);
}

const LEAD = 0.05;
const TRAV = 0.88;

/**
 * Maps overall scene progress `p` (0-1) to a continuous card index across
 * `count` cards, with dead scroll at the start and end of each handoff.
 * Ported from ARCHITECTURE.md section 5 (beat 4's stepF). At an integer
 * result, that card is fully settled; the fractional part is the handoff
 * to the next card.
 */
export function stepF(p: number, count: number) {
  const seg = count - 1;
  const r = c01(p) * seg;
  const i = Math.min(seg - 1, Math.floor(r));
  const t = r - i;
  return i + sm((t - LEAD) / TRAV);
}
