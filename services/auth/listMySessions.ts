import type { db as Db } from "@/lib/db/client";
import { sessions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import type { CurrentUser } from "@/lib/auth/getCurrentUser";

export async function listMySessions(db: typeof Db, user: CurrentUser) {
  return db.query.sessions.findMany({
    where: eq(sessions.userId, user.id),
    orderBy: (s, { desc }) => desc(s.createdAt),
  });
}
