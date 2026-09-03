import { sqliteTable, text, primaryKey } from "drizzle-orm/sqlite-core";
import { createdAtColumn } from "./columns.helpers";
import { roles } from "./roles";
import { permissions } from "./permissions";

/** Which permissions a role grants. */
export const rolePermissions = sqliteTable(
  "role_permissions",
  {
    roleId: text("role_id")
      .notNull()
      .references(() => roles.id, { onDelete: "cascade" }),
    permissionId: text("permission_id")
      .notNull()
      .references(() => permissions.id, { onDelete: "cascade" }),
    createdAt: createdAtColumn(),
  },
  (table) => [primaryKey({ columns: [table.roleId, table.permissionId] })],
);
