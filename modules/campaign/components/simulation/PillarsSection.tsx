"use client";

import { useEffect, useRef } from "react";
import { pillars, pillarsIntro } from "@/modules/campaign/data/simulation-block";
import { PillarCard } from "./PillarCard";
import { playfair } from "./playfair";
import "./simulation-animations.css";

/* Per-pillar accent + glow — each card can pull its own tone */
const ACCENT_COLORS = [
  "#D28380",
  "#B85B57",
  "#9B6B68",
  "#C98B88",
] as const;

const ACCENT_GRADIENTS = [
  "radial-gradient(circle at 30% 20%, #D28380, transparent 70%)",
  "radial-gradient(circle at 70% 30%, #B85B57, transparent 70%)",
  "radial-gradient(circle at 40% 80%, #9B6B68, transparent 70%)",
  "radial-gradient(circle at 60% 40%, #C98B88, transparent 70%)",
] as const;

export function PillarsSection() {
  const wrapRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    /* Only enable sticky stacking on wider viewports */
    if (window.matchMedia("(max-width: 800px)").matches) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const wrap = e.target as HTMLDivElement;
          if (e.isIntersecting) {
            wrap.classList.add("is-active");
            wrap.querySelector(".pillar-card")?.classList.add("entered");
          } else {
            wrap.classList.remove("is-active");
          }
        }
      },
      { threshold: [0.5, 0.55, 0.6] },
    );

    wrapRefs.current.forEach((el) => {
      if (el) io.observe(el);
    });

    return () => io.disconnect();
  }, []);

  return (
    <section
      id="manifesto"
      className="overflow-x-clip"
      style={{ background: "#FAF6F3" }}
    >
      {/* Section header */}
      <div className="px-[7vw] pt-20 pb-12">
        <div className="mx-auto max-w-[820px] text-center">
          <div className="text-[13px] font-bold uppercase tracking-[0.16em] text-[#D28380]">
            {pillarsIntro.eyebrow}
          </div>
          <h2
            className={`${playfair.className} mt-2.5 mb-5 text-[clamp(36px,5vw,64px)] leading-[1.1] text-[#231718]`}
          >
            {pillarsIntro.heading}
          </h2>
          <p className="text-[17px] leading-[1.7] text-[#7A6F6E]">
            {pillarsIntro.body}
          </p>
        </div>
      </div>

      {/* Sticky card stack — vertical column with spacing for scroll depth */}
      <div className="mx-auto max-w-[860px] px-[7vw] pb-[15vh]">
        {pillars.map((pillar, i) => {
          const accent = ACCENT_COLORS[i % ACCENT_COLORS.length];
          const glow = ACCENT_GRADIENTS[i % ACCENT_GRADIENTS.length];

          return (
            <div
              key={pillar.title}
              ref={(el) => {
                wrapRefs.current[i] = el;
              }}
              className="pillar-sticky-wrap mb-[8vh] min-[801px]:mb-[10vh]"
              style={
                {
                  "--pillar-accent": accent,
                  "--pillar-glow": glow,
                  "--pillar-index": i,
                } as React.CSSProperties
              }
            >
              <PillarCard pillar={pillar} />
            </div>
          );
        })}
      </div>
    </section>
  );
}
