/** Ported from the handoff build's beat1(s): a fade that reaches 0 well
 *  before s reaches 1 when rate > 1, so different elements can disappear
 *  at different points along the same scroll range. */
export function fade(s: number, rate: number) {
  return Math.max(0, 1 - s * rate);
}
