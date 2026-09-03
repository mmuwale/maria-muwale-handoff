import type { db as Db } from "@/lib/db/client";
import { userRoles, rolePermissions, permissions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

/** Every permission name a user holds, via any role they've been assigned. */
export async function getPermissionsForUser(db: typeof Db, userId: string) {
  const rows = await db
    .select({ name: permissions.name })
    .from(userRoles)
    .innerJoin(rolePermissions, eq(rolePermissions.roleId, userRoles.roleId))
    .innerJoin(permissions, eq(permissions.id, rolePermissions.permissionId))
    .where(eq(userRoles.userId, userId));

  return new Set(rows.map((r) => r.name));
}
