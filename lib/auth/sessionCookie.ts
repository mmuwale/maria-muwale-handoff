export const SESSION_COOKIE = "maria_admin_session";

/** 12 hours - short enough to matter for an admin tool, long enough for one sitting. */
export const SESSION_DURATION_MS = 12 * 60 * 60 * 1000;

export const sessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};
