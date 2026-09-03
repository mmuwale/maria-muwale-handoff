import { ScrollTrigger } from "@/lib/gsap/registerGsap";

/**
 * One ScrollTrigger per scene. Pinning is native CSS `position:sticky` on
 * `stageEl` (see the stage components) - ScrollTrigger here only measures
 * progress and re-measures on refresh. Ported from ARCHITECTURE.md section 1.
 */
export function scrub(
  sceneEl: Element,
  stageEl: HTMLElement,
  fn: (progress: number) => void,
) {
  return ScrollTrigger.create({
    trigger: sceneEl,
    start: "top top",
    end: () => "+=" + Math.max(1, sceneEl.scrollHeight - stageEl.offsetHeight),
    onUpdate: (self) => fn(self.progress),
    onRefresh: (self) => fn(self.progress),
    invalidateOnRefresh: true,
  });
}
