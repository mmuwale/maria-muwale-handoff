import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { idColumn, createdAtColumn, updatedAtColumn } from "./columns.helpers";

/**
 * Authenticated system users only: super admins and feedback admins.
 * Anonymous respondents never get a row here - see form_responses.
 * Authorization comes entirely from user_roles/roles/role_permissions,
 * not a column on this table.
 */
export const users = sqliteTable("users", {
  id: idColumn(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  createdAt: createdAtColumn(),
  updatedAt: updatedAtColumn(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
