export function TextareaQuestion({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={4}
      className="w-full rounded-xl border border-navy/15 bg-white px-4 py-3 text-navy outline-none focus:border-gold"
    />
  );
}
