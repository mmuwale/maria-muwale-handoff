import { createCaller } from "@/services/trpc/root";
import { createTRPCContext } from "@/lib/trpc/init";

/** Use inside Server Components / generateMetadata to call routers with zero HTTP overhead. */
export async function getServerCaller() {
  return createCaller(await createTRPCContext());
}
