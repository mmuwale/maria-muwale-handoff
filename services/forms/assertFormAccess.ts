import type { db as Db } from "@/lib/db/client";
import { formReviewers } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import type { CurrentUser } from "@/lib/auth/getCurrentUser";

/**
 * Defense in depth: even though the caller already passed a permission
 * check to reach this procedure, a plain "feedback.view" holder should only
 * see forms they own or were explicitly added to review - not every form in
 * the system. Only "feedback.viewAll" (super_admin) bypasses ownership.
 */
export async function assertFormAccess(
  db: typeof Db,
  form: { id: string; createdBy: string },
  user: CurrentUser,
  bypassPermission: string,
) {
  if (user.permissions.has(bypassPermission)) return;
  if (form.createdBy === user.id) return;

  const reviewer = await db.query.formReviewers.findFirst({
    where: and(eq(formReviewers.formId, form.id), eq(formReviewers.userId, user.id)),
  });
  if (reviewer) return;

  throw new TRPCError({ code: "FORBIDDEN", message: "You cannot access this form." });
}
