"use client";

import { useMemo, useState } from "react";
import type { PublishedForm } from "@/services/forms/getPublishedFormBySlug";
import { createAnswersStore } from "@/modules/feedback/state/createAnswersStore";
import { QuestionField } from "./QuestionField";
import { trpc } from "@/lib/trpc/react";

export function FormRenderer({ form }: { form: PublishedForm }) {
  const useAnswers = useMemo(() => createAnswersStore(), []);
  const answers = useAnswers((s) => s.answers);
  const setAnswer = useAnswers((s) => s.setAnswer);
  const [error, setError] = useState<string | null>(null);

  const submit = trpc.responses.submit.useMutation({
    onError: (err) => setError(err.message),
  });

  if (submit.isSuccess) {
    return (
      <div className="rounded-2xl border border-gold/40 bg-white p-8 text-center">
        <p className="font-serif text-2xl text-navy">Thank you.</p>
        <p className="mt-2 text-navy/60">Your response has been recorded.</p>
      </div>
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const answered = new Set(
      Object.entries(answers)
        .filter(([, value]) => (Array.isArray(value) ? value.length > 0 : value !== ""))
        .map(([questionId]) => questionId),
    );

    const missingRequired = form.questions.find(
      (q) => q.isRequired && !answered.has(q.id),
    );
    if (missingRequired) {
      setError(`"${missingRequired.question}" is required.`);
      return;
    }

    if (answered.size === 0) {
      setError("Answer at least one question.");
      return;
    }

    const payload = form.questions
      .filter((q) => answered.has(q.id))
      .map((q) => ({ questionId: q.id, value: answers[q.id]! }));

    submit.mutate({ formId: form.id, answers: payload });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      {form.questions.map((question) => (
        <div key={question.id}>
          <label className="mb-2 block font-medium text-navy">
            {question.question}
            {question.isRequired && <span className="ml-1 text-blush-i">*</span>}
          </label>
          {question.description && (
            <p className="mb-2 text-sm text-navy/60">{question.description}</p>
          )}
          <QuestionField
            question={question}
            value={answers[question.id]}
            onChange={(value) => setAnswer(question.id, value)}
          />
        </div>
      ))}

      {error && <p className="text-sm text-blush-i">{error}</p>}

      <button
        type="submit"
        disabled={submit.isPending}
        className="self-start rounded-full bg-navy px-6 py-3.5 text-sm font-bold text-ivory transition-colors hover:bg-navy-d disabled:opacity-60"
      >
        {submit.isPending ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}
