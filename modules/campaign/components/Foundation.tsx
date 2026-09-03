"use client";

import { useRef, useState } from "react";
import { pillars } from "@/modules/shared/data/pillars";
import { useScrub } from "@/modules/campaign/hooks/useScrub";
import { stepF } from "@/modules/campaign/lib/beatMath";

const N = pillars.length;

function cardVisual(index: number, k: number) {
  const local = Math.max(-1, Math.min(1, index - k));
  const opacity = 1 - Math.abs(local);
  const translateY = local * 36;
  return { opacity, translateY };
}

/**
 * Beat 4. Four pillars cross a beam one handoff at a time - title above the
 * line, wording below it. `stepF` turns overall scene progress into a
 * continuous card index; each card's opacity/position derives from its
 * distance to that index. Ticks and periphery labels sit on the beam itself.
 */
export function Foundation() {
  const sceneRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [index, setIndex] = useState(0);

  useScrub(sceneRef, stageRef, (p) => {
    setIndex(stepF(p, N));
  });

  return (
    <section ref={sceneRef} className="relative" style={{ height: "355svh" }}>
      <div
        ref={stageRef}
        className="fBg relative h-svh overflow-hidden bg-navy"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(rgb(191 166 113 / 11%) 1.1px, transparent 1.2px)",
            backgroundSize: "18px 18px",
          }}
        />

        <div className="absolute inset-x-0 top-[58%] h-px bg-gold-d/60" />

        {pillars.map((pillar, k) => {
          const { opacity, translateY } = cardVisual(index, k);
          return (
            <div
              key={pillar.title}
              className="absolute inset-x-8 top-[58%] flex -translate-y-full flex-col items-center gap-2 text-center will-change-transform"
              style={{
                opacity,
                transform: `translateY(calc(-100% + ${translateY}px))`,
              }}
            >
              <span className="font-serif text-xs font-semibold tracking-[0.2em] text-gold">
                {pillar.number} · {pillar.category.toUpperCase()}
              </span>
              <h3 className="max-w-[720px] font-serif text-[clamp(28px,6vw,48px)] font-semibold uppercase leading-[1.05] text-ivory">
                {pillar.title}
              </h3>
            </div>
          );
        })}

        {pillars.map((pillar, k) => {
          const { opacity, translateY } = cardVisual(index, k);
          return (
            <div
              key={`${pillar.title}-body`}
              className="absolute inset-x-8 top-[62%] mx-auto max-w-[560px] text-center will-change-transform"
              style={{
                opacity,
                transform: `translateY(${translateY}px)`,
              }}
            >
              <p className="text-[15px] leading-relaxed text-ivory/85">
                {pillar.said}
              </p>
            </div>
          );
        })}

        <div className="absolute inset-x-8 top-[58%] flex -translate-y-1/2 justify-between">
          {pillars.map((pillar, k) => (
            <span
              key={pillar.number}
              className="h-2 w-2 rounded-full transition-colors duration-300"
              style={{
                backgroundColor:
                  Math.abs(index - k) < 0.5 ? "var(--color-gold)" : "rgba(191,166,113,0.35)",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
