import type { db as Db } from "@/lib/db/client";
import { users, roles, userRoles } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { hashPassword } from "@/lib/auth/hashPassword";
import type { CreateAdminInput } from "@/types/auth.schema";

/** Only super_admin can reach this (enforced at the router). Creates a new
 *  feedback_admin account - the only way admin accounts come into being,
 *  there is no public sign-up. */
export async function createFeedbackAdmin(db: typeof Db, input: CreateAdminInput) {
  const existing = await db.query.users.findFirst({ where: eq(users.email, input.email) });
  if (existing) {
    throw new TRPCError({ code: "CONFLICT", message: "That email is already in use." });
  }

  const role = await db.query.roles.findFirst({ where: eq(roles.name, "feedback_admin") });
  if (!role) {
    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "feedback_admin role is not seeded." });
  }

  const passwordHash = await hashPassword(input.password);

  return db.transaction((tx) => {
    const user = tx
      .insert(users)
      .values({ name: input.name, email: input.email, passwordHash })
      .returning()
      .get();

    tx.insert(userRoles).values({ userId: user.id, roleId: role.id }).run();

    return { id: user.id, name: user.name, email: user.email };
  });
}
