const STARS = [1, 2, 3, 4, 5];

export function RatingQuestion({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const current = Number(value) || 0;

  return (
    <div className="flex gap-1.5">
      {STARS.map((star) => (
        <button
          key={star}
          type="button"
          aria-label={`${star} star${star > 1 ? "s" : ""}`}
          onClick={() => onChange(String(star))}
          className={`text-2xl leading-none ${star <= current ? "text-gold-d" : "text-navy/20"}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}
