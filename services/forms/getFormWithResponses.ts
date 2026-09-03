import type { db as Db } from "@/lib/db/client";
import { forms, formQuestions, questionOptions, formResponses } from "@/lib/db/schema";
import { asc, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import type { CurrentUser } from "@/lib/auth/getCurrentUser";
import { assertFormAccess } from "./assertFormAccess";

/**
 * A form's questions and every anonymous response to it, for the reviewer
 * view. Responses carry only `id`, `submittedAt` and their answers - never a
 * respondent identity, because none is stored (see form-responses.ts).
 */
export async function getFormWithResponses(db: typeof Db, formId: string, user: CurrentUser) {
  const form = await db.query.forms.findFirst({ where: eq(forms.id, formId) });
  if (!form) throw new TRPCError({ code: "NOT_FOUND" });

  await assertFormAccess(db, form, user, "feedback.viewAll");

  const questions = await db.query.formQuestions.findMany({
    where: eq(formQuestions.formId, formId),
    orderBy: asc(formQuestions.sortOrder),
    with: { options: { orderBy: asc(questionOptions.sortOrder) } },
  });

  const responses = await db.query.formResponses.findMany({
    where: eq(formResponses.formId, formId),
    orderBy: asc(formResponses.createdAt),
    with: { answers: true },
  });

  return { form, questions, responses };
}
