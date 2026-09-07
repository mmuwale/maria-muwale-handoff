import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { idColumn, createdAtColumn } from "./columns.helpers";
import { users } from "./users";

/**
 * One outstanding invite per newly created admin. The user row is created
 * with an unusable placeholder password hash at the same time - until this
 * invite is accepted, no password anyone knows will ever authenticate that
 * account, so a pending invite doesn't need to double-gate login itself.
 */
export const invites = sqliteTable("invites", {
  id: idColumn(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: createdAtColumn(),
});

export type Invite = typeof invites.$inferSelect;
export type NewInvite = typeof invites.$inferInsert;
