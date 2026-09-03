import type { PublishedFormQuestion } from "@/services/forms/getPublishedFormBySlug";

export function SingleChoiceQuestion({
  question,
  value,
  onChange,
}: {
  question: PublishedFormQuestion;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      {question.options.map((option) => (
        <label
          key={option.id}
          className="flex items-center gap-3 rounded-xl border border-navy/15 bg-white px-4 py-3 has-[:checked]:border-gold"
        >
          <input
            type="radio"
            name={question.id}
            value={option.value}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
            className="accent-[var(--color-gold-d)]"
          />
          <span className="text-navy">{option.label}</span>
        </label>
      ))}
    </div>
  );
}
