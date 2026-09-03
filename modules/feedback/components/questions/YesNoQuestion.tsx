export function YesNoQuestion({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex gap-3">
      {["yes", "no"].map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={`rounded-full border px-5 py-2 text-sm font-semibold uppercase tracking-wide transition-colors ${
            value === option
              ? "border-navy bg-navy text-ivory"
              : "border-navy/20 text-navy hover:border-navy/40"
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
