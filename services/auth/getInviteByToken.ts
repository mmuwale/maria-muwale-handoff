import type { db as Db } from "@/lib/db/client";
import { invites } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

/** Public lookup for the invite-acceptance page - just enough to greet the
 *  invitee and tell an expired link apart from a bad one. */
export async function getInviteByToken(db: typeof Db, token: string) {
  const invite = await db.query.invites.findFirst({
    where: eq(invites.token, token),
    with: { user: { columns: { name: true, email: true } } },
  });
  if (!invite) return null;

  return {
    name: invite.user.name,
    email: invite.user.email,
    expired: invite.expiresAt.getTime() < Date.now(),
  };
}
