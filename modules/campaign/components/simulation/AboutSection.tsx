import { about } from "@/modules/campaign/data/simulation-block";
import { playfair } from "./playfair";

/** Ported from maria_website_simulation.html's .about section. */
export function AboutSection() {
  return (
    <section id="about" className="bg-[#fbf4ed] px-[7vw] py-20">
      <div className="mx-auto grid max-w-[1100px] grid-cols-2 items-center gap-[7vw] max-[800px]:grid-cols-1">
        <div>
          <div className="text-[13px] font-bold uppercase tracking-[0.16em] text-[#d98f96]">
            {about.eyebrow}
          </div>
          <h2 className={`${playfair.className} mt-2.5 mb-5 text-[clamp(38px,5vw,68px)] leading-[1.1] text-[#13233b]`}>
            {about.heading}
          </h2>
          {about.paragraphs.map((paragraph) => (
            <p key={paragraph} className="mt-4 text-[17px] leading-[1.75] text-[#536075]">
              {paragraph}
            </p>
          ))}
        </div>
        <div
          className={`${playfair.className} border-l-4 border-[#d98f96] pl-[25px] text-[37px] leading-[1.2] text-[#06224a] max-[800px]:text-[30px]`}
        >
          {about.quotePrefix}
          <span className="text-[#d98f96]">{about.quoteEmphasis}</span>
          {about.quoteSuffix}
        </div>
      </div>
    </section>
  );
}
