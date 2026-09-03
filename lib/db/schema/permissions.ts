import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { idColumn, createdAtColumn } from "./columns.helpers";

/**
 * An atomic capability, e.g. "forms.create", "feedback.view". Authorization
 * checks always test for a permission, never for a role name directly -
 * roles are just a convenient way to assign several permissions at once.
 */
export const permissions = sqliteTable("permissions", {
  id: idColumn(),
  name: text("name").notNull().unique(),
  description: text("description"),
  createdAt: createdAtColumn(),
});

export type Permission = typeof permissions.$inferSelect;
export type NewPermission = typeof permissions.$inferInsert;
