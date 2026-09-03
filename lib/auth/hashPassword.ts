import { randomBytes, scrypt as scryptCallback } from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(scryptCallback);
const KEY_LENGTH = 64;

/**
 * scrypt via node:crypto, not Bun.password - `bun run` executes scripts and
 * the Next.js server process itself under Node under the hood (tsx, `next
 * start`), so a Bun-only global isn't reliably present at runtime even in a
 * Bun-managed project. node:crypto is implemented identically by both.
 */
export async function hashPassword(plain: string) {
  const salt = randomBytes(16).toString("hex");
  const derived = (await scrypt(plain, salt, KEY_LENGTH)) as Buffer;
  return `${salt}:${derived.toString("hex")}`;
}
