import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { idColumn, createdAtColumn } from "./columns.helpers";
import { users } from "./users";

/**
 * A database-backed session, referenced by an opaque token in an httpOnly
 * cookie. Chosen over a stateless JWT so a session can be revoked (logout,
 * disabling a user) without waiting for token expiry.
 */
export const sessions = sqliteTable("sessions", {
  id: idColumn(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: createdAtColumn(),
});

export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;
