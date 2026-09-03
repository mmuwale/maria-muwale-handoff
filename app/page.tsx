import type { Metadata } from "next";
import { CampaignPage } from "@/modules/campaign/components/CampaignPage";

export const metadata: Metadata = {
  title: "Maria Muwale - for Female Academic Representative",
  description:
    "Maria Muwale for Female Academic Representative, Strathmore University. Vote 11 September 2026, 9:00 am - noon.",
  alternates: { canonical: "/" },
  openGraph: {
    url: "/",
    type: "website",
    title: "Maria Muwale - for Female Academic Representative",
    description: "Strathmore University. Vote 11 September 2026, 9:00 am - noon.",
  },
};

export default function Page() {
  return <CampaignPage />;
}
