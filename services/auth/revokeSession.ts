import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import type { db as Db } from "@/lib/db/client";
import { sessions } from "@/lib/db/schema";
import { TRPCError } from "@trpc/server";
import type { CurrentUser } from "@/lib/auth/getCurrentUser";
import { SESSION_COOKIE } from "@/lib/auth/sessionCookie";

/** Revokes one of the caller's own sessions. If it's the session making
 *  this request, also clears the cookie - the caller ends up logged out. */
export async function revokeSession(db: typeof Db, user: CurrentUser, sessionId: string) {
  const session = await db.query.sessions.findFirst({ where: eq(sessions.id, sessionId) });
  if (!session || session.userId !== user.id) {
    throw new TRPCError({ code: "NOT_FOUND" });
  }

  await db.delete(sessions).where(eq(sessions.id, sessionId));

  const cookieStore = await cookies();
  if (cookieStore.get(SESSION_COOKIE)?.value === sessionId) {
    cookieStore.delete(SESSION_COOKIE);
  }

  return { id: sessionId };
}
