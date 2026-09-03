/** A manifesto pillar. `said` is Maria's verbatim wording (tier 1); `web` is the
 *  condensed web paragraph (tier 2). Neither may be edited, only rearranged. */
export type Pillar = {
  number: string;
  category: string;
  title: string;
  said: string;
  web: string;
};
