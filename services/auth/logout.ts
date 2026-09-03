import type { db as Db } from "@/lib/db/client";
import { destroySession } from "@/lib/auth/destroySession";

export async function logout(db: typeof Db) {
  await destroySession(db);
}
