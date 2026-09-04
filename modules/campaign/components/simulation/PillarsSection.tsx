import { pillars, pillarsIntro } from "@/modules/campaign/data/simulation-block";
import { PillarCard } from "./PillarCard";
import { playfair } from "./playfair";

/**
 * Ported from maria_website_simulation.html's .manifesto section.
 *
 * overflow-x-clip on the section: the reveal-left/reveal-right cards start at
 * translateX(-44px)/translateX(44px), which on a phone pushes them ~18px past
 * the viewport and gives the whole page a horizontal scrollbar.
 *
 * It must be `clip`, NOT `hidden`. An overflow:hidden box is a scroll
 * container, and animation-timeline: view() resolves against the nearest
 * scroll container. Using hidden here re-parented these cards' reveal
 * timelines onto a box that never scrolls, so they froze partway: the top row
 * happened to land at opacity 1, the bottom row sat at 0.49 to 0.82 forever.
 * overflow-x: clip contains the offset without creating a scrollport.
 */
export function PillarsSection() {
  return (
    <section id="manifesto" className="overflow-x-clip bg-white px-[7vw] py-20">
      <div className="mx-auto mb-[45px] max-w-[820px] text-center">
        <div className="text-[13px] font-bold uppercase tracking-[0.16em] text-[#d98f96]">
          {pillarsIntro.eyebrow}
        </div>
        <h2 className={`${playfair.className} reveal-up mt-2.5 mb-5 text-[clamp(38px,5vw,68px)] leading-[1.1] text-[#13233b]`}>
          {pillarsIntro.heading}
        </h2>
        <p className="reveal-up text-[17px] leading-[1.7] text-[#6f7b8e]">{pillarsIntro.body}</p>
      </div>

      <div className="mx-auto grid max-w-[1100px] grid-cols-2 gap-[22px] max-[800px]:grid-cols-1">
        {pillars.map((pillar, i) => (
          <div key={pillar.title} className={i % 2 === 0 ? "reveal-left" : "reveal-right"}>
            <PillarCard pillar={pillar} />
          </div>
        ))}
      </div>
    </section>
  );
}
