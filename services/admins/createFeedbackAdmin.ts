import { randomBytes, randomUUID } from "node:crypto";
import type { db as Db } from "@/lib/db/client";
import { users, roles, userRoles, invites } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { hashPassword } from "@/lib/auth/hashPassword";
import { sendInviteEmail } from "@/lib/email/sendInviteEmail";
import { getSiteUrl } from "@/lib/env/getSiteUrl";
import type { CreateAdminInput } from "@/types/auth.schema";

const INVITE_DURATION_MS = 48 * 60 * 60 * 1000;

/** Only super_admin can reach this (enforced at the router). Creates a new
 *  feedback_admin account with no password anyone knows - an emailed invite
 *  link is the only way in, which doubles as verifying the email address. */
export async function createFeedbackAdmin(db: typeof Db, input: CreateAdminInput) {
  const existing = await db.query.users.findFirst({ where: eq(users.email, input.email) });
  if (existing) {
    throw new TRPCError({ code: "CONFLICT", message: "That email is already in use." });
  }

  const role = await db.query.roles.findFirst({ where: eq(roles.name, "feedback_admin") });
  if (!role) {
    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "feedback_admin role is not seeded." });
  }

  const placeholderHash = await hashPassword(randomUUID());
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + INVITE_DURATION_MS);

  const admin = await db.transaction(async (tx) => {
    const [user] = await tx
      .insert(users)
      .values({ name: input.name, email: input.email, passwordHash: placeholderHash })
      .returning();

    await tx.insert(userRoles).values({ userId: user.id, roleId: role.id });
    await tx.insert(invites).values({ userId: user.id, token, expiresAt });

    return { id: user.id, name: user.name, email: user.email };
  });

  // The account exists either way - if the email fails to send, the caller
  // can see that and offer a resend rather than losing the created admin.
  // The link itself is always returned so the inviter can copy/share it
  // directly, regardless of whether the email went out.
  let emailSent = true;
  try {
    await sendInviteEmail({ to: admin.email, name: admin.name, token });
  } catch (err) {
    console.error(`Invite email to ${admin.email} failed:`, err);
    emailSent = false;
  }

  const inviteUrl = `${getSiteUrl()}/admin/invite/${token}`;

  return { ...admin, emailSent, inviteUrl };
}
