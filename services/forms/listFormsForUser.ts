import type { db as Db } from "@/lib/db/client";
import { forms, formReviewers } from "@/lib/db/schema";
import { eq, or, inArray } from "drizzle-orm";
import type { CurrentUser } from "@/lib/auth/getCurrentUser";

/** Forms a user can see: everything if they hold feedback.viewAll, otherwise
 *  only forms they created or were added to as a reviewer. */
export async function listFormsForUser(db: typeof Db, user: CurrentUser) {
  if (user.permissions.has("forms.viewAll")) {
    return db.query.forms.findMany({ orderBy: (f, { desc }) => desc(f.createdAt) });
  }

  const reviewedFormIds = (
    await db
      .select({ formId: formReviewers.formId })
      .from(formReviewers)
      .where(eq(formReviewers.userId, user.id))
  ).map((r) => r.formId);

  const ownedOrReviewed =
    reviewedFormIds.length > 0
      ? or(eq(forms.createdBy, user.id), inArray(forms.id, reviewedFormIds))
      : eq(forms.createdBy, user.id);

  return db.query.forms.findMany({
    where: ownedOrReviewed,
    orderBy: (f, { desc }) => desc(f.createdAt),
  });
}
