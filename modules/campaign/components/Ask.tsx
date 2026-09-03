import { ask } from "@/modules/campaign/data/ask";
import { facts } from "@/modules/shared/data/facts";
import { Countdown } from "@/components/Countdown";
import { ShareButton } from "./ShareButton";

/**
 * Beat 6. Normal document flow, no pinning - the countdown and share action
 * are wired above any scroll machinery so they work under reduced motion and
 * with JavaScript degraded (see ARCHITECTURE.md section 1, Path C).
 */
export function Ask() {
  return (
    <section id="vote" className="scroll-mt-20 bg-navy px-8 py-24 text-center text-ivory">
      <div className="mx-auto max-w-[640px]">
        <h2 className="font-serif text-[clamp(36px,7vw,64px)] font-semibold uppercase leading-[1.05]">
          {ask.slogan.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h2>

        <p className="mx-auto mt-6 max-w-[46ch] text-ivory/80">{ask.tagline}</p>

        <div className="mt-10 flex justify-center">
          <Countdown theme="dark" />
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <div className="inline-flex items-center justify-center rounded-full border border-gold px-5 py-3.5 text-sm font-bold tracking-tight text-gold">
            {ask.voteButtonLabel}
          </div>
          <ShareButton label={ask.shareButtonLabel} />
        </div>

        <div className="mt-14 flex flex-col items-center gap-2 text-sm text-ivory/70">
          <a href={`mailto:${facts.email}`} className="hover:text-ivory">
            {facts.email}
          </a>
          <a
            href={`https://instagram.com/${facts.instagram.slice(1)}`}
            target="_blank"
            rel="noopener"
            className="hover:text-ivory"
          >
            Instagram {facts.instagram}
          </a>
          <a
            href={`https://tiktok.com/@${facts.tiktok.slice(1)}`}
            target="_blank"
            rel="noopener"
            className="hover:text-ivory"
          >
            TikTok {facts.tiktok}
          </a>
          <span>WhatsApp {facts.whatsapp}</span>
        </div>

        <div className="mt-14">
          <p className="font-serif text-2xl font-semibold text-gold">
            {ask.closingLine1}
          </p>
          <p className="mt-2 text-xs uppercase tracking-[0.14em] text-ivory/60">
            {ask.closingHashtag}
          </p>
        </div>
      </div>
    </section>
  );
}
