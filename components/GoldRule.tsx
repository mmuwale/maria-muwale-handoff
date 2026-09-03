/** A single-purpose divider: the thin gold rule used under headings throughout the site. */
export function GoldRule({ className = "" }: { className?: string }) {
  return (
    <div
      className={`h-px w-[70px] bg-gold ${className}`}
      role="presentation"
    />
  );
}
