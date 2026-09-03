import Link from "next/link";
import type { Form } from "@/lib/db/schema";

const statusStyles: Record<Form["status"], string> = {
  draft: "bg-navy/10 text-navy",
  published: "bg-gold/20 text-gold-d",
  closed: "bg-blush-i/15 text-blush-i",
};

export function FormsList({ forms }: { forms: Form[] }) {
  if (forms.length === 0) {
    return <p className="text-navy/60">No forms yet.</p>;
  }

  return (
    <ul className="flex flex-col gap-3">
      {forms.map((form) => (
        <li key={form.id}>
          <Link
            href={`/admin/forms/${form.id}`}
            className="flex items-center justify-between rounded-2xl border border-navy/10 bg-white px-5 py-4 transition-colors hover:border-gold"
          >
            <div>
              <p className="font-medium text-navy">{form.title}</p>
              <p className="text-sm text-navy/50">/forms/{form.slug}</p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${statusStyles[form.status]}`}
            >
              {form.status}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
