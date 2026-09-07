"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/react";
import { LANGUAGES } from "@/types/auth.schema";

const LABELS: Record<(typeof LANGUAGES)[number], string> = {
  en: "English",
  fr: "French",
  sw: "Swahili",
};

export function LanguageForm({ language: initialLanguage }: { language: string }) {
  const router = useRouter();
  const [language, setLanguage] = useState(initialLanguage);
  const [done, setDone] = useState(false);

  const update = trpc.auth.updateLanguage.useMutation({
    onSuccess: () => {
      setDone(true);
      router.refresh();
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setDone(false);
    update.mutate({ language: language as (typeof LANGUAGES)[number] });
  }

  return (
    <div className="flex max-w-sm flex-col gap-3">
      <p className="rounded-xl bg-navy/5 px-4 py-3 text-sm text-navy/70">
        Coming soon - the admin interface isn&apos;t translated yet. Your preference is saved now so it&apos;s
        ready once it is.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-navy/60">Language</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full rounded-xl border border-navy/15 bg-white px-3 py-2 text-navy outline-none focus:border-gold"
          >
            {LANGUAGES.map((code) => (
              <option key={code} value={code}>
                {LABELS[code]}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          disabled={update.isPending}
          className="self-start rounded-full bg-navy px-5 py-2.5 text-sm font-bold text-ivory hover:bg-navy-d disabled:opacity-60"
        >
          {update.isPending ? "Saving..." : "Save"}
        </button>
        {update.error && <p className="text-sm text-blush-i">{update.error.message}</p>}
        {done && !update.error && <p className="text-sm text-gold-d">Preference saved.</p>}
      </form>
    </div>
  );
}
