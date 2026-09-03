import type { Pillar } from "@/types/content";

/**
 * The four manifesto pillars, verbatim from CONTENT.md (tier 1 + tier 2).
 * Source of truth for both the campaign page's beat 4 and the manifesto page.
 * Do not edit the wording; only reordering or re-labelling is allowed.
 */
export const pillars: Pillar[] = [
  {
    number: "01",
    category: "Technology",
    title: "Smart Learning Spaces",
    said: "A proposed feature integrated into the MyStrath app, that allows students to see available classrooms, labs and lecture theatres, and navigate to them, with the wider system exploring other student services that could be digitised.",
    web: "Making it easier for students to discover suitable learning spaces and find their way around campus - by exploring a practical, university-approved pathway for better visibility of available spaces through existing systems.",
  },
  {
    number: "02",
    category: "Collaboration",
    title: "Interfaculty Projects",
    said: "Creating more meaningful academic challenges and collaborative projects that bring students across different courses and faculties together to solve real-world problems and learn from different principles.",
    web: "Starting with manageable pilots that bring students from different disciplines together to tackle real-world challenges and build solutions that no single field could create alone.",
  },
  {
    number: "03",
    category: "Exposure",
    title: "Industrial Visits",
    said: "Working with lecturers and relevant partners to expand educational visits that connect students with workplaces, industries and career opportunities beyond the classroom.",
    web: "Working with lecturers and relevant stakeholders to identify gaps, coordinate student demand and support meaningful exposure to workplaces and industries beyond the classroom.",
  },
  {
    number: "04",
    category: "Discovery",
    title: "Faculty Spotlight Week",
    said: "A week celebrating every faculty by showcasing its programmes, projects, opportunities, student life, achievements and the people behind them.",
    web: "An academic discovery and collaboration week where students can discover projects, research, opportunities and expertise beyond their own timetables - and see how different disciplines connect.",
  },
];
