import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { idColumn, createdAtColumn, updatedAtColumn } from "./columns.helpers";

/** Optional grouping for forms, e.g. "Course Evaluation", "Event Feedback". */
export const feedbackCategories = sqliteTable("feedback_categories", {
  id: idColumn(),
  name: text("name").notNull(),
  description: text("description"),
  createdAt: createdAtColumn(),
  updatedAt: updatedAtColumn(),
});

export type FeedbackCategory = typeof feedbackCategories.$inferSelect;
export type NewFeedbackCategory = typeof feedbackCategories.$inferInsert;
