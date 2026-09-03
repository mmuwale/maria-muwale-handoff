"use client";

import { useRef } from "react";
import { stones } from "@/modules/campaign/data/stones";
import { useScrub } from "@/modules/campaign/hooks/useScrub";
import { c01, sm, land, lerp } from "@/modules/campaign/lib/beatMath";
import { Button } from "@/components/Button";

/** Depth per stone, nearest to farthest - ported verbatim from the handoff
 *  build's six `data-d` values (site/index.html, beat 5's desktop field). */
const STONE_DEPTHS = [0.15, 0.35, 0.5, 0.7, 0.85, 1.0];
const STONE_START = 0.1;
const STONE_STEP = 0.085;
const STONE_WINDOW = 0.34;
const PHRASE_WRITE = 0.13;

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

/**
 * Beat 5. The stones land one after another - ported from the handoff
 * build's b5run()/land()/b5phrases(): each stone's drop distance is set by
 * its depth (nearer stones fall less, a parallax cue), staggered
 * STONE_STEP apart, eased by land() ("weight, not spring: covers ground
 * early, decelerates long into the seat"). The three phrases wipe on via
 * clip-path exactly as the 2nd, 4th and 6th stones finish landing.
 */
export function Stones() {
  const sceneRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const stoneRefs = useRef<Array<HTMLDivElement | null>>([]);
  const phraseRefs = useRef<Array<HTMLParagraphElement | null>>([]);
  const groundRef = useRef<HTMLDivElement | null>(null);
  const linkRef = useRef<HTMLDivElement | null>(null);

  useScrub(sceneRef, stageRef, (p) => {

    stoneRefs.current.forEach((el, i) => {
      const t = land(c01((p - STONE_START - i * STONE_STEP) / STONE_WINDOW));
      if (!el) return;
      const drop = lerp(-170, -92, STONE_DEPTHS[i]);
      const rot = lerp(-7, 6.5, i % 2 ? 1 : 0);
      el.style.transform = `translateY(${lerp(drop, 0, t)}px) rotate(${lerp(rot, 0, t)}deg)`;
      el.style.opacity = String(Math.min(1, t * 1.6));
    });

    if (groundRef.current) {
      const reach = sm(c01((p - 0.06) / 0.3));
      groundRef.current.style.transform = `scaleX(${reach})`;
      groundRef.current.style.opacity = String(reach);
    }

    phraseRefs.current.forEach((el, j) => {
      if (!el) return;
      const seatsAt = STONE_START + (2 * j + 1) * STONE_STEP + 0.2;
      const t = sm(c01((p - seatsAt) / PHRASE_WRITE));
      el.style.clipPath = `inset(0 ${((1 - t) * 100).toFixed(2)}% 0 0)`;
    });

    if (linkRef.current) {
      const lastPhraseSeat = STONE_START + (2 * 2 + 1) * STONE_STEP + 0.2 + PHRASE_WRITE;
      linkRef.current.style.opacity = String(sm(c01((p - lastPhraseSeat) / 0.1)));
    }
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
          {STONE_DEPTHS.map((depth, i) => (
            <div
              key={depth}
              ref={(el) => {
                stoneRefs.current[i] = el;
              }}
              className="will-change-transform"
            >
              <StoneShape className="h-8 w-12" />
            </div>
          ))}
        </div>

        <div
          ref={groundRef}
          className="relative z-[1] mt-4 h-px w-64 origin-center bg-gold-d/50 will-change-transform"
        />

        <div className="relative z-[1] mt-10 flex flex-col gap-1.5">
          {stones.phrases.map((phrase, j) => (
            <p
              key={phrase}
              ref={(el) => {
                phraseRefs.current[j] = el;
              }}
              className="font-serif text-xl text-ivory"
              style={{ clipPath: "inset(0 100% 0 0)" }}
            >
              {phrase}
            </p>
          ))}
        </div>

        <div ref={linkRef} className="relative z-[1] mt-10" style={{ opacity: 0 }}>
          <Button href="/manifesto" variant="secondary">
            {stones.manifestoLink}
          </Button>
        </div>
      </div>
    </section>
  );
}
