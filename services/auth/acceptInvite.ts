import type { db as Db } from "@/lib/db/client";
import { users, invites } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { hashPassword } from "@/lib/auth/hashPassword";
import { createSession } from "@/lib/auth/createSession";
import type { AcceptInviteInput } from "@/types/auth.schema";

const INVALID_INVITE = new TRPCError({ code: "BAD_REQUEST", message: "This invite link is invalid or has expired." });

export async function acceptInvite(db: typeof Db, input: AcceptInviteInput) {
  const invite = await db.query.invites.findFirst({ where: eq(invites.token, input.token) });
  if (!invite || invite.expiresAt.getTime() < Date.now()) throw INVALID_INVITE;

  const passwordHash = await hashPassword(input.password);

  const [user] = await db.transaction(async (tx) => {
    const updated = await tx
      .update(users)
      .set({ passwordHash, updatedAt: new Date() })
      .where(eq(users.id, invite.userId))
      .returning();

    await tx.delete(invites).where(eq(invites.id, invite.id));

    return updated;
  });

  await createSession(db, user.id);

  return { id: user.id, name: user.name, email: user.email };
}
