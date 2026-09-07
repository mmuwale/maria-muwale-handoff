import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

/**
 * Turso connections from this network occasionally fail outright before a
 * response ever comes back - Node's fetch throws `TypeError: fetch failed`
 * (wrapping an ETIMEDOUT/ENETUNREACH AggregateError from IPv4/IPv6
 * happy-eyeballs both failing). Not a Turso outage - a plain retry a moment
 * later has always succeeded when this has been observed. A request that
 * reached the server and got a real HTTP response, even an error one, isn't
 * touched here - only a fetch() that never came back at all.
 */
async function fetchWithRetry(...args: Parameters<typeof fetch>): Promise<Response> {
  const attempts = 3;
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      return await fetch(...args);
    } catch (err) {
      const isNetworkFailure = err instanceof TypeError && err.message === "fetch failed";
      if (!isNetworkFailure || attempt === attempts) throw err;
      await new Promise((resolve) => setTimeout(resolve, attempt * 300));
    }
  }
  throw new Error("unreachable");
}

/**
 * One driver for both environments: a `file:` URL for local dev (a plain
 * SQLite file on disk, no account needed), a `libsql://...` URL + auth
 * token for Turso in production. This is why the switch away from
 * better-sqlite3 was necessary in the first place - Vercel's serverless
 * functions don't have a persistent local filesystem, so a bundled SQLite
 * file can't survive between requests there.
 */
const client = createClient({
  url: process.env.DATABASE_URL ?? "file:./drizzle/maria-app.db",
  authToken: process.env.DATABASE_AUTH_TOKEN,
  fetch: fetchWithRetry,
});

// SQLite disables foreign key enforcement per-connection by default. Not
// awaited deliberately - this file can't use top-level await (tsx's CJS
// transform for the seed script rejects it), and libsql queues commands on
// a single connection in call order, so every later query still runs after
// this one lands.
void client.execute("PRAGMA foreign_keys = ON");

export const db = drizzle(client, { schema });
