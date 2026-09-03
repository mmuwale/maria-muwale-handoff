"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { opener } from "@/modules/campaign/data/opener";
import { useScrub } from "@/modules/campaign/hooks/useScrub";
import { fade } from "@/modules/campaign/lib/openerMath";
import { Countdown } from "@/components/Countdown";

/**
 * Beat 1. Ported directly from the handoff build's beat1(s) function
 * (site/index.html), not reinvented:
 *
 *   opName:     translateY(s * vh * 0.3) + scale(1 - s*0.22), no opacity
 *               change - the name persists at full opacity, drifting
 *               toward the bottom of the viewport and shrinking slightly.
 *   eyebrow:    opacity 1 - s*1.6, no movement - a straight fade in place.
 *   portrait:   translateX(s*55%), opacity 1 - s*1.15 - moves right, away.
 *   circle:     translateX(s*40%), opacity 1 - s*1.05 - moves right, away.
 *
 * Nothing converges toward the center. The eyebrow/copy fades in place;
 * the portrait and circle drift apart to the right as they fade. The name
 * is the only thing that survives to the end of the beat, lower and
 * smaller than where it started.
 */
export function Opener() {
  const sceneRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const nameGroupRef = useRef<HTMLDivElement | null>(null);
  const eyebrowRef = useRef<HTMLDivElement | null>(null);
  const copyRef = useRef<HTMLDivElement | null>(null);
  const portraitRef = useRef<HTMLImageElement | null>(null);
  const circleRef = useRef<HTMLDivElement | null>(null);

  useScrub(sceneRef, stageRef, (s) => {
    const vh = window.innerHeight;

    if (nameGroupRef.current) {
      nameGroupRef.current.style.transform = `translateY(${s * vh * 0.3}px) scale(${1 - s * 0.22})`;
      nameGroupRef.current.style.transformOrigin = "left top";
    }
    if (eyebrowRef.current) {
      eyebrowRef.current.style.opacity = String(fade(s, 1.6));
    }
    if (copyRef.current) {
      copyRef.current.style.opacity = String(fade(s, 1.6));
    }
    if (portraitRef.current) {
      portraitRef.current.style.transform = `translateX(${s * 55}%)`;
      portraitRef.current.style.opacity = String(fade(s, 1.15));
    }
    if (circleRef.current) {
      circleRef.current.style.transform = `translateX(${s * 40}%)`;
      circleRef.current.style.opacity = String(fade(s, 1.05));
    }
  });

  return (
    <section ref={sceneRef} className="relative" style={{ height: "190vh" }}>
      <div ref={stageRef} className="sticky top-0 h-dvh overflow-hidden bg-ivory">
        <div className="relative z-10 grid h-full grid-cols-1 gap-8 px-8 py-10 sm:grid-cols-2 sm:gap-16 sm:px-16 sm:py-14 lg:px-24">
          <div className="flex flex-col gap-10 sm:h-full sm:justify-between">
            <div ref={nameGroupRef} className="mt-10 will-change-transform">
              <div className="relative overflow-hidden">
                <span className="op-writeon relative inline-block align-top font-serif text-[clamp(64px,11vw,148px)] font-semibold leading-[0.84] tracking-[0.01em] text-navy">
                  {opener.first}
                  <span className="op-sweep pointer-events-none absolute inset-y-0 left-[-40%] w-[34%] bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
                </span>
              </div>
              <div className="relative overflow-hidden">
                <span className="op-writeon op-writeon-delay relative inline-block align-top font-serif text-[clamp(64px,11vw,148px)] font-semibold leading-[0.84] tracking-[0.01em] text-blush-i">
                  {opener.last}
                  <span className="op-sweep pointer-events-none absolute inset-y-0 left-[-40%] w-[34%] bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
                </span>
              </div>

              <div ref={eyebrowRef} className="mt-9">
                <div className="mb-2 flex items-center gap-2.5">
                  <span className="h-px w-12 bg-gold-d" />
                  <span className="text-sm font-bold uppercase tracking-[0.28em] text-gold-d sm:text-base">
                    For
                  </span>
                  <span className="h-px w-12 bg-gold-d" />
                </div>
                <div className="text-sm font-semibold uppercase tracking-[0.28em] text-black sm:text-base">
                  {opener.office}
                </div>
                <div className="text-sm font-semibold uppercase tracking-[0.28em] text-gold-d sm:text-base">
                  {opener.institution}
                </div>
              </div>
            </div>

            <div ref={copyRef} className="flex flex-col gap-5">
              <div className="text-xl font-bold uppercase tracking-[0.14em] text-navy sm:text-2xl">
                Connect &middot; Engage &middot; Excel
              </div>

              <p className="max-w-[480px] font-serif text-[22px] leading-[1.35] text-navy/85 sm:text-[26px]">
                What if our academic experience could be more than classes,
                examinations and waiting for graduation?
              </p>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/manifesto"
                  className="rounded-full bg-navy px-5 py-3 text-sm font-bold text-ivory transition-colors hover:bg-navy-d"
                >
                  Explore my vision
                </Link>
                <Link
                  href="#vote"
                  className="rounded-full border border-navy px-5 py-3 text-sm font-bold text-navy transition-colors hover:bg-navy/5"
                >
                  Meet Maria
                </Link>
              </div>

              <div className="mt-1">
                <Countdown theme="light" />
              </div>
            </div>
          </div>

          <div className="relative h-full">
            <div
              ref={circleRef}
              className="absolute right-[-40px] top-1/2 z-0 h-[480px] w-[480px] -translate-y-1/2 rounded-full bg-blush-w will-change-transform sm:right-[-60px] sm:h-[620px] sm:w-[620px] lg:h-[760px] lg:w-[760px]"
            />
            <Image
              ref={portraitRef}
              src="/images/portrait-inline.webp"
              alt="Maria Muwale"
              width={460}
              height={664}
              priority
              className="absolute bottom-0 right-[75px] z-10 w-[min(420px,64vw)] drop-shadow-[0_20px_30px_rgba(11,31,58,0.18)] will-change-transform sm:right-[95px] sm:w-[min(520px,42vw)]"
            />
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-[9px] font-medium uppercase tracking-[0.3em] text-navy/50">
          {opener.cue}
        </div>

        <div className="absolute inset-x-0 bottom-0 z-[6] h-2.5 bg-navy" />
      </div>
    </section>
  );
}
