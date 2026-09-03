import { text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

/** Primary key: a random UUID stored as text, generated on insert. */
export function idColumn() {
  return text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID());
}

/** `created_at` populated by SQLite at insert time. */
export function createdAtColumn() {
  return integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`);
}

/** `updated_at` populated by SQLite at insert time; app code bumps it on update. */
export function updatedAtColumn() {
  return integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`);
}
