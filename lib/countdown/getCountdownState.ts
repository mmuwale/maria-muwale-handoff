import { facts } from "@/modules/shared/data/facts";

export type CountdownState =
  | {
      phase: "before";
      days: number;
      hours: number;
      minutes: number;
      seconds: number;
      label: string;
    }
  | { phase: "voting"; label: string }
  | { phase: "results"; label: string }
  | { phase: "ended" };

const voteStart = new Date(facts.voteStart);
const voteEnd = new Date(facts.voteEnd);
const resultsAt = new Date(facts.resultsAt);

/**
 * Pure function: given the current instant, which of the four countdown
 * states applies. Ported from the handoff build's ARCHITECTURE.md section 9 -
 * the fixed instants with an explicit +03:00 offset are load-bearing, do not
 * localize them.
 */
export function getCountdownState(now: Date): CountdownState {
  if (now >= resultsAt) {
    return { phase: "ended" };
  }

  if (now >= voteEnd) {
    return { phase: "results", label: "Results at 1:30 pm" };
  }

  if (now >= voteStart) {
    return { phase: "voting", label: "Polls are open · close at noon" };
  }

  const ms = voteStart.getTime() - now.getTime();
  const days = Math.floor(ms / 86_400_000);
  const hours = Math.floor((ms % 86_400_000) / 3_600_000);
  const minutes = Math.floor((ms % 3_600_000) / 60_000);
  const seconds = Math.floor((ms % 60_000) / 1_000);

  return {
    phase: "before",
    days,
    hours,
    minutes,
    seconds,
    label: "Vote 11 September · 9:00 am",
  };
}
