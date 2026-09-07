import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/lib/trpc/init";
import { getPublishedFormBySlug } from "@/services/forms/getPublishedFormBySlug";
import { listPublishedForms } from "@/services/forms/listPublishedForms";

export const formsRouter = createTRPCRouter({
  bySlug: publicProcedure
    .input(z.object({ slug: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      return getPublishedFormBySlug(ctx.db, input.slug);
    }),

  listPublished: publicProcedure.query(({ ctx }) => listPublishedForms(ctx.db)),
});
