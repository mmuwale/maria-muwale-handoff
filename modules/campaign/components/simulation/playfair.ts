import { Playfair_Display } from "next/font/google";

/** The simulation file's own heading font, self-hosted via next/font -
 *  scoped to this ported block only, not the project's usual Cormorant. */
export const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});
