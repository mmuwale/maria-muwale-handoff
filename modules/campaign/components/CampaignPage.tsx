import { SiteHeader } from "@/components/SiteHeader";
import { Opener } from "./Opener";
import { DefaultAndRecord } from "./DefaultAndRecord";
import { Ask } from "./Ask";
import { Footer } from "./Footer";
import { ScrollTriggerRefresher } from "./ScrollTriggerRefresher";

/**
 * The scroll-scrubbed campaign page. Foundation (the four pillars) and
 * Stones ("MUWALE means stones") are deliberately not rendered here for
 * now - Record flows directly into Ask. Both components still exist at
 * ./Foundation.tsx and ./Stones.tsx if wanted back later.
 */
export function CampaignPage() {
  return (
    <>
      <SiteHeader />
      <ScrollTriggerRefresher />
      <main>
        <Opener />
        <DefaultAndRecord />
        <Ask />
        <Footer />
      </main>
    </>
  );
}
