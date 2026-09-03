import { SiteHeader } from "@/components/SiteHeader";
import { pillars } from "@/modules/shared/data/pillars";
import { manifestoContent } from "@/modules/manifesto/data/manifesto";
import { PillarCard } from "./PillarCard";
import { BackToCampaign } from "./BackToCampaign";

export function ManifestoPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-dvh bg-navy-d text-ivory">
        <div className="mx-auto max-w-[1060px] px-6 pb-24 pt-20 sm:px-11">
          <BackToCampaign />

        <header className="pt-[12vh] sm:pt-[16vh]">
          <h1 className="font-serif text-[clamp(46px,12vw,86px)] font-semibold uppercase leading-[0.95] tracking-[0.02em]">
            {manifestoContent.headingLine1}
            <span className="block text-blush-n">{manifestoContent.headingLine2}</span>
          </h1>
          <div className="mt-8 h-px bg-gradient-to-r from-gold to-transparent" />
        </header>

        <blockquote className="mt-11 font-serif text-[clamp(21px,4.6vw,30px)] leading-[1.42] text-ivory">
          &ldquo;{manifestoContent.openingQuote}&rdquo;
        </blockquote>

        <h2 className="mt-24 font-serif text-[clamp(26px,6.6vw,48px)] text-neutral-ph">
          {manifestoContent.pillarsHeading}
        </h2>

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {pillars.map((pillar) => (
            <PillarCard key={pillar.title} pillar={pillar} />
          ))}
        </div>

        <section className="mt-24 border-t border-ivory/15 pt-16">
          <p className="max-w-[70ch] text-[clamp(19px,4.2vw,26px)] leading-[1.45] font-serif">
            {manifestoContent.coda}
          </p>
          <p className="mt-7 max-w-[56ch] text-[clamp(12.5px,3.1vw,14px)] leading-[1.75] text-ivory/60">
            {manifestoContent.limit}
          </p>
        </section>

        <div className="mt-24 border-t border-ivory/15 pt-16 text-center">
          <div className="mb-8 flex items-center justify-center gap-4 text-[12px] font-semibold uppercase tracking-[0.17em] text-gold">
            <span className="h-px w-16 bg-gold/55" />
            <span>{manifestoContent.voteLine}</span>
            <span className="h-px w-16 bg-gold/55" />
          </div>

          <div className="font-serif text-[clamp(24px,6vw,40px)] font-semibold uppercase leading-[1.15] text-gold">
            {manifestoContent.closing.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </div>
          <p className="mt-4 text-[11px] font-medium tracking-[0.1em] text-ivory/70">
            {manifestoContent.hashtag}
          </p>
        </div>

        <div className="mt-16 text-center">
          <BackToCampaign />
        </div>

        <div className="mt-16 h-2 bg-gold" />
        </div>
      </main>
    </>
  );
}
