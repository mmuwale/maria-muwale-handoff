"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { opener } from "@/modules/campaign/data/opener";
import { Countdown } from "@/components/Countdown";
import { useScrub } from "@/modules/campaign/hooks/useScrub";
import { fade } from "@/modules/campaign/lib/openerMath";

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
        {/* On phones this is one column, so the two children are two rows. With
            equal default tracks the text row overflows its track and collides
            with the portrait. grid-rows-[auto_minmax(0,1fr)] lets the text take
            what it needs and gives the portrait whatever is left. */}
        <div className="relative z-10 grid h-full grid-cols-1 gap-4 px-8 pb-14 pt-[76px] min-[900px]:grid-cols-2 min-[900px]:gap-16 min-[900px]:px-16 min-[900px]:pb-14 min-[900px]:pt-14 lg:px-24">
          <div className="z-20 flex min-w-0 flex-col gap-6 min-[900px]:h-full min-[900px]:justify-between min-[900px]:gap-10">
            <div ref={nameGroupRef} className="mt-2 will-change-transform min-[900px]:mt-10">
              {/* Her name is the page's h1. The campaign page previously had no
                  h1 at all, so the whole heading outline started at h2. This is
                  a block wrapper with no styling of its own, so the two lines
                  lay out exactly as before. */}
              <h1 className="m-0 text-inherit font-normal">
                <div className="relative overflow-hidden">
                  <span className="op-writeon relative inline-block align-top font-serif text-[clamp(46px,11vw,148px)] min-[900px]:text-[min(calc((100vw-192px)/9),148px)] lg:text-[min(calc((100vw-256px)/9),148px)] font-semibold leading-[0.84] tracking-[0.01em] text-navy">
                    {opener.first}
                    <span className="op-sweep pointer-events-none absolute inset-y-0 left-[-40%] w-[34%] bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
                  </span>
                </div>
                <div className="relative overflow-hidden">
                  <span className="op-writeon op-writeon-delay relative inline-block align-top font-serif text-[clamp(46px,11vw,148px)] min-[900px]:text-[min(calc((100vw-192px)/9),148px)] lg:text-[min(calc((100vw-256px)/9),148px)] font-semibold leading-[0.84] tracking-[0.01em] text-blush-i">
                    {opener.last}
                    <span className="op-sweep pointer-events-none absolute inset-y-0 left-[-40%] w-[34%] bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
                  </span>
                </div>
              </h1>

              <div ref={eyebrowRef} className="mt-5 min-[900px]:mt-9">
                <div className="mb-2 flex items-center gap-2.5">
                  <span className="h-px w-12 bg-gold-d" />
                  <span className="text-sm font-bold uppercase tracking-[0.28em] text-gold-d min-[900px]:text-base">
                    For
                  </span>
                  <span className="h-px w-12 bg-gold-d" />
                </div>
                <div className="text-sm font-semibold uppercase tracking-[0.28em] text-black min-[900px]:text-base">
                  {opener.office}
                </div>
                <div className="text-sm font-semibold uppercase tracking-[0.28em] text-gold-d min-[900px]:text-base">
                  {opener.institution}
                </div>
              </div>
            </div>

            <div ref={copyRef} className="flex flex-col gap-3 min-[900px]:gap-5">
              {/* Button and clock are one block, bottom left, with the button
                  centred over the clock. On phones it is pinned to the foot of
                  the stage; from 900px the column is justify-between so it
                  already sits in the bottom corner. */}
              <div className="absolute bottom-[54px] left-8 flex w-fit flex-col items-center gap-3 min-[900px]:static">
                <Link
                  href="/manifesto"
                  className="rounded-full bg-navy px-4 py-2.5 text-[13px] font-bold text-ivory transition-colors hover:bg-navy-d min-[900px]:px-5 min-[900px]:py-3 min-[900px]:text-sm"
                >
                  Explore my vision
                </Link>
                <Countdown theme="light" />
              </div>
            </div>
          </div>

          <div className="absolute inset-x-8 bottom-14 top-[76px] z-0 min-[900px]:relative min-[900px]:inset-auto min-[900px]:h-full min-[900px]:min-h-0">
            <div
              ref={circleRef}
              className="absolute right-[-96px] bottom-[6%] z-0 h-[min(300px,54%)] w-[min(300px,72vw)] rounded-full bg-blush-w will-change-transform min-[900px]:right-[-60px] min-[900px]:top-1/2 min-[900px]:h-[620px] min-[900px]:w-[620px] min-[900px]:-translate-y-1/2 lg:h-[760px] lg:w-[760px]"
            />
            <Image
              ref={portraitRef}
              src="/images/portrait-inline.webp"
              alt="Maria Muwale"
              width={460}
              height={664}
              priority
              className="absolute bottom-[-40px] right-[-50px] z-10 h-auto max-h-[58vh] w-[min(344px,82vw)] max-w-none object-contain object-bottom drop-shadow-[0_20px_30px_rgba(11,31,58,0.18)] will-change-transform min-[900px]:bottom-0 min-[900px]:right-[95px] min-[900px]:max-h-none min-[900px]:w-[min(520px,42vw)]"
            />
          </div>
        </div>

        <div className="absolute bottom-6 left-8 z-20 text-[9px] font-medium uppercase tracking-[0.3em] text-navy/50 min-[900px]:left-1/2 min-[900px]:bottom-8 min-[900px]:-translate-x-1/2">
          {opener.cue}
        </div>

        <div className="absolute inset-x-0 bottom-0 z-[6] h-2.5 bg-navy" />
      </div>
    </section>
  );
}
