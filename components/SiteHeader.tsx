import Link from "next/link";
import { FEEDBACK_FORM_SLUG } from "@/modules/shared/data/feedback-form";

/**
 * The fixed top nav for every public page - home, manifesto, the feedback
 * form. Mirrors the simulation's translucent-blur nav shape, on the locked
 * navy/ivory/gold identity. Sits above the scroll-beat stages (they never
 * set a z-index above 6; this uses 50) without being part of their
 * stacking context, since it's a sibling of the beats, not nested inside one.
 */
export function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between border-b border-navy/10 bg-ivory/85 px-5 py-3.5 backdrop-blur-md sm:px-8">
      <Link href="/" className="font-serif text-lg font-semibold tracking-[0.04em] text-navy">
        MARIA <span className="text-blush-i">MUWALE</span>
      </Link>

      <nav className="flex items-center gap-5">
        <Link
          href="/manifesto"
          className="hidden text-xs font-semibold uppercase tracking-[0.14em] text-navy/70 hover:text-navy sm:inline"
        >
          Manifesto
        </Link>
        <Link
          href="/#vote"
          className="hidden text-xs font-semibold uppercase tracking-[0.14em] text-navy/70 hover:text-navy sm:inline"
        >
          Vote
        </Link>
        <Link
          href={`/forms/${FEEDBACK_FORM_SLUG}`}
          className="rounded-full bg-navy px-4 py-2 text-xs font-bold uppercase tracking-[0.1em] text-ivory transition-colors hover:bg-navy-d"
        >
          Submit Feedback
        </Link>
      </nav>
    </header>
  );
}
