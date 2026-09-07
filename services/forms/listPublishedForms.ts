import type { db as Db } from "@/lib/db/client";
import { forms } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

/** Every form currently open for responses, for the public form-picker page. */
export async function listPublishedForms(db: typeof Db) {
  return db.query.forms.findMany({
    where: eq(forms.status, "published"),
    orderBy: (f, { desc }) => desc(f.createdAt),
    columns: { id: true, title: true, slug: true, description: true },
  });
}
