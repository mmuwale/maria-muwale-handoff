import { initTRPC, TRPCError } from "@trpc/server";
import { ZodError } from "zod";
import superjson from "superjson";
import { db } from "@/lib/db/client";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";

/** Per-request context. Every procedure gets the db handle and the verified
 *  session user (or null) through here - never a bare import of either. */
export async function createTRPCContext() {
  const user = await getCurrentUser();
  return { db, user };
}

type Context = Awaited<ReturnType<typeof createTRPCContext>>;

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    // Without this, a failed input validation surfaces its raw Zod issues
    // array (stringified) as the client-facing error message. Use the
    // first issue's own message instead, so the UI can show it directly.
    if (error.cause instanceof ZodError) {
      return { ...shape, message: error.cause.issues[0]?.message ?? shape.message };
    }
    return shape;
  },
});

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;

/** No session required - the public feedback submission surface lives here. */
export const publicProcedure = t.procedure;

/** Requires a verified admin session. Narrows ctx.user to non-null. */
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({ ctx: { ...ctx, user: ctx.user } });
});

/**
 * Requires a verified session AND a specific permission. This is the only
 * gate that matters for admin data access - never trust a hidden UI button,
 * every procedure that reads or writes admin data checks its own permission
 * here, independent of what the client happened to render.
 */
export function permissionProcedure(permission: string) {
  return protectedProcedure.use(({ ctx, next }) => {
    if (!ctx.user.permissions.has(permission)) {
      throw new TRPCError({ code: "FORBIDDEN" });
    }
    return next({ ctx });
  });
}
