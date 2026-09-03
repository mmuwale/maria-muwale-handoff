import type { Pillar } from "@/types/content";
import { milestonesByPillarTitle } from "@/modules/manifesto/data/milestones";

/**
 * The simulation's numbered-category card shape (number/category tag, title,
 * summary, KPI strip), populated with Maria's real verbatim wording and the
 * locked navy/ivory/gold identity instead of the simulation's placeholder copy.
 */
export function PillarCard({ pillar }: { pillar: Pillar }) {
  const milestones = milestonesByPillarTitle[pillar.title] ?? [];

  return (
    <article className="rounded-[26px] border border-navy/10 bg-white p-7 shadow-[0_12px_35px_rgba(11,31,58,0.06)] transition-transform hover:-translate-y-1">
      <div className="flex items-center justify-between font-bold tracking-[0.12em] text-gold-d">
        <span>{pillar.number}</span>
        <span className="text-xs uppercase">{pillar.category}</span>
      </div>

      <h3 className="mt-4 font-serif text-[28px] font-semibold text-navy">
        {pillar.title}
      </h3>

      <p className="mt-2.5 text-[15px] leading-relaxed text-navy/70">
        {pillar.said}
      </p>

      <div className="mt-4 border-t border-navy/10 pt-4">
        <strong className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.1em] text-navy">
          On the website
        </strong>
        <p className="text-sm leading-relaxed text-navy/60">{pillar.web}</p>
      </div>

      {milestones.length > 0 && (
        <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {milestones.map((m) => (
            <div key={m.label} className="rounded-2xl bg-ivory p-3.5">
              <b className="block text-base text-navy">{m.label}</b>
              <span className="text-[11px] text-navy/60">{m.when}</span>
            </div>
          ))}
        </div>
      )}
    </article>
  );
}
