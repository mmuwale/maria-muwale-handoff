import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { idColumn, createdAtColumn } from "./columns.helpers";
import { forms } from "./forms";

/**
 * One anonymous submission to a form. Deliberately carries no respondent
 * identity or identifying metadata - no user_id, no IP, no user agent.
 * Reviewers can read what was said, never who said it. See
 * modules/feedback for the reasoning: hiding a name in the UI is not
 * anonymity if the row underneath still links back to a person.
 */
export const formResponses = sqliteTable("form_responses", {
  id: idColumn(),
  formId: text("form_id")
    .notNull()
    .references(() => forms.id, { onDelete: "cascade" }),
  submittedAt: integer("submitted_at", { mode: "timestamp" }),
  status: text("status", { enum: ["draft", "submitted"] })
    .notNull()
    .default("submitted"),
  createdAt: createdAtColumn(),
});

export type FormResponse = typeof formResponses.$inferSelect;
export type NewFormResponse = typeof formResponses.$inferInsert;
