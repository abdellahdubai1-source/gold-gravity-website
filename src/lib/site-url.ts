const DEFAULT_SITE_URL = "https://goldgravityuae.com";

/**
 * Resolves the canonical site origin (no trailing slash) used for
 * metadataBase, canonical/OG URLs, JSON-LD and sitemap/robots
 * generation.
 *
 * NEXT_PUBLIC_SITE_URL is expected in Vercel, but an env var can end up
 * unset, blank, or malformed (e.g. left empty in the dashboard) — in
 * that case `new URL("")` throws and crashes prerendering for every
 * page that reads it. This validates the value first and always
 * returns a safe absolute URL, falling back to the approved production
 * domain rather than ever passing an empty/invalid string to URL().
 */
export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) return DEFAULT_SITE_URL;

  try {
    return new URL(raw).origin;
  } catch {
    console.error(
      `[getSiteUrl] Invalid NEXT_PUBLIC_SITE_URL "${raw}" — falling back to ${DEFAULT_SITE_URL}`
    );
    return DEFAULT_SITE_URL;
  }
}
