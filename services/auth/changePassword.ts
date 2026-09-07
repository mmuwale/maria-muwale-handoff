import type { db as Db } from "@/lib/db/client";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { verifyPassword } from "@/lib/auth/verifyPassword";
import { hashPassword } from "@/lib/auth/hashPassword";
import type { CurrentUser } from "@/lib/auth/getCurrentUser";
import type { ChangePasswordInput } from "@/types/auth.schema";

export async function changePassword(db: typeof Db, user: CurrentUser, input: ChangePasswordInput) {
  const row = await db.query.users.findFirst({ where: eq(users.id, user.id) });
  if (!row) throw new TRPCError({ code: "NOT_FOUND" });

  const valid = await verifyPassword(input.currentPassword, row.passwordHash);
  if (!valid) throw new TRPCError({ code: "UNAUTHORIZED", message: "Current password is incorrect." });

  const passwordHash = await hashPassword(input.newPassword);
  await db.update(users).set({ passwordHash, updatedAt: new Date() }).where(eq(users.id, user.id));

  return { ok: true } as const;
}
