import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { idColumn, createdAtColumn, updatedAtColumn } from "./columns.helpers";
import { forms } from "./forms";

export const QUESTION_TYPES = [
  "text",
  "textarea",
  "single_choice",
  "multiple_choice",
  "rating",
  "scale",
  "yes_no",
  "date",
  "number",
] as const;

/** Every question is its own row, independently orderable and queryable. */
export const formQuestions = sqliteTable("form_questions", {
  id: idColumn(),
  formId: text("form_id")
    .notNull()
    .references(() => forms.id, { onDelete: "cascade" }),
  type: text("type", { enum: QUESTION_TYPES }).notNull(),
  question: text("question").notNull(),
  description: text("description"),
  isRequired: integer("is_required", { mode: "boolean" })
    .notNull()
    .default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: createdAtColumn(),
  updatedAt: updatedAtColumn(),
});

export type FormQuestion = typeof formQuestions.$inferSelect;
export type NewFormQuestion = typeof formQuestions.$inferInsert;
export type QuestionType = (typeof QUESTION_TYPES)[number];
