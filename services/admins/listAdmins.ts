import type { db as Db } from "@/lib/db/client";

/** Every admin account with the role names assigned to it, for the
 *  super_admin's user-management screen. */
export async function listAdmins(db: typeof Db) {
  const rows = await db.query.users.findMany({
    orderBy: (u, { desc }) => desc(u.createdAt),
    with: { userRoles: { with: { role: true } } },
  });

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    isActive: row.isActive,
    createdAt: row.createdAt,
    roles: row.userRoles.map((ur) => ur.role.name),
  }));
}
