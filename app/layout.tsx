import type { Metadata } from "next";
import { Cormorant, Montserrat } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

// Self-hosted via next/font (build-time download), which removes the
// runtime dependency on fonts.googleapis.com that the original static
// site carried (see KNOWN-ISSUES.md 1.7).
const cormorant = Cormorant({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: {
    default: "Maria Muwale - for Female Academic Representative",
    template: "%s - Maria Muwale",
  },
  description:
    "Maria Muwale for Female Academic Representative, Strathmore University. Vote 11 September 2026, 9:00 am - noon.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-48.png", sizes: "48x48", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  // The share card. This is how the site travels on WhatsApp, which is how
  // most of this electorate will meet it. Without an og:image a shared link
  // previews as bare text. og.jpg is the original 1200x630 card, restored.
  openGraph: {
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        type: "image/jpeg",
        alt: "Maria Muwale, for Female Academic Representative, Strathmore University.",
      },
    ],
    siteName: "Maria Muwale for Female Academic Representative",
    locale: "en_KE",
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og.jpg"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${montserrat.variable} h-full`}
    >
      <body className="min-h-full">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
