"use client";

import { useEffect, useState } from "react";
import { getCountdownState } from "@/lib/countdown/getCountdownState";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

const cellStyles = {
  light: "border border-navy/10 bg-white text-navy",
  dark: "border border-ivory/15 bg-white/5 text-ivory",
};

const labelStyles = {
  light: "text-navy/60",
  dark: "text-ivory/60",
};

/**
 * The four-state election countdown (before / voting / results / ended),
 * rendered as the simulation's four-box Days/Hours/Minutes/Seconds grid while
 * there is a number worth showing. Starts unresolved so the static-generated
 * shell never bakes in a build-time timestamp; the first tick (deferred to a
 * macrotask, not called synchronously in the effect body) fills it in.
 */
export function Countdown({ theme = "light" }: { theme?: "light" | "dark" }) {
  const [state, setState] = useState<ReturnType<typeof getCountdownState> | null>(
    null,
  );

  useEffect(() => {
    const update = () => setState(getCountdownState(new Date()));
    const immediate = setTimeout(update, 0);
    const interval = setInterval(update, 1000);
    return () => {
      clearTimeout(immediate);
      clearInterval(interval);
    };
  }, []);

  if (!state || state.phase === "ended") return null;

  const cell = cellStyles[theme];
  const label = labelStyles[theme];

  if (state.phase !== "before") {
    return (
      <div className="flex flex-col items-center gap-2">
        <div className={`rounded-2xl px-5 py-3 text-center text-2xl font-bold ${cell}`}>
          Now
        </div>
        <p className={`text-[10px] uppercase tracking-[0.1em] min-[900px]:text-[11px] ${label}`}>{state.label}</p>
      </div>
    );
  }

  const cells: Array<[string, number]> = [
    ["Days", state.days],
    ["Hours", state.hours],
    ["Minutes", state.minutes],
    ["Seconds", state.seconds],
  ];

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex flex-nowrap justify-center gap-1.5 min-[900px]:gap-2">
        {cells.map(([cellLabel, value]) => (
          <div key={cellLabel} className={`min-w-0 flex-1 rounded-xl px-1 py-1.5 text-center min-[900px]:min-w-[60px] min-[900px]:flex-none min-[900px]:px-2.5 min-[900px]:py-2 ${cell}`}>
            <b className="block text-[15px] leading-none min-[900px]:text-[19px]">{pad(value)}</b>
            <small className={`text-[8px] uppercase tracking-[0.06em] min-[900px]:text-[9px] min-[900px]:tracking-[0.1em] ${label}`}>
              {cellLabel}
            </small>
          </div>
        ))}
      </div>
      <p className={`text-[10px] uppercase tracking-[0.1em] min-[900px]:text-[11px] ${label}`}>{state.label}</p>
    </div>
  );
}
