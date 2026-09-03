import type { PublishedFormQuestion } from "@/services/forms/getPublishedFormBySlug";

export function MultipleChoiceQuestion({
  question,
  value,
  onChange,
}: {
  question: PublishedFormQuestion;
  value: string[];
  onChange: (value: string[]) => void;
}) {
  function toggle(optionValue: string) {
    onChange(
      value.includes(optionValue)
        ? value.filter((v) => v !== optionValue)
        : [...value, optionValue],
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {question.options.map((option) => (
        <label
          key={option.id}
          className="flex items-center gap-3 rounded-xl border border-navy/15 bg-white px-4 py-3 has-[:checked]:border-gold"
        >
          <input
            type="checkbox"
            checked={value.includes(option.value)}
            onChange={() => toggle(option.value)}
            className="accent-[var(--color-gold-d)]"
          />
          <span className="text-navy">{option.label}</span>
        </label>
      ))}
    </div>
  );
}
