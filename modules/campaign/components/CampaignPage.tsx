import { SiteHeader } from "@/components/SiteHeader";
import { Opener } from "./Opener";
import { DefaultAndRecord } from "./DefaultAndRecord";
import { Foundation } from "./Foundation";
import { Stones } from "./Stones";
import { Ask } from "./Ask";

/** The six-beat scroll-scrubbed campaign page, assembled in order. */
export function CampaignPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <Opener />
        <DefaultAndRecord />
        <Foundation />
        <Stones />
        <Ask />
      </main>
    </>
  );
}
