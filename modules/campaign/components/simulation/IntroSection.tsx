import { intro } from "@/modules/campaign/data/simulation-block";
import { playfair } from "./playfair";

/** Ported verbatim from maria_website_simulation.html's .intro section. */
export function IntroSection() {
  return (
    <section className="bg-[#06224a] px-[7vw] py-20 text-white">
      <div className="mx-auto max-w-[950px] text-center">
        <div className="text-[13px] font-bold uppercase tracking-[0.16em] text-[#d98f96]">
          {intro.eyebrow}
        </div>
        <div className="mx-auto my-5 h-[3px] w-[70px] bg-[#c7a45a]" />
        <h2 className={`${playfair.className} reveal-group text-[clamp(38px,5vw,68px)] leading-[1.1]`}>
          {intro.heading.map((line) => (
            <span key={line} className="reveal-wipe block">
              {line}
            </span>
          ))}
        </h2>
        <p className="reveal-up mt-5 text-xl leading-[1.7] text-[#e8edf4]">{intro.body}</p>
      </div>
    </section>
  );
}
