import type { db as Db } from "@/lib/db/client";
import { users, userRoles, roles } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import type { CurrentUser } from "@/lib/auth/getCurrentUser";

const SUPER_ADMIN_ROLE = "super_admin";

/**
 * Two guardrails beyond the admins.delete permission check: you can't delete
 * your own account (avoids an admin locking themselves out mid-session), and
 * you can't delete the last remaining super_admin (avoids locking everyone
 * out of user management - this is what protects the seeded account, not a
 * hardcoded id, since the seeded admin's email/password can change).
 */
export async function deleteAdmin(db: typeof Db, actor: CurrentUser, targetUserId: string) {
  if (targetUserId === actor.id) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "You cannot delete your own account." });
  }

  const target = await db.query.users.findFirst({ where: eq(users.id, targetUserId) });
  if (!target) throw new TRPCError({ code: "NOT_FOUND" });

  const superAdminRole = await db.query.roles.findFirst({ where: eq(roles.name, SUPER_ADMIN_ROLE) });

  if (superAdminRole) {
    const holdsSuperAdmin = await db.query.userRoles.findFirst({
      where: and(eq(userRoles.userId, targetUserId), eq(userRoles.roleId, superAdminRole.id)),
    });

    if (holdsSuperAdmin) {
      const remaining = await db
        .select({ userId: userRoles.userId })
        .from(userRoles)
        .where(eq(userRoles.roleId, superAdminRole.id));

      if (remaining.length <= 1) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cannot delete the last super admin.",
        });
      }
    }
  }

  await db.delete(users).where(eq(users.id, targetUserId));
  return { id: target.id };
}
