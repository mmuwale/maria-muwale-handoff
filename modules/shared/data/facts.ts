/** Verifiable facts and UI labels (tier 3). Fixed instants with an explicit
 *  UTC+3 offset so the countdown reads correctly from any visitor's timezone. */
export const facts = {
  office: "Female Academic Representative",
  institution: "Strathmore University",
  voteStart: "2026-09-11T09:00:00+03:00",
  voteEnd: "2026-09-11T12:00:00+03:00",
  resultsAt: "2026-09-11T13:30:00+03:00",
  email: "maria.muwale@strathmore.edu",
  instagram: "@maria.muwale",
  tiktok: "@maria.muwale",
  whatsapp: "@mmuwale",
} as const;

export const slogans = {
  connectEngageExcel: "Connect, Engage, Excel with Muwale.",
  staySharp: "Stay sharp with Muwale!",
  hashtag: "#StaySharpWithMuwale",
} as const;
