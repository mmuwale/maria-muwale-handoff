/**
 * Verbatim from maria_website_simulation.html: the .intro, .manifesto,
 * .timeline and .about sections. This is the simulation prototype's own
 * placeholder copy (not Maria's verbatim manifesto wording from the
 * handoff's CONTENT.md) - ported here exactly as it reads in the source
 * file, per instruction to bring this block over "the way it is."
 */

export const intro = {
  eyebrow: "A student-led vision",
  heading: ["More connected.", "More engaged.", "More prepared."],
  body: "My campaign is about making the academic experience at Strathmore feel less compartmentalised and more connected to the people, opportunities and possibilities around us.",
} as const;

export type SimulationPillar = {
  number: string;
  category: string;
  title: string;
  summary: string;
  detailsLabel: string;
  details: string[];
  kpis: [{ label: string; sub: string }, { label: string; sub: string }];
};

export const pillarsIntro = {
  eyebrow: "The four pillars",
  heading: "Ideas into action.",
  body: "Each pillar is designed to be practical, measurable and achievable through collaboration with students, representatives, lecturers and the relevant university structures.",
} as const;

export const pillars: SimulationPillar[] = [
  {
    number: "01",
    category: "TECHNOLOGY",
    title: "Smart Learning Spaces",
    summary:
      "Make it easier to identify available learning spaces and navigate campus, while working with existing university systems rather than creating a parallel booking system.",
    detailsLabel: "What I'll do",
    details: [
      "Refine the prototype with ICT and relevant stakeholders.",
      "Explore integration with MyStrath.",
      "Test a clear room-availability and navigation experience.",
    ],
    kpis: [
      { label: "Feasibility plan", sub: "First semester milestone" },
      { label: "Student testing", sub: "Prototype feedback cycle" },
    ],
  },
  {
    number: "02",
    category: "COLLABORATION",
    title: "Interfaculty Projects",
    summary:
      "Start with a manageable Business + Technology pilot where students solve a real-world problem together, then evaluate before scaling.",
    detailsLabel: "Example",
    details: [
      "Business students: customer needs, market analysis, model and feasibility.",
      "Technology students: UX, technical feasibility and prototype.",
      "Teams pitch to a judging panel against clear criteria.",
    ],
    kpis: [
      { label: "1 pilot", sub: "Small, measurable launch" },
      { label: "Post-pilot review", sub: "Decide whether to scale" },
    ],
  },
  {
    number: "03",
    category: "EXPOSURE",
    title: "Industrial Visits",
    summary:
      "Turn industry exposure into a coordinated academic opportunity: student demand, relevant partners, safe logistics, and a clear learning objective.",
    detailsLabel: "What makes it different",
    details: [
      "Needs-based selection, not trips for trips' sake.",
      "Pre-visit learning objective and post-visit reflection.",
      "Work through university protocols, partnerships and safety requirements.",
    ],
    kpis: [
      { label: "Participation", sub: "Track student turnout" },
      { label: "Outcomes", sub: "Feedback + learning evidence" },
    ],
  },
  {
    number: "04",
    category: "DISCOVERY",
    title: "Faculty Spotlight Week",
    summary:
      "Not a club fair or an open day. A week for discovering academic work, research, projects, opportunities and cross-faculty collaboration.",
    detailsLabel: "Five-day concept",
    details: [
      "Academic discovery",
      "Student work showcase",
      "Cross-faculty conversations",
      "Opportunities day",
      "Collaborative showcase finale",
    ],
    kpis: [
      { label: "Attendance", sub: "Track participation" },
      { label: "Discovery", sub: "Opportunities + projects accessed" },
    ],
  },
];

export const timelineIntro = {
  eyebrow: "Delivery, not promises",
  heading: "How the work moves.",
  body: "The website makes the implementation visible: each pillar has a milestone, a measurable indicator and a review point. Exact election-year dates can be updated once the official council calendar is confirmed.",
} as const;

export const timelineSteps = [
  {
    label: "01 · Listen",
    title: "Student needs",
    body: "Gather targeted feedback and identify the problem worth solving.",
  },
  {
    label: "02 · Align",
    title: "University structures",
    body: "Meet the relevant offices, lecturers and representatives to confirm feasibility and protocol.",
  },
  {
    label: "03 · Pilot",
    title: "Start small",
    body: "Run a manageable first version with defined scope, responsibilities and measures.",
  },
  {
    label: "04 · Measure",
    title: "Report & improve",
    body: "Collect participation and outcome data, publish progress, then refine or scale.",
  },
] as const;

export const about = {
  eyebrow: "Why Maria?",
  heading: "Representation is a responsibility.",
  paragraphs: [
    "My experience as a class representative and in the Academic Subcommittee has taught me that ideas only matter when they can move through real university structures and become useful to students.",
    "I am not promising to do everything alone. I am promising to understand the process, bring the right people together, communicate clearly, and keep students informed about what is moving - and what still needs work.",
  ],
  quotePrefix: "“Meaningful progress is built ",
  quoteEmphasis: "stone by stone",
  quoteSuffix: ", conversation by conversation, and student by student.”",
} as const;
