import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "@/lib/trpc/init";
import {
  loginSchema,
  changePasswordSchema,
  updateProfileSchema,
  updateLanguageSchema,
} from "@/types/auth.schema";
import { login } from "@/services/auth/login";
import { logout } from "@/services/auth/logout";
import { changePassword } from "@/services/auth/changePassword";
import { updateProfile } from "@/services/auth/updateProfile";
import { updateLanguage } from "@/services/auth/updateLanguage";
import { listMySessions } from "@/services/auth/listMySessions";
import { revokeSession } from "@/services/auth/revokeSession";

export const authRouter = createTRPCRouter({
  login: publicProcedure.input(loginSchema).mutation(({ ctx, input }) => login(ctx.db, input)),

  logout: protectedProcedure.mutation(({ ctx }) => logout(ctx.db)),

  changePassword: protectedProcedure
    .input(changePasswordSchema)
    .mutation(({ ctx, input }) => changePassword(ctx.db, ctx.user, input)),

  updateProfile: protectedProcedure
    .input(updateProfileSchema)
    .mutation(({ ctx, input }) => updateProfile(ctx.db, ctx.user, input)),

  updateLanguage: protectedProcedure
    .input(updateLanguageSchema)
    .mutation(({ ctx, input }) => updateLanguage(ctx.db, ctx.user, input)),

  mySessions: protectedProcedure.query(({ ctx }) => listMySessions(ctx.db, ctx.user)),

  revokeSession: protectedProcedure
    .input(z.object({ sessionId: z.string().min(1) }))
    .mutation(({ ctx, input }) => revokeSession(ctx.db, ctx.user, input.sessionId)),

  me: publicProcedure.query(({ ctx }) => {
    if (!ctx.user) return null;
    return {
      id: ctx.user.id,
      name: ctx.user.name,
      email: ctx.user.email,
      permissions: Array.from(ctx.user.permissions),
    };
  }),
});
