import { createTRPCRouter, createCallerFactory } from "@/lib/trpc/init";
import { formsRouter } from "./routers/forms.router";
import { responsesRouter } from "./routers/responses.router";
import { authRouter } from "./routers/auth.router";
import { adminFormsRouter } from "./routers/admin-forms.router";
import { adminsRouter } from "./routers/admins.router";

export const appRouter = createTRPCRouter({
  forms: formsRouter,
  responses: responsesRouter,
  auth: authRouter,
  adminForms: adminFormsRouter,
  admins: adminsRouter,
});

export type AppRouter = typeof appRouter;

/** For Server Components: call procedures directly, no HTTP round trip. */
export const createCaller = createCallerFactory(appRouter);
