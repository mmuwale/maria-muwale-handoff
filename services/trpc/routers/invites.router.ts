import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/lib/trpc/init";
import { acceptInviteSchema } from "@/types/auth.schema";
import { getInviteByToken } from "@/services/auth/getInviteByToken";
import { acceptInvite } from "@/services/auth/acceptInvite";

export const invitesRouter = createTRPCRouter({
  byToken: publicProcedure
    .input(z.object({ token: z.string().min(1) }))
    .query(({ ctx, input }) => getInviteByToken(ctx.db, input.token)),

  accept: publicProcedure
    .input(acceptInviteSchema)
    .mutation(({ ctx, input }) => acceptInvite(ctx.db, input)),
});
