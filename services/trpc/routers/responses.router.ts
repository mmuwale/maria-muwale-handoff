import { createTRPCRouter, publicProcedure } from "@/lib/trpc/init";
import { submitResponseSchema } from "@/types/feedback.schema";
import { submitFormResponse } from "@/services/responses/submitFormResponse";

export const responsesRouter = createTRPCRouter({
  submit: publicProcedure
    .input(submitResponseSchema)
    .mutation(async ({ ctx, input }) => {
      const response = await submitFormResponse(ctx.db, input);
      return { id: response.id };
    }),
});
