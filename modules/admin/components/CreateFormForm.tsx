"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/react";
import { QUESTION_TYPES, type QuestionType } from "@/lib/db/schema/form-questions";

const CHOICE_TYPES = new Set<QuestionType>(["single_choice", "multiple_choice", "scale"]);

type DraftQuestion = {
  type: QuestionType;
  question: string;
  isRequired: boolean;
  optionsText: string;
};

function slugify(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function emptyQuestion(): DraftQuestion {
  return { type: "text", question: "", isRequired: false, optionsText: "" };
}

export function CreateFormForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState<DraftQuestion[]>([emptyQuestion()]);

  const create = trpc.adminForms.create.useMutation({
    onSuccess: () => {
      router.push("/admin");
      router.refresh();
    },
  });

  function updateQuestion(index: number, patch: Partial<DraftQuestion>) {
    setQuestions((qs) => qs.map((q, i) => (i === index ? { ...q, ...patch } : q)));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    create.mutate({
      title,
      slug: slug || slugify(title),
      description: description || undefined,
      allowAnonymous: true,
      questions: questions.map((q) => ({
        type: q.type,
        question: q.question,
        isRequired: q.isRequired,
        options: CHOICE_TYPES.has(q.type)
          ? q.optionsText
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
              .map((s) => ({ label: s, value: s }))
          : undefined,
      })),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      <div>
        <label className="mb-1 block text-sm font-medium text-navy">Title</label>
        <input
          required
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (!slugTouched) setSlug(slugify(e.target.value));
          }}
          className="w-full rounded-xl border border-navy/15 bg-white px-4 py-3 text-navy outline-none focus:border-gold"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-navy">Slug</label>
        <input
          required
          value={slug}
          onChange={(e) => {
            setSlug(e.target.value);
            setSlugTouched(true);
          }}
          className="w-full rounded-xl border border-navy/15 bg-white px-4 py-3 text-navy outline-none focus:border-gold"
        />
        <p className="mt-1 text-xs text-navy/50">/forms/{slug || "..."}</p>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-navy">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          className="w-full rounded-xl border border-navy/15 bg-white px-4 py-3 text-navy outline-none focus:border-gold"
        />
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="font-medium text-navy">Questions</h2>
        {questions.map((q, i) => (
          <div key={i} className="flex flex-col gap-3 rounded-2xl border border-navy/10 bg-white p-4">
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                required
                placeholder="Question text"
                value={q.question}
                onChange={(e) => updateQuestion(i, { question: e.target.value })}
                className="min-w-0 flex-1 rounded-xl border border-navy/15 px-3 py-2 text-navy outline-none focus:border-gold"
              />
              <select
                value={q.type}
                onChange={(e) => updateQuestion(i, { type: e.target.value as QuestionType })}
                className="w-full rounded-xl border border-navy/15 px-3 py-2 text-navy sm:w-auto"
              >
                {QUESTION_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {CHOICE_TYPES.has(q.type) && (
              <input
                placeholder="Options, comma separated"
                value={q.optionsText}
                onChange={(e) => updateQuestion(i, { optionsText: e.target.value })}
                className="rounded-xl border border-navy/15 px-3 py-2 text-navy outline-none focus:border-gold"
              />
            )}

            <label className="flex items-center gap-2 text-sm text-navy/70">
              <input
                type="checkbox"
                checked={q.isRequired}
                onChange={(e) => updateQuestion(i, { isRequired: e.target.checked })}
              />
              Required
            </label>

            {questions.length > 1 && (
              <button
                type="button"
                onClick={() => setQuestions((qs) => qs.filter((_, idx) => idx !== i))}
                className="self-start text-xs font-medium text-blush-i"
              >
                Remove question
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={() => setQuestions((qs) => [...qs, emptyQuestion()])}
          className="self-start rounded-full border border-navy/20 px-4 py-2 text-sm font-medium text-navy hover:border-navy"
        >
          + Add question
        </button>
      </div>

      {create.error && <p className="text-sm text-blush-i">{create.error.message}</p>}

      <button
        type="submit"
        disabled={create.isPending}
        className="self-start rounded-full bg-navy px-6 py-3.5 text-sm font-bold text-ivory hover:bg-navy-d disabled:opacity-60"
      >
        {create.isPending ? "Creating..." : "Create form"}
      </button>
    </form>
  );
}
