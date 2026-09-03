import { sqliteTable, text, primaryKey } from "drizzle-orm/sqlite-core";
import { createdAtColumn } from "./columns.helpers";
import { forms } from "./forms";
import { users } from "./users";

/**
 * Grants a feedback admin who did not create a form the ability to view its
 * responses. The form's own `created_by` owner and any super_admin do not
 * need a row here - this table is only for extending access beyond that.
 */
export const formReviewers = sqliteTable(
  "form_reviewers",
  {
    formId: text("form_id")
      .notNull()
      .references(() => forms.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: createdAtColumn(),
  },
  (table) => [primaryKey({ columns: [table.formId, table.userId] })],
);
