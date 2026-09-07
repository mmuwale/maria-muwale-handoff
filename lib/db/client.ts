import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

/**
 * Turso connections occasionally fail outright before a response ever comes
 * back - both locally (Node's fetch throws `TypeError: fetch failed`,
 * wrapping an ETIMEDOUT/ENETUNREACH AggregateError from IPv4/IPv6
 * happy-eyeballs both failing) and, it turns out, from Vercel's serverless
 * runtime too (same underlying undici, but a cold start can surface the
 * failure as a bare AggregateError/connection error instead of always
 * wrapped in that exact TypeError). Not a Turso outage - a retry a moment
 * later has always succeeded when this has been observed. A request that
 * reached the server and got a real HTTP response, even an error one, isn't
 * touched here - only a fetch() that never came back at all.
 */
function isNetworkFailure(err: unknown): boolean {
  if (err instanceof TypeError && err.message === "fetch failed") return true;
  if (typeof AggregateError !== "undefined" && err instanceof AggregateError) return true;
  const code = (err as { cause?: { code?: string }; code?: string })?.cause?.code ?? (err as { code?: string })?.code;
  return typeof code === "string" && /^E(TIMEDOUT|CONNRESET|CONNREFUSED|NETUNREACH|AI_AGAIN)$/.test(code);
}

const ATTEMPT_TIMEOUT_MS = 6000;

/**
 * A dead connection attempt (ETIMEDOUT) can take the OS's default TCP
 * connect timeout - tens of seconds - to actually reject, which would make
 * "retry a few times" itself hang for ages before ever getting to try
 * again. Race every attempt against its own short timeout so a stuck
 * attempt fails fast and retries promptly instead.
 */
function withAttemptTimeout(init: RequestInit | undefined): RequestInit {
  const timeoutSignal = AbortSignal.timeout(ATTEMPT_TIMEOUT_MS);
  const signal = init?.signal ? AbortSignal.any([init.signal, timeoutSignal]) : timeoutSignal;
  return { ...init, signal };
}

async function fetchWithRetry(input: Parameters<typeof fetch>[0], init?: RequestInit): Promise<Response> {
  const attempts = 5;
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      // libsql's http client passes a Request object (with a body) for
      // POSTs, not a plain URL. A Request's body can only be read once -
      // retrying with the same (now-consumed) object throws "Cannot
      // construct a Request with a Request object that has already been
      // used." Clone it fresh for every attempt instead; the original is
      // never itself passed to fetch, so it stays clonable throughout.
      const attemptInput = input instanceof Request ? input.clone() : input;
      return await fetch(attemptInput, withAttemptTimeout(init));
    } catch (err) {
      const timedOut = err instanceof DOMException && err.name === "TimeoutError";
      if ((!timedOut && !isNetworkFailure(err)) || attempt === attempts) throw err;
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
