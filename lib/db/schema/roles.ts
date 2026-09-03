import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { idColumn, createdAtColumn } from "./columns.helpers";

/** A named bundle of permissions, e.g. "super_admin", "feedback_admin". */
export const roles = sqliteTable("roles", {
  id: idColumn(),
  name: text("name").notNull().unique(),
  description: text("description"),
  createdAt: createdAtColumn(),
});

export type Role = typeof roles.$inferSelect;
export type NewRole = typeof roles.$inferInsert;
