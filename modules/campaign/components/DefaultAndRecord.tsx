"use client";

import { useRef, useState } from "react";
import { defaultBeat } from "@/modules/campaign/data/default-beat";
import { record } from "@/modules/campaign/data/record";
import { useScrub } from "@/modules/campaign/hooks/useScrub";
import { c01, sm } from "@/modules/campaign/lib/beatMath";

const SHOW_THRESHOLD = 0.55;

/**
 * Beats 2 and 3 share one section and one sticky stage (ARCHITECTURE.md
 * section 2's "single most surprising thing about the structure"). The band
 * is a layer inside the stage that creeps up from below and buries beat 2 as
 * scroll progress crosses roughly the midpoint of the 300vh scene.
 *
 * Sizing/breakpoints below are ported from the handoff build's
 * site/index.html (.default/.dContent/.boxes/.box/.bl-inner, base rules plus
 * the min-width:900px overrides), not invented - column boxes below 900px,
 * a horizontal row above it; the record panel becomes a two-column grid at
 * the same breakpoint. ml-[168px]/mr-[440px] are this project's own added
 * indent, not present in the source.
 */
export function DefaultAndRecord() {
  const sceneRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const circleRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const bandRef = useRef<HTMLDivElement | null>(null);
  const [shown, setShown] = useState(false);

  useScrub(sceneRef, stageRef, (p) => {
    if (circleRef.current) {
      const travel = c01(p);
      circleRef.current.style.transformOrigin = "top right";
      circleRef.current.style.transform = `scale(${1 + travel * 1.3})`;
    }
    if (contentRef.current) {
      contentRef.current.style.opacity = String(1 - c01(p / 0.5));
    }
    if (bandRef.current) {
      const travel = 105 * (1 - sm(c01(p / 0.85)));
      bandRef.current.style.transform = `translateY(${travel}vh)`;
    }
    setShown(p > SHOW_THRESHOLD);
  });

  return (
    <section ref={sceneRef} className="relative" style={{ height: "300vh" }}>
      <div
        ref={stageRef}
        className="sticky top-0 flex h-dvh flex-col justify-center overflow-hidden bg-ivory px-8"
      >
        <div
          ref={circleRef}
          className="absolute right-[-170px] top-[-190px] z-0 h-[340px] w-[340px] rounded-full bg-blush-w will-change-transform min-[900px]:right-[-11vw] min-[900px]:top-[-14vw] min-[900px]:h-[34vw] min-[900px]:w-[34vw] min-[900px]:max-h-[620px] min-[900px]:max-w-[620px]"
        />

        <div ref={contentRef} className="relative z-[1] will-change-[opacity] min-[900px]:ml-[168px]">
          <p className="max-w-[640px] font-serif text-[29px] font-medium leading-[1.3] text-navy min-[900px]:max-w-[22ch] min-[900px]:text-[clamp(40px,3.4vw,58px)] min-[900px]:leading-[1.22]">
            {defaultBeat.question}
          </p>
          <div className="mt-11 flex flex-wrap gap-4 min-[900px]:mr-[440px]">
            {defaultBeat.boxes.map((label) => (
              <div
                key={label}
                className="flex min-w-[180px] flex-1 items-center justify-center border-2 border-navy bg-ivory px-6 py-7 text-center text-base font-semibold uppercase tracking-[0.18em] text-navy transition-colors duration-200 hover:bg-navy hover:text-ivory sm:text-lg"
              >
                {label}
              </div>
            ))}
          </div>
        </div>

        <div
          ref={bandRef}
          className="absolute inset-x-0 top-0 h-[145%] will-change-transform"
          style={{ transform: "translateY(105vh)" }}
        >
          <div className="absolute left-[-52%] top-0 h-[135%] w-[204%] rounded-t-full bg-gold" />
          <div className="absolute left-[-52%] top-1 h-[135%] w-[204%] overflow-hidden rounded-t-full bg-navy">
            {/* The parent curved band is w-[204%] at left-[-52%], so a block sized
                against it lands ~195px off-canvas on a phone and the Record is
                invisible for ~2.9 screens. 100/204 = 49.02% is exactly the stage
                width. Not 100vw: that counts the scrollbar and reintroduces
                horizontal scroll. */}
            <div className="relative mx-auto w-[49.02%] max-w-[820px] px-8 pt-[24vh] text-ivory min-[900px]:grid min-[900px]:max-w-[1280px] min-[900px]:grid-cols-[0.8fr_1.7fr] min-[900px]:items-start min-[900px]:gap-[6vw] min-[900px]:px-[4vw] min-[900px]:pt-[27vh]">
              <h2 className="font-serif text-[32px] font-semibold tracking-[0.04em] min-[900px]:text-[clamp(48px,4vw,68px)]">
                {record.heading}
              </h2>
              <ul className="mt-6 flex flex-col gap-3 min-[900px]:mt-0">
                {record.items.map((item, i) => (
                  <li
                    key={item}
                    className="text-sm leading-relaxed transition-all duration-500 ease-out"
                    style={{
                      transitionDelay: `${i * 120}ms`,
                      opacity: shown ? 1 : 0,
                      transform: shown ? "translateY(0)" : "translateY(-16px)",
                    }}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
