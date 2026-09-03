import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { idColumn, createdAtColumn, updatedAtColumn } from "./columns.helpers";
import { formResponses } from "./form-responses";
import { formQuestions } from "./form-questions";

/**
 * One answer to one question within one response. `value` is always stored as
 * text; multiple_choice answers are JSON-encoded arrays of option values.
 */
export const responseAnswers = sqliteTable("response_answers", {
  id: idColumn(),
  responseId: text("response_id")
    .notNull()
    .references(() => formResponses.id, { onDelete: "cascade" }),
  questionId: text("question_id")
    .notNull()
    .references(() => formQuestions.id, { onDelete: "cascade" }),
  value: text("value").notNull(),
  createdAt: createdAtColumn(),
  updatedAt: updatedAtColumn(),
});

export type ResponseAnswer = typeof responseAnswers.$inferSelect;
export type NewResponseAnswer = typeof responseAnswers.$inferInsert;
