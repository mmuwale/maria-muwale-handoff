/**
 * NEXT_PUBLIC_SITE_URL is set explicitly for production, but if it's ever
 * missing (as it was on Vercel until this fix - an invite email went out
 * with a literal "http://undefined/..." link) this must never silently
 * produce a broken URL. VERCEL_URL is set automatically by Vercel on every
 * deployment, including previews, so it's a real fallback, not just a
 * localhost stopgap.
 */
export function getSiteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}
