/**
 * The share card, referenced by every page that declares its own openGraph
 * block. Next.js replaces the parent openGraph object wholesale rather than
 * merging it, so a page that sets `openGraph` without `images` silently drops
 * the card and the link previews as bare text.
 */
export const OG_IMAGE = {
  url: "/og.jpg",
  width: 1200,
  height: 630,
  type: "image/jpeg",
  alt: "Maria Muwale, for Female Academic Representative, Strathmore University.",
} as const;
