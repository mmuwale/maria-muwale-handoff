import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/lib/trpc/init";
import { getPublishedFormBySlug } from "@/services/forms/getPublishedFormBySlug";

export const formsRouter = createTRPCRouter({
  bySlug: publicProcedure
    .input(z.object({ slug: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      return getPublishedFormBySlug(ctx.db, input.slug);
    }),
});
