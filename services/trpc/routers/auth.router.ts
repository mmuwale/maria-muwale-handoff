import { createTRPCRouter, publicProcedure, protectedProcedure } from "@/lib/trpc/init";
import { loginSchema, changePasswordSchema } from "@/types/auth.schema";
import { login } from "@/services/auth/login";
import { logout } from "@/services/auth/logout";
import { changePassword } from "@/services/auth/changePassword";

export const authRouter = createTRPCRouter({
  login: publicProcedure.input(loginSchema).mutation(({ ctx, input }) => login(ctx.db, input)),

  logout: protectedProcedure.mutation(({ ctx }) => logout(ctx.db)),

  changePassword: protectedProcedure
    .input(changePasswordSchema)
    .mutation(({ ctx, input }) => changePassword(ctx.db, ctx.user, input)),

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
