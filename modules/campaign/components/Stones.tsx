"use client";

import { useRef, useState } from "react";
import { stones } from "@/modules/campaign/data/stones";
import { useScrub } from "@/modules/campaign/hooks/useScrub";
import { c01, sm } from "@/modules/campaign/lib/beatMath";
import { Button } from "@/components/Button";

const STONE_COUNT = 6;

/** Hand-authored pebble geometry (code, not a generated asset) - see CONSTRAINTS.md #1. */
function StoneShape({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 44" className={className} aria-hidden>
      <path
        d="M6 30 C2 20 10 8 24 6 C38 4 56 8 60 20 C64 32 52 40 34 40 C20 40 8 38 6 30 Z"
        fill="var(--color-gold)"
      />
    </svg>
  );
}

export function Stones() {
  const sceneRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState(0);

  useScrub(sceneRef, stageRef, setProgress);

  const stoneOpacities = Array.from({ length: STONE_COUNT }, (_, i) => {
    const start = i * 0.1;
    return sm(c01((progress - start) / 0.15));
  });

  const phraseOpacities = stones.phrases.map((_, i) => {
    const start = 0.65 + i * 0.1;
    return sm(c01((progress - start) / 0.12));
  });

  return (
    <section ref={sceneRef} className="relative" style={{ height: "300svh" }}>
      <div
        ref={stageRef}
        className="relative flex h-svh flex-col items-center justify-center overflow-hidden bg-navy px-8 text-center"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            background:
              "radial-gradient(115% 78% at 50% 42%, transparent 40%, rgb(4 12 24 / 48%) 100%)",
          }}
        />

        <div className="relative z-[1] font-serif text-[clamp(32px,7vw,56px)] font-semibold uppercase text-ivory">
          {stones.meansLine1}
        </div>
        <div className="relative z-[1] mt-1 font-serif text-lg text-blush-n">
          {stones.meansLine2}
        </div>
        <div className="relative z-[1] mt-1 text-xs uppercase tracking-[0.24em] text-gold">
          {stones.meansLine3}
        </div>

        <div className="relative z-[1] mt-10 flex gap-3">
          {stoneOpacities.map((opacity, i) => (
            <div
              key={i}
              style={{
                opacity,
                transform: `translateY(${(1 - opacity) * -30}px)`,
              }}
            >
              <StoneShape className="h-8 w-12 will-change-transform" />
            </div>
          ))}
        </div>

        <div className="relative z-[1] mt-10 flex flex-col gap-1.5">
          {stones.phrases.map((phrase, i) => (
            <p
              key={phrase}
              className="font-serif text-xl text-ivory"
              style={{ opacity: phraseOpacities[i] }}
            >
              {phrase}
            </p>
          ))}
        </div>

        <div
          className="relative z-[1] mt-10"
          style={{ opacity: phraseOpacities[phraseOpacities.length - 1] }}
        >
          <Button href="/manifesto" variant="secondary">
            {stones.manifestoLink}
          </Button>
        </div>
      </div>
    </section>
  );
}
