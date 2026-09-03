import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import type { db as Db } from "@/lib/db/client";
import { sessions } from "@/lib/db/schema";
import { SESSION_COOKIE } from "./sessionCookie";

/** Revokes the current session server-side and clears the cookie. */
export async function destroySession(db: typeof Db) {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value;

  if (sessionId) {
    await db.delete(sessions).where(eq(sessions.id, sessionId));
  }

  cookieStore.delete(SESSION_COOKIE);
}
