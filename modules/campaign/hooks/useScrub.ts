"use client";

import { useEffect, useRef, type RefObject } from "react";
import { registerGsap, ScrollTrigger } from "@/lib/gsap/registerGsap";
import { scrub } from "@/modules/campaign/lib/scrub";
import { useReducedMotion } from "./useReducedMotion";

/**
 * Wires a scene/stage element pair to scroll progress. Under reduced motion
 * it fires the callback once at progress 1 (final, settled state) and never
 * creates a ScrollTrigger - matching the handoff build's Path C.
 */
export function useScrub(
  sceneRef: RefObject<HTMLElement | null>,
  stageRef: RefObject<HTMLElement | null>,
  onProgress: (progress: number) => void,
) {
  const reduced = useReducedMotion();
  const onProgressRef = useRef(onProgress);

  useEffect(() => {
    onProgressRef.current = onProgress;
  });

  useEffect(() => {
    const sceneEl = sceneRef.current;
    const stageEl = stageRef.current;
    if (!sceneEl || !stageEl) return;

    if (reduced) {
      onProgressRef.current(1);
      return;
    }

    registerGsap();
    const trigger = scrub(sceneEl, stageEl, (p) => onProgressRef.current(p));
    ScrollTrigger.refresh();

    return () => trigger.kill();
  }, [sceneRef, stageRef, reduced]);
}
