import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Public, anonymous Supabase client for server-side reads of published
 * content (site settings, pages, categories, brands, products, sitemap
 * data). Unlike `@/lib/supabase/server`, this does NOT call
 * cookies()/headers(), so routes that only use this client are not
 * forced into dynamic rendering — they remain eligible for static
 * generation (home, sitemap.xml, etc.).
 *
 * Subject to Row Level Security via the anon key, same as the browser
 * client — never use this for admin/authenticated reads or mutations.
 */
export function createPublicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables."
    );
  }

  return createSupabaseClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
