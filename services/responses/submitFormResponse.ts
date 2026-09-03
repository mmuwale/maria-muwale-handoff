import type { db as Db } from "@/lib/db/client";
import { formQuestions, formResponses, responseAnswers } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import type { SubmitResponseInput } from "@/types/feedback.schema";
import { TRPCError } from "@trpc/server";

/**
 * Writes one form response and its answers as a single transaction. Rejects
 * if a required question was skipped or an answer references another form.
 *
 * Deliberately takes no identity or metadata argument - not a user id, not
 * an IP, not a user agent. There is nothing here for a reviewer to
 * correlate a response back to a person, by design.
 */
export async function submitFormResponse(db: typeof Db, input: SubmitResponseInput) {
  const questions = await db.query.formQuestions.findMany({
    where: eq(formQuestions.formId, input.formId),
  });

  if (questions.length === 0) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Form has no questions." });
  }

  const questionById = new Map(questions.map((q) => [q.id, q]));
  const answeredIds = new Set(input.answers.map((a) => a.questionId));

  for (const question of questions) {
    if (question.isRequired && !answeredIds.has(question.id)) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: `"${question.question}" is required.`,
      });
    }
  }

  for (const answer of input.answers) {
    if (!questionById.has(answer.questionId)) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Answer references a question that does not belong to this form.",
      });
    }
  }

  return db.transaction((tx) => {
    const response = tx
      .insert(formResponses)
      .values({
        formId: input.formId,
        submittedAt: new Date(),
        status: "submitted",
      })
      .returning()
      .get();

    for (const answer of input.answers) {
      const value = Array.isArray(answer.value)
        ? JSON.stringify(answer.value)
        : answer.value;

      tx.insert(responseAnswers)
        .values({
          responseId: response.id,
          questionId: answer.questionId,
          value,
        })
        .run();
    }

    return response;
  });
}
