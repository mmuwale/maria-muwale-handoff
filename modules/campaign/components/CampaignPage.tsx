import { SiteHeader } from "@/components/SiteHeader";
import { Opener } from "./Opener";
import { DefaultAndRecord } from "./DefaultAndRecord";
import { SimulationBlock } from "./simulation/SimulationBlock";
import { Ask } from "./Ask";
import { Footer } from "./Footer";
import { ScrollTriggerRefresher } from "./ScrollTriggerRefresher";

/**
 * The scroll-scrubbed campaign page. Foundation (the four pillars) and
 * Stones ("MUWALE means stones") are deliberately not rendered here for
 * now - both still exist at ./Foundation.tsx and ./Stones.tsx if wanted
 * back later. In their place, Record flows into the simulation's
 * intro/manifesto/timeline/about block, then Ask.
 */
export function CampaignPage() {
  return (
    <>
      <SiteHeader />
      <ScrollTriggerRefresher />
      <main>
        <Opener />
        <DefaultAndRecord />
        <SimulationBlock />
        <Ask />
        <Footer />
      </main>
    </>
  );
}
