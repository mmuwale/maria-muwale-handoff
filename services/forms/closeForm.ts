import type { db as Db } from "@/lib/db/client";
import type { CurrentUser } from "@/lib/auth/getCurrentUser";
import { setFormStatus } from "./setFormStatus";

export function closeForm(db: typeof Db, formId: string, user: CurrentUser) {
  return setFormStatus(db, formId, user, "closed");
}
