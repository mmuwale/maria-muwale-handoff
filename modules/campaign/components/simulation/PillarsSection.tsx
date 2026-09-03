import { pillars, pillarsIntro } from "@/modules/campaign/data/simulation-block";
import { PillarCard } from "./PillarCard";
import { playfair } from "./playfair";

/** Ported from maria_website_simulation.html's .manifesto section. */
export function PillarsSection() {
  return (
    <section id="manifesto" className="bg-white px-[7vw] py-20">
      <div className="mx-auto mb-[45px] max-w-[820px] text-center">
        <div className="text-[13px] font-bold uppercase tracking-[0.16em] text-[#d98f96]">
          {pillarsIntro.eyebrow}
        </div>
        <h2 className={`${playfair.className} mt-2.5 mb-5 text-[clamp(38px,5vw,68px)] leading-[1.1] text-[#13233b]`}>
          {pillarsIntro.heading}
        </h2>
        <p className="text-[17px] leading-[1.7] text-[#6f7b8e]">{pillarsIntro.body}</p>
      </div>

      <div className="mx-auto grid max-w-[1100px] grid-cols-2 gap-[22px] max-[800px]:grid-cols-1">
        {pillars.map((pillar) => (
          <PillarCard key={pillar.title} pillar={pillar} />
        ))}
      </div>
    </section>
  );
}
