import type { db as Db } from "@/lib/db/client";
import { users } from "@/lib/db/schema";
import { eq, and, ne } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import type { CurrentUser } from "@/lib/auth/getCurrentUser";
import type { UpdateProfileInput } from "@/types/auth.schema";

export async function updateProfile(db: typeof Db, user: CurrentUser, input: UpdateProfileInput) {
  const emailTaken = await db.query.users.findFirst({
    where: and(eq(users.email, input.email), ne(users.id, user.id)),
  });
  if (emailTaken) throw new TRPCError({ code: "CONFLICT", message: "That email is already in use." });

  const [updated] = await db
    .update(users)
    .set({ name: input.name, email: input.email, updatedAt: new Date() })
    .where(eq(users.id, user.id))
    .returning();

  return { id: updated.id, name: updated.name, email: updated.email };
}
