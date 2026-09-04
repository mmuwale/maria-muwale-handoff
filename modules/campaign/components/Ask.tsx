import { ask } from "@/modules/campaign/data/ask";
import { facts } from "@/modules/shared/data/facts";
import { ShareButton } from "./ShareButton";

/**
 * Beat 6. Normal document flow, no pinning. Structure ported from the
 * handoff build's .ask/.askCol (askLeft: slogan + "with Muwale." + quote;
 * askRight: acts + contacts) plus .askTail (spark rule, closer,
 * hashtag) and .baseline - site/index.html lines 215-243, 291-308.
 *
 * No countdown in this column. The reference build puts one here, but on this
 * site it lives at the foot of the hero instead, on the owner's instruction.
 * Do not "restore" it here or the page will carry two.
 */
export function Ask() {
  return (
    <section id="vote" className="scroll-mt-20 bg-navy pt-[70px] text-ivory min-[900px]:flex min-[900px]:min-h-dvh min-[900px]:flex-col min-[900px]:justify-center min-[900px]:pt-[10vh]">
      <div className="relative z-[1] mx-auto max-w-[640px] px-8 min-[900px]:grid min-[900px]:w-[84vw] min-[900px]:max-w-[1280px] min-[900px]:grid-cols-[1.15fr_0.85fr] min-[900px]:items-center min-[900px]:gap-[7vw] min-[900px]:px-0">
        <div>
          <h2 className="font-serif text-[42px] font-semibold uppercase leading-[1.06] tracking-[0.03em] min-[900px]:text-[clamp(60px,5.2vw,92px)]">
            {ask.slogan.map(({ text, variant }) => (
              <span
                key={text}
                className={`block ${variant === "a" ? "text-ivory" : "text-blush-n"}`}
              >
                {text}
              </span>
            ))}
          </h2>

          <div className="mt-2 min-[900px]:mt-3">
            <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-ivory/75 min-[900px]:text-[13px]">
              {ask.withLabel}{" "}
            </span>
            <span className="font-serif text-[23px] font-semibold uppercase tracking-[0.06em] text-blush-n min-[900px]:text-[clamp(26px,2.2vw,34px)]">
              {ask.withName}
            </span>
          </div>

          <p className="mt-[18px] font-serif text-[17.5px] leading-[1.42] min-[900px]:mt-[30px] min-[900px]:max-w-[26ch] min-[900px]:text-[clamp(19px,1.6vw,26px)]">
            {ask.tagline}
          </p>
        </div>

        <div>
          <div className="mt-3.5 flex flex-col gap-2.5 min-[900px]:mt-4 min-[900px]:gap-[11px]">
            <div className="border-2 border-gold px-3.5 py-3.5 text-center text-xs font-semibold uppercase tracking-[0.14em] text-gold min-[900px]:px-4 min-[900px]:py-4 min-[900px]:text-[13px]">
              {ask.voteButtonLabel}
            </div>
            <ShareButton label={ask.shareButtonLabel} />
          </div>

          <div className="mt-[18px] flex flex-col gap-2 text-[12.5px] min-[900px]:mt-[22px] min-[900px]:grid min-[900px]:grid-cols-2 min-[900px]:gap-x-[26px] min-[900px]:gap-y-2.5 min-[900px]:text-[13.5px]">
            <a
              href={`mailto:${facts.email}`}
              className="self-start border-b border-gold-d/45 pb-0.5 text-ivory hover:text-white"
            >
              {facts.email}
            </a>
            <a
              href={`https://instagram.com/${facts.instagram.slice(1)}`}
              target="_blank"
              rel="noopener"
              className="self-start border-b border-gold-d/45 pb-0.5 text-ivory hover:text-white"
            >
              Instagram {facts.instagram}
            </a>
            <a
              href={`https://tiktok.com/@${facts.tiktok.slice(1)}`}
              target="_blank"
              rel="noopener"
              className="self-start border-b border-gold-d/45 pb-0.5 text-ivory hover:text-white"
            >
              TikTok {facts.tiktok}
            </a>
            <span className="self-start pb-[3px] text-ivory/72">WhatsApp {facts.whatsapp}</span>
          </div>
        </div>
      </div>

      <div className="relative z-[1] mx-auto mt-5 max-w-[640px] px-8 min-[900px]:mt-[8vh] min-[900px]:max-w-none min-[900px]:px-0">
        <div className="flex items-center justify-center gap-[13px]">
          <span className="h-px flex-1 max-w-[80px] bg-gold-d/50" />
          <svg width="15" height="15" viewBox="0 0 18 18" aria-hidden>
            <path d="M9 .5 10.8 7.2 17.5 9 10.8 10.8 9 17.5 7.2 10.8 .5 9 7.2 7.2Z" fill="#BFA671" />
          </svg>
          <span className="h-px flex-1 max-w-[80px] bg-gold-d/50" />
        </div>
        <div className="mt-2.5 text-center font-serif text-[22px] font-semibold text-gold min-[900px]:text-[clamp(26px,2.2vw,34px)]">
          {ask.closingLine1}
        </div>
        <div className="mt-1.5 text-center text-[11px] font-medium text-ivory/70 min-[900px]:text-xs">
          {ask.closingHashtag}
        </div>
      </div>

      <div className="relative z-[1] mt-10 h-2 bg-gold min-[900px]:mt-[7vh]" />
    </section>
  );
}
