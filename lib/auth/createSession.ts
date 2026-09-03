import { cookies } from "next/headers";
import type { db as Db } from "@/lib/db/client";
import { sessions } from "@/lib/db/schema";
import { SESSION_COOKIE, SESSION_DURATION_MS, sessionCookieOptions } from "./sessionCookie";

/** Creates a session row and sets the httpOnly cookie that references it. */
export async function createSession(db: typeof Db, userId: string) {
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  const session = await db
    .insert(sessions)
    .values({ userId, expiresAt })
    .returning()
    .get();

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, session.id, {
    ...sessionCookieOptions,
    expires: expiresAt,
  });

  return session;
}
