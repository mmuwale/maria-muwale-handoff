"use client";

import { useEffect } from "react";
import { registerGsap, ScrollTrigger } from "@/lib/gsap/registerGsap";

/**
 * One consolidated refresh after the whole page has mounted, instead of
 * every beat's useScrub calling ScrollTrigger.refresh() independently on
 * its own mount. Six beats mounting near-simultaneously (and React Strict
 * Mode double-invoking effects in dev) can race those per-beat refreshes -
 * a refresh firing while another beat's trigger is mid-recreation measures
 * an incomplete layout, and that wrong start/end position sticks. A single
 * refresh, deferred until after layout and the window's load event, avoids
 * the race entirely.
 */
export function ScrollTriggerRefresher() {
  useEffect(() => {
    registerGsap();

    const refresh = () => ScrollTrigger.refresh();
    const frame = requestAnimationFrame(refresh);
    window.addEventListener("load", refresh);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("load", refresh);
    };
  }, []);

  return null;
}
