import type { db as Db } from "@/lib/db/client";
import { forms, type Form } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import type { CurrentUser } from "@/lib/auth/getCurrentUser";
import { assertFormAccess } from "./assertFormAccess";

/** Shared by publishForm/closeForm - reopening a closed form is just another publish. */
export async function setFormStatus(
  db: typeof Db,
  formId: string,
  user: CurrentUser,
  status: Form["status"],
) {
  const form = await db.query.forms.findFirst({ where: eq(forms.id, formId) });
  if (!form) throw new TRPCError({ code: "NOT_FOUND" });

  await assertFormAccess(db, form, user, "forms.viewAll");

  const [updated] = await db
    .update(forms)
    .set({ status, updatedAt: new Date() })
    .where(eq(forms.id, formId))
    .returning();

  return updated;
}
