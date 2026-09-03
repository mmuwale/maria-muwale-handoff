import { sqliteTable, text, primaryKey } from "drizzle-orm/sqlite-core";
import { createdAtColumn } from "./columns.helpers";
import { users } from "./users";
import { roles } from "./roles";

/** Which roles a user holds. A user may hold more than one role. */
export const userRoles = sqliteTable(
  "user_roles",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    roleId: text("role_id")
      .notNull()
      .references(() => roles.id, { onDelete: "cascade" }),
    createdAt: createdAtColumn(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.roleId] })],
);
