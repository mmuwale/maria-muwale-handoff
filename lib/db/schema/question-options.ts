import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { idColumn, createdAtColumn } from "./columns.helpers";
import { formQuestions } from "./form-questions";

/** Predefined choices for single_choice / multiple_choice / scale questions. */
export const questionOptions = sqliteTable("question_options", {
  id: idColumn(),
  questionId: text("question_id")
    .notNull()
    .references(() => formQuestions.id, { onDelete: "cascade" }),
  label: text("label").notNull(),
  value: text("value").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: createdAtColumn(),
});

export type QuestionOption = typeof questionOptions.$inferSelect;
export type NewQuestionOption = typeof questionOptions.$inferInsert;
