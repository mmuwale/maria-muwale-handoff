import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

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
});

// SQLite disables foreign key enforcement per-connection by default. Not
// awaited deliberately - this file can't use top-level await (tsx's CJS
// transform for the seed script rejects it), and libsql queues commands on
// a single connection in call order, so every later query still runs after
// this one lands.
void client.execute("PRAGMA foreign_keys = ON");

export const db = drizzle(client, { schema });
