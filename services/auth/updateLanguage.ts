import type { db as Db } from "@/lib/db/client";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import type { CurrentUser } from "@/lib/auth/getCurrentUser";
import type { UpdateLanguageInput } from "@/types/auth.schema";

/** Persists the preference only - no i18n system reads this yet. */
export async function updateLanguage(db: typeof Db, user: CurrentUser, input: UpdateLanguageInput) {
  const [updated] = await db
    .update(users)
    .set({ language: input.language, updatedAt: new Date() })
    .where(eq(users.id, user.id))
    .returning();

  return { language: updated.language };
}
