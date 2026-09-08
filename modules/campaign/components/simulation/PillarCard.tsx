import type { SimulationPillar } from "@/modules/campaign/data/simulation-block";
import { playfair } from "./playfair";

/** A single pillar card. Stacking, sticky, and animation logic lives in PillarsSection. */
export function PillarCard({ pillar }: { pillar: SimulationPillar }) {
  return (
    <div className="pillar-card">
      <div className="relative z-[1]">
        {/* Category pill + number */}
        <div
          className="stagger mb-4 flex items-center justify-between"
          style={{ "--d": "0.1s" } as React.CSSProperties}
        >
          <span className="pillar-category-pill text-[#D28380]">
            {pillar.category}
          </span>
          <span className="text-[13px] font-extrabold tracking-[0.12em] text-[#D28380]">
            {pillar.number}
          </span>
        </div>

        {/* Large heading — word-mask reveal */}
        <h3
          className={`stagger-heading ${playfair.className} mb-3 text-[clamp(26px,3.5vw,36px)] leading-[1.1] text-white`}
          style={{ "--d": "0.2s" } as React.CSSProperties}
        >
          {pillar.title}
        </h3>

        {/* Description */}
        <p
          className="stagger text-[15px] leading-[1.65] text-white/70"
          style={{ "--d": "0.3s" } as React.CSSProperties}
        >
          {pillar.summary}
        </p>

        {/* Divider + detail list */}
        <div
          className="stagger mt-5 border-t border-white/10 pt-5"
          style={{ "--d": "0.4s" } as React.CSSProperties}
        >
          <strong className="mb-2 block text-[11px] font-bold uppercase tracking-[0.1em] text-[#D28380]">
            {pillar.detailsLabel}
          </strong>
          <ul className="space-y-1.5 text-[15px] leading-[1.7] text-white/60">
            {pillar.details.map((item, idx) => (
              <li
                key={item}
                className="stagger flex items-start"
                style={{ "--d": `${0.45 + idx * 0.05}s` } as React.CSSProperties}
              >
                <span className="pillar-detail-dot mt-[7px]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* KPI badges */}
        <div
          className="stagger mt-5 grid grid-cols-2 gap-3"
          style={{ "--d": "0.6s" } as React.CSSProperties}
        >
          {pillar.kpis.map((kpi) => (
            <div
              key={kpi.label}
              className="pillar-kpi rounded-xl border border-white/10 bg-white/5 p-4"
            >
              <b className="block text-[16px] font-semibold text-white">
                {kpi.label}
              </b>
              <span className="text-[11px] text-white/50">{kpi.sub}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
