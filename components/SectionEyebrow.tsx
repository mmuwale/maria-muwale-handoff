/** The small tracked-caps label above a section heading, e.g. "THE FOUR PILLARS". */
export function SectionEyebrow({ children }: { children: string }) {
  return (
    <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-blush-i">
      {children}
    </div>
  );
}
