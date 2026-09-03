import type { db as Db } from "@/lib/db/client";
import { forms, formQuestions, questionOptions } from "@/lib/db/schema";
import { and, asc, eq } from "drizzle-orm";

/**
 * Loads a published form with its questions and options, ordered for rendering.
 * Returns null if the slug doesn't exist or the form isn't published.
 */
export async function getPublishedFormBySlug(db: typeof Db, slug: string) {
  const form = await db.query.forms.findFirst({
    where: and(eq(forms.slug, slug), eq(forms.status, "published")),
    with: {
      questions: {
        orderBy: asc(formQuestions.sortOrder),
        with: {
          options: {
            orderBy: asc(questionOptions.sortOrder),
          },
        },
      },
    },
  });

  return form ?? null;
}

export type PublishedForm = NonNullable<
  Awaited<ReturnType<typeof getPublishedFormBySlug>>
>;
export type PublishedFormQuestion = PublishedForm["questions"][number];
