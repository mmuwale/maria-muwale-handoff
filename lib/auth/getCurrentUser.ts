import { cache } from "react";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { sessions, users } from "@/lib/db/schema";
import { getPermissionsForUser } from "./getPermissionsForUser";
import { SESSION_COOKIE } from "./sessionCookie";

export type CurrentUser = {
  id: string;
  name: string;
  email: string;
  permissions: Set<string>;
};

/**
 * The data access layer for admin auth: the single place that turns a
 * request's session cookie into a verified user. Called directly from
 * Server Components/layouts and from the tRPC context - never from
 * middleware/proxy, which is not a security boundary
 * (see CVE-2025-29927 and the current Next.js guidance on defense in depth).
 * Cached per request so multiple call sites don't repeat the DB round trip.
 */
export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value;
  if (!sessionId) return null;

  const session = await db.query.sessions.findFirst({
    where: eq(sessions.id, sessionId),
  });
  if (!session || session.expiresAt.getTime() < Date.now()) return null;

  const user = await db.query.users.findFirst({
    where: eq(users.id, session.userId),
  });
  if (!user || !user.isActive) return null;

  const permissions = await getPermissionsForUser(db, user.id);

  return { id: user.id, name: user.name, email: user.email, permissions };
});
