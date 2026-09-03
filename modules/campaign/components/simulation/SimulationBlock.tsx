import { IntroSection } from "./IntroSection";
import { PillarsSection } from "./PillarsSection";
import { TimelineSection } from "./TimelineSection";
import { AboutSection } from "./AboutSection";

/**
 * The four sections ported verbatim from maria_website_simulation.html:
 * .intro through .about ("More connected..." through "Representation is
 * a responsibility."). Normal document flow, no scroll-scrubbing - the
 * source has none for these sections either.
 */
export function SimulationBlock() {
  return (
    <>
      <IntroSection />
      <PillarsSection />
      <TimelineSection />
      <AboutSection />
    </>
  );
}
