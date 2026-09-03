import type { db as Db } from "@/lib/db/client";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { verifyPassword } from "@/lib/auth/verifyPassword";
import { createSession } from "@/lib/auth/createSession";
import type { LoginInput } from "@/types/auth.schema";

const INVALID_CREDENTIALS = new TRPCError({
  code: "UNAUTHORIZED",
  message: "Invalid email or password.",
});

export async function login(db: typeof Db, input: LoginInput) {
  const user = await db.query.users.findFirst({ where: eq(users.email, input.email) });
  if (!user || !user.isActive) throw INVALID_CREDENTIALS;

  const valid = await verifyPassword(input.password, user.passwordHash);
  if (!valid) throw INVALID_CREDENTIALS;

  await createSession(db, user.id);

  return { id: user.id, name: user.name, email: user.email };
}
