import type { Metadata } from "next";
import { OG_IMAGE } from "@/modules/shared/data/og-image";
import { ManifestoPage } from "@/modules/manifesto/components/ManifestoPage";

export const metadata: Metadata = {
  title: "Campaign Manifesto",
  description:
    "Maria Muwale's manifesto for Female Academic Representative, Strathmore University. Smart Learning Spaces, Interfaculty Projects, Industrial Visits, Faculty Spotlight Week.",
  alternates: { canonical: "/manifesto" },
  openGraph: {
    url: "/manifesto",
    type: "article",
    title: "Campaign Manifesto - Maria Muwale",
    description:
      "Smart Learning Spaces, Interfaculty Projects, Industrial Visits, Faculty Spotlight Week.",
      images: [OG_IMAGE],
  },
};

export default function Page() {
  return <ManifestoPage />;
}
