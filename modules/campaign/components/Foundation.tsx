"use client";

import { useEffect, useRef } from "react";
import { pillars } from "@/modules/shared/data/pillars";
import { useScrub } from "@/modules/campaign/hooks/useScrub";
import { c01, sm, stepF, tail, lerp } from "@/modules/campaign/lib/beatMath";

const N = pillars.length;

/**
 * Beat 4. Ported from the handoff build's beat4()/fMeasure() (site/index.html
 * lines 570-621), not a reinterpretation this time:
 *
 * - A beam (SVG path) runs across the stage at height LY (60% down on
 *   desktop, 50% on mobile). It bows toward whichever pillar is currently
 *   settled, the bow deepest at rest and shallowest mid-handoff (`settle`).
 * - Each pillar's title/body opacity falls off steeply (2.25x) from the
 *   continuous card index `f` - only one is ever meaningfully visible.
 * - A pillar's title exits UPWARD via `tail()` easing as it passes (u>=0),
 *   and enters from BELOW via smoothstep as it approaches (u<0) - this
 *   asymmetry, not a symmetric fade, is what beat4() actually does. The
 *   body text rides the same curve at 72% of the distance (subtler
 *   parallax, not a separate animation).
 * - A small diamond tick per pillar sits on the beam, rotating/scaling up
 *   as its pillar comes into focus; on desktop only, a ghost label of the
 *   pillar's title sits by its tick and fades as that pillar takes focus
 *   (the big title above already carries it once focused).
 */
export function Foundation() {
  const sceneRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const titleRefs = useRef<Array<HTMLDivElement | null>>([]);
  const bodyRefs = useRef<Array<HTMLDivElement | null>>([]);
  const tickRefs = useRef<Array<HTMLDivElement | null>>([]);
  const periRefs = useRef<Array<HTMLDivElement | null>>([]);
  const beamRef = useRef<SVGPathElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const aboveSlotRef = useRef<HTMLDivElement | null>(null);
  const belowSlotRef = useRef<HTMLDivElement | null>(null);
  const dims = useRef({ W: 0, H: 0, LY: 0 });

  function measure() {
    const stage = stageRef.current;
    if (!stage) return;
    const W = stage.offsetWidth;
    const H = stage.offsetHeight;
    const across = W >= 900;
    const LY = Math.round(H * (across ? 0.6 : 0.5));
    dims.current = { W, H, LY };

    svgRef.current?.setAttribute("viewBox", `0 0 ${W} ${H}`);
    beamRef.current?.setAttribute("d", `M0 ${LY} L${W} ${LY}`);

    // The above/below slots must stop right at the beam (LY), not span the
    // whole stage - this has to be measured, not a static Tailwind class,
    // because LY depends on the stage's live pixel height.
    if (aboveSlotRef.current) {
      aboveSlotRef.current.style.top = "0px";
      aboveSlotRef.current.style.height = `${LY - (across ? 34 : 26)}px`;
    }
    if (belowSlotRef.current) {
      belowSlotRef.current.style.top = `${LY + (across ? 40 : 28)}px`;
      belowSlotRef.current.style.height = `${H - LY}px`;
    }

    tickRefs.current.forEach((el, i) => {
      if (!el) return;
      el.style.left = `${((i + 0.5) / N) * 100}%`;
      el.style.top = `${LY}px`;
    });
    periRefs.current.forEach((el, i) => {
      if (!el) return;
      el.style.left = `${((i + 0.5) / N) * 100}%`;
      el.style.top = `${LY + 18}px`;
    });
  }

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useScrub(sceneRef, stageRef, (p) => {
    const f = stepF(p, N);
    const { W, LY } = dims.current;
    const across = W >= 900;
    const idx = Math.round(f);
    const settle = 1 - Math.abs(f - idx) * 2;
    const load = lerp(2, across ? 16 : 12, sm(c01(settle)));
    const cx = lerp(
      ((idx + 0.5) / N) * W,
      ((Math.min(N - 1, idx + 1) + 0.5) / N) * W,
      c01(f - idx),
    );
    beamRef.current?.setAttribute("d", `M0 ${LY} Q ${cx} ${LY + load} ${W} ${LY}`);

    pillars.forEach((_, i) => {
      const u = f - i;
      const k = u >= 0 ? sm(c01(1 - u * 2.25)) : sm(c01(1 + u * 2.25));
      const y = u >= 0 ? -tail(c01(u)) * 72 : (1 - sm(c01(1 + u))) * 64;
      const title = titleRefs.current[i];
      const body = bodyRefs.current[i];
      if (title) {
        title.style.opacity = String(k);
        title.style.transform = `translateY(${y}px)`;
      }
      if (body) {
        body.style.opacity = String(k);
        body.style.transform = `translateY(${y * 0.72}px)`;
      }
    });

    tickRefs.current.forEach((el, i) => {
      if (!el) return;
      const on = sm(c01(1 - Math.abs(f - i)));
      el.style.opacity = String(lerp(i < f ? 0.55 : 0.22, 1, on));
      el.style.transform = `translate(-50%, -50%) rotate(45deg) scale(${lerp(1, 1.9, on)})`;
      el.style.top = `${LY + (i === idx ? load * 0.55 : 0)}px`;
      const peri = periRefs.current[i];
      if (peri) peri.style.opacity = String(lerp(0.38, 0, on));
    });
  });

  return (
    <section ref={sceneRef} className="relative" style={{ height: "355svh" }}>
      <div ref={stageRef} className="fBg relative h-svh overflow-hidden bg-navy">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(rgb(191 166 113 / 11%) 1.1px, transparent 1.2px)",
            backgroundSize: "18px 18px",
          }}
        />

        <svg ref={svgRef} className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
          <path ref={beamRef} fill="none" stroke="var(--color-gold-d)" strokeWidth={1.4} />
        </svg>

        <div ref={aboveSlotRef} className="absolute inset-x-8 min-[900px]:inset-x-[8vw]">
          {pillars.map((pillar, i) => (
            <div
              key={pillar.title}
              ref={(el) => {
                titleRefs.current[i] = el;
              }}
              className="absolute inset-x-0 bottom-0 text-center will-change-transform"
            >
              <span className="font-serif text-xs font-semibold tracking-[0.2em] text-gold">
                {pillar.number} &middot; {pillar.category.toUpperCase()}
              </span>
              <h3 className="mx-auto max-w-[16ch] font-serif text-[clamp(30px,9.5vw,52px)] font-semibold uppercase leading-[1] text-ivory min-[900px]:text-[clamp(50px,6.2vw,92px)]">
                {pillar.title}
              </h3>
            </div>
          ))}
        </div>

        <div ref={belowSlotRef} className="absolute inset-x-8 min-[900px]:inset-x-[8vw]">
          {pillars.map((pillar, i) => (
            <div
              key={`${pillar.title}-body`}
              ref={(el) => {
                bodyRefs.current[i] = el;
              }}
              className="absolute inset-x-0 top-0 mx-auto max-w-[40ch] text-center will-change-transform min-[900px]:max-w-[44ch]"
            >
              <p className="text-base leading-relaxed text-ivory/88 min-[900px]:text-[clamp(17px,1.45vw,22px)]">
                {pillar.said}
              </p>
            </div>
          ))}
        </div>

        {pillars.map((pillar, i) => (
          <div
            key={`${pillar.title}-tick`}
            ref={(el) => {
              tickRefs.current[i] = el;
            }}
            className="absolute h-[9px] w-[9px] bg-gold will-change-transform min-[900px]:h-[11px] min-[900px]:w-[11px]"
          />
        ))}

        {pillars.map((pillar, i) => (
          <div
            key={`${pillar.title}-peri`}
            ref={(el) => {
              periRefs.current[i] = el;
            }}
            className="absolute hidden -translate-x-1/2 font-serif text-[13px] font-semibold text-gold-d min-[900px]:block"
          >
            {pillar.title}
          </div>
        ))}
      </div>
    </section>
  );
}
