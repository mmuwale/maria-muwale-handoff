import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { idColumn, createdAtColumn, updatedAtColumn } from "./columns.helpers";
import { users } from "./users";
import { feedbackCategories } from "./feedback-categories";

/** One feedback form, e.g. "Campaign Feedback", "Course Evaluation". */
export const forms = sqliteTable("forms", {
  id: idColumn(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  status: text("status", { enum: ["draft", "published", "closed"] })
    .notNull()
    .default("draft"),
  startsAt: integer("starts_at", { mode: "timestamp" }),
  endsAt: integer("ends_at", { mode: "timestamp" }),
  allowAnonymous: integer("allow_anonymous", { mode: "boolean" })
    .notNull()
    .default(true),
  categoryId: text("category_id").references(() => feedbackCategories.id, {
    onDelete: "set null",
  }),
  createdBy: text("created_by")
    .notNull()
    .references(() => users.id),
  createdAt: createdAtColumn(),
  updatedAt: updatedAtColumn(),
});

export type Form = typeof forms.$inferSelect;
export type NewForm = typeof forms.$inferInsert;
