import type { db as Db } from "@/lib/db/client";
import { forms } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import type { CurrentUser } from "@/lib/auth/getCurrentUser";
import { assertFormAccess } from "./assertFormAccess";

export async function publishForm(db: typeof Db, formId: string, user: CurrentUser) {
  const form = await db.query.forms.findFirst({ where: eq(forms.id, formId) });
  if (!form) throw new TRPCError({ code: "NOT_FOUND" });

  await assertFormAccess(db, form, user, "forms.viewAll");

  return db
    .update(forms)
    .set({ status: "published", updatedAt: new Date() })
    .where(eq(forms.id, formId))
    .returning()
    .get();
}
