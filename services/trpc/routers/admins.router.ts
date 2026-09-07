import { z } from "zod";
import { createTRPCRouter, permissionProcedure } from "@/lib/trpc/init";
import { createAdminSchema } from "@/types/auth.schema";
import { createFeedbackAdmin } from "@/services/admins/createFeedbackAdmin";
import { listAdmins } from "@/services/admins/listAdmins";
import { deleteAdmin } from "@/services/admins/deleteAdmin";

export const adminsRouter = createTRPCRouter({
  create: permissionProcedure("admins.create")
    .input(createAdminSchema)
    .mutation(({ ctx, input }) => createFeedbackAdmin(ctx.db, input)),

  list: permissionProcedure("admins.view").query(({ ctx }) => listAdmins(ctx.db)),

  delete: permissionProcedure("admins.delete")
    .input(z.object({ userId: z.string().min(1) }))
    .mutation(({ ctx, input }) => deleteAdmin(ctx.db, ctx.user, input.userId)),
});
