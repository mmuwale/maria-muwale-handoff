"use client";

import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "@/services/trpc/root";

/** The client-side tRPC hooks: trpc.forms.bySlug.useQuery(...), etc. */
export const trpc = createTRPCReact<AppRouter>();
