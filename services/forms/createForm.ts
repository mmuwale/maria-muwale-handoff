import type { db as Db } from "@/lib/db/client";
import { forms, formQuestions, questionOptions } from "@/lib/db/schema";
import type { CreateFormInput } from "@/types/feedback.schema";
import { TRPCError } from "@trpc/server";

const CHOICE_TYPES = new Set(["single_choice", "multiple_choice", "scale"]);

/** Creates a form, its questions and their options in one transaction. */
export async function createForm(db: typeof Db, input: CreateFormInput, createdBy: string) {
  for (const q of input.questions) {
    if (CHOICE_TYPES.has(q.type) && (!q.options || q.options.length === 0)) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: `"${q.question}" needs at least one option.`,
      });
    }
  }

  return db.transaction(async (tx) => {
    const [form] = await tx
      .insert(forms)
      .values({
        title: input.title,
        slug: input.slug,
        description: input.description,
        allowAnonymous: input.allowAnonymous,
        status: "draft",
        createdBy,
      })
      .returning();

    for (const [sortOrder, q] of input.questions.entries()) {
      const [question] = await tx
        .insert(formQuestions)
        .values({
          formId: form.id,
          type: q.type,
          question: q.question,
          description: q.description,
          isRequired: q.isRequired,
          sortOrder,
        })
        .returning();

      for (const [optionOrder, option] of (q.options ?? []).entries()) {
        await tx.insert(questionOptions).values({
          questionId: question.id,
          label: option.label,
          value: option.value,
          sortOrder: optionOrder,
        });
      }
    }

    return form;
  });
}
