"use client";

import { useRef } from "react";
import Image from "next/image";
import { opener } from "@/modules/campaign/data/opener";
import { useScrub } from "@/modules/campaign/hooks/useScrub";
import { sm } from "@/modules/campaign/lib/beatMath";

/**
 * Beat 1. The name write-on is a mount animation (CSS keyframes, plays once
 * regardless of scroll). Everything else - name drift, portrait, circle,
 * sub-line - is scroll-scrubbed across the 190dvh scene while the stage
 * stays pinned by native `position: sticky`.
 */
export function Opener() {
  const sceneRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const nameRef = useRef<HTMLDivElement | null>(null);
  const subRef = useRef<HTMLDivElement | null>(null);
  const portraitRef = useRef<HTMLImageElement | null>(null);
  const circleRef = useRef<HTMLDivElement | null>(null);

  useScrub(sceneRef, stageRef, (p) => {
    const eased = sm(p);
    if (nameRef.current) {
      nameRef.current.style.transform = `translateY(${eased * -40}px) scale(${1 - eased * 0.08})`;
      nameRef.current.style.transformOrigin = "left top";
    }
    if (subRef.current) {
      subRef.current.style.opacity = String(1 - eased);
    }
    if (portraitRef.current) {
      portraitRef.current.style.transform = `translateX(${eased * 60}px)`;
      portraitRef.current.style.opacity = String(1 - eased);
    }
    if (circleRef.current) {
      circleRef.current.style.transform = `scale(${1 + eased * 0.6})`;
    }
  });

  return (
    <section ref={sceneRef} className="relative" style={{ height: "190vh" }}>
      <div
        ref={stageRef}
        className="sticky top-0 h-dvh overflow-hidden bg-ivory"
      >
        <div
          ref={circleRef}
          className="absolute right-[-150px] top-[21%] z-[1] h-[360px] w-[360px] rounded-full bg-blush-w will-change-transform"
        />

        <Image
          src="/images/crest.png"
          alt="Strathmore University crest"
          width={52}
          height={56}
          className="absolute right-6 top-[22px] z-[2] w-[52px]"
        />

        <Image
          ref={portraitRef}
          src="/images/portrait-inline.webp"
          alt="Maria Muwale"
          width={344}
          height={496}
          priority
          className="absolute bottom-6 right-[-54px] z-[3] w-[min(344px,82vw)] will-change-transform"
        />

        <div className="absolute left-6 right-6 top-24 z-[4]">
          <div ref={nameRef} className="will-change-transform">
            <div className="relative overflow-hidden pr-[86px]">
              <span className="op-writeon relative inline-block align-top font-serif text-[clamp(40px,12.5vw,56px)] font-semibold leading-none tracking-[0.03em] text-navy">
                {opener.first}
                <span className="op-sweep pointer-events-none absolute inset-y-0 left-[-40%] w-[34%] bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
              </span>
            </div>
            <div className="relative mt-1 overflow-hidden">
              <span className="op-writeon op-writeon-delay relative inline-block align-top font-serif text-[clamp(40px,12.5vw,56px)] font-semibold leading-none tracking-[0.03em] text-blush-i">
                {opener.last}
                <span className="op-sweep pointer-events-none absolute inset-y-0 left-[-40%] w-[34%] bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
              </span>
            </div>
          </div>

          <div ref={subRef} className="mt-[18px]">
            <div className="flex items-center gap-2.5">
              <span className="h-px w-[26px] bg-gold-d" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.32em] text-gold-d">
                {opener.forLabel}
              </span>
            </div>
            <div className="mt-2.5 text-xs font-medium uppercase leading-[1.7] tracking-[0.16em] text-navy">
              {opener.office}
            </div>
            <div className="mt-2 text-[9.5px] font-medium uppercase tracking-[0.24em] text-navy/60">
              {opener.institution}
            </div>
          </div>
        </div>

        <div className="absolute bottom-[34px] left-6 z-[5] text-[9px] font-medium uppercase tracking-[0.3em] text-navy/50">
          {opener.cue}
        </div>

        <div className="absolute inset-x-0 bottom-0 z-[6] h-2.5 bg-navy" />
      </div>
    </section>
  );
}
