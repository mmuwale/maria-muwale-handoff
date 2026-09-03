/**
 * Per-pillar milestones, extracted from the manifesto coda (tier 2) rather
 * than invented - CONSTRAINTS.md allows rearranging real copy, never adding
 * to it. Every date here also appears in the coda paragraph verbatim.
 */
export const milestonesByPillarTitle: Record<
  string,
  Array<{ label: string; when: string }>
> = {
  "Smart Learning Spaces": [
    { label: "First documented step", when: "End of October 2026" },
    { label: "Feasibility decision", when: "End of January 2027" },
  ],
  "Interfaculty Projects": [
    { label: "First documented step", when: "End of October 2026" },
    { label: "First interfaculty challenge", when: "End of April 2027" },
  ],
  "Industrial Visits": [
    { label: "First documented step", when: "End of October 2026" },
  ],
  "Faculty Spotlight Week": [
    { label: "First documented step", when: "End of October 2026" },
    { label: "First Faculty Spotlight Week", when: "End of April 2027" },
  ],
};
