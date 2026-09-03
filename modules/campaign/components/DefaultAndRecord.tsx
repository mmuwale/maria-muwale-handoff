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
 */
export function DefaultAndRecord() {
  const sceneRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const circleRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const bandRef = useRef<HTMLDivElement | null>(null);
  const [shown, setShown] = useState(false);

  useScrub(sceneRef, stageRef, (p) => {
    const eased = sm(p);
    if (circleRef.current) {
      circleRef.current.style.transform = `scale(${1 + eased * 1.4})`;
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
          className="absolute right-[-170px] top-[-190px] z-0 h-[340px] w-[340px] rounded-full bg-blush-w will-change-transform"
        />

        <div ref={contentRef} className="relative z-[1] will-change-[opacity]">
          <p className="max-w-[640px] font-serif text-[29px] font-medium leading-[1.3] text-navy">
            {defaultBeat.question}
          </p>
          <div className="mt-11 flex max-w-[900px] flex-col gap-3">
            {defaultBeat.boxes.map((label) => (
              <div
                key={label}
                className="border-2 border-navy bg-ivory px-4 py-[22px] text-center text-[12.5px] font-medium uppercase tracking-[0.18em] text-navy"
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
            <div className="relative mx-auto max-w-[820px] px-8 pt-[24vh] text-ivory">
              <h2 className="font-serif text-[32px] font-semibold tracking-[0.04em]">
                {record.heading}
              </h2>
              <ul className="mt-6 flex flex-col gap-3">
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
