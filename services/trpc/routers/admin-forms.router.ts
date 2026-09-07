import { z } from "zod";
import { createTRPCRouter, permissionProcedure } from "@/lib/trpc/init";
import { createFormSchema } from "@/types/feedback.schema";
import { createForm } from "@/services/forms/createForm";
import { listFormsForUser } from "@/services/forms/listFormsForUser";
import { getFormWithResponses } from "@/services/forms/getFormWithResponses";
import { publishForm } from "@/services/forms/publishForm";
import { closeForm } from "@/services/forms/closeForm";

export const adminFormsRouter = createTRPCRouter({
  create: permissionProcedure("forms.create")
    .input(createFormSchema)
    .mutation(({ ctx, input }) => createForm(ctx.db, input, ctx.user.id)),

  list: permissionProcedure("forms.view").query(({ ctx }) => listFormsForUser(ctx.db, ctx.user)),

  getWithResponses: permissionProcedure("feedback.view")
    .input(z.object({ formId: z.string().min(1) }))
    .query(({ ctx, input }) => getFormWithResponses(ctx.db, input.formId, ctx.user)),

  publish: permissionProcedure("forms.publish")
    .input(z.object({ formId: z.string().min(1) }))
    .mutation(({ ctx, input }) => publishForm(ctx.db, input.formId, ctx.user)),

  close: permissionProcedure("forms.publish")
    .input(z.object({ formId: z.string().min(1) }))
    .mutation(({ ctx, input }) => closeForm(ctx.db, input.formId, ctx.user)),
});
