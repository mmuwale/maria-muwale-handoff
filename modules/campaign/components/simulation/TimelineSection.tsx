import { timelineIntro, timelineSteps } from "@/modules/campaign/data/simulation-block";
import { playfair } from "./playfair";

/** Ported from maria_website_simulation.html's .timeline section. */
export function TimelineSection() {
  return (
    <section id="plan" className="bg-[#f6ecea] px-[7vw] py-20">
      <div className="mx-auto mb-[45px] max-w-[820px] text-center">
        <div className="text-[13px] font-bold uppercase tracking-[0.16em] text-[#d98f96]">
          {timelineIntro.eyebrow}
        </div>
        <h2 className={`${playfair.className} mt-2.5 mb-5 text-[clamp(38px,5vw,68px)] leading-[1.1] text-[#13233b]`}>
          {timelineIntro.heading}
        </h2>
        <p className="text-[17px] leading-[1.7] text-[#6f7b8e]">{timelineIntro.body}</p>
      </div>

      <div className="mx-auto grid max-w-[1100px] grid-cols-4 gap-3.5 max-[800px]:grid-cols-2">
        {timelineSteps.map((step) => (
          <div key={step.label} className="rounded-[20px] bg-white p-5">
            <b className="text-xs uppercase tracking-[0.1em] text-[#d98f96]">{step.label}</b>
            <h4 className={`${playfair.className} my-2.5 text-[23px] text-[#06224a]`}>
              {step.title}
            </h4>
            <p className="text-sm leading-[1.55] text-[#6f7b8e]">{step.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
