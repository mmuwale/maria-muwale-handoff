import Link from "next/link";
import { footerContent } from "@/modules/campaign/data/footer";

/** The simulation's closing section: a final direct address, then the
 *  literal footer bar. Sits after Ask, in normal document flow. */
export function Footer() {
  return (
    <section className="bg-navy px-8 pb-10 pt-24 text-center text-ivory">
      <div className="mx-auto max-w-[650px]">
        <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-blush-n">
          {footerContent.eyebrow}
        </div>
        <h2 className="mt-3 font-serif text-[clamp(38px,6vw,64px)] font-semibold">
          {footerContent.heading}
        </h2>
        <p className="mx-auto mt-5 max-w-[55ch] leading-relaxed text-ivory/80">
          {footerContent.body}
        </p>
        <Link
          href="/manifesto"
          className="mt-8 inline-flex items-center justify-center rounded-full bg-ivory px-6 py-3.5 text-sm font-bold text-navy transition-colors hover:bg-white"
        >
          {footerContent.manifestoLink}
        </Link>
      </div>

      <footer className="mt-16 flex flex-col items-center gap-3 border-t border-ivory/15 pt-6 text-[11px] tracking-[0.08em] text-ivory/60">
        <span>{footerContent.bar}</span>
        <Link href="/admin" className="uppercase tracking-[0.14em] text-ivory/40 hover:text-ivory/70">
          Admin
        </Link>
      </footer>
    </section>
  );
}
