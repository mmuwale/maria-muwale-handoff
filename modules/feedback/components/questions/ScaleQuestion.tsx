import type { PublishedFormQuestion } from "@/services/forms/getPublishedFormBySlug";

export function ScaleQuestion({
  question,
  value,
  onChange,
}: {
  question: PublishedFormQuestion;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {question.options.map((option) => (
        <button
          key={option.id}
          type="button"
          onClick={() => onChange(option.value)}
          className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
            value === option.value
              ? "border-navy bg-navy text-ivory"
              : "border-navy/20 text-navy hover:border-navy/40"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
