import type { SimulationPillar } from "@/modules/campaign/data/simulation-block";
import { playfair } from "./playfair";

/** Ported from maria_website_simulation.html's .card. */
export function PillarCard({ pillar }: { pillar: SimulationPillar }) {
  return (
    <div className="rounded-[26px] border border-[#e7e5e2] bg-white p-7 shadow-[0_12px_35px_rgba(6,34,74,0.06)] transition-transform duration-200 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(6,34,74,0.1)]">
      <div className="flex items-center justify-between font-extrabold tracking-[0.12em] text-[#c7a45a]">
        <span>{pillar.number}</span>
        <span>{pillar.category}</span>
      </div>

      <h3 className={`${playfair.className} mt-[18px] mb-2.5 text-[30px] text-[#06224a]`}>
        {pillar.title}
      </h3>

      <p className="leading-[1.65] text-[#6f7b8e]">{pillar.summary}</p>

      <div className="mt-5 border-t border-[#eee] pt-[18px]">
        <strong className="mb-2 block text-xs uppercase tracking-[0.1em] text-[#06224a]">
          {pillar.detailsLabel}
        </strong>
        <ul className="list-disc space-y-0 pl-5 leading-[1.7] text-[#49566a]">
          {pillar.details.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="mt-[18px] grid grid-cols-2 gap-2.5">
        {pillar.kpis.map((kpi) => (
          <div key={kpi.label} className="rounded-2xl bg-[#fbf4ed] p-3.5">
            <b className="block text-[17px] text-[#06224a]">{kpi.label}</b>
            <span className="text-[11px] text-[#6f7b8e]">{kpi.sub}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
