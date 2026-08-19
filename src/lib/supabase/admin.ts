import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Service-role Supabase client. BYPASSES Row Level Security.
 * Server-only — never import this from a Client Component, and never
 * expose SUPABASE_SERVICE_ROLE_KEY to the browser.
 *
 * Used for: the seed script, and admin server actions that need to
 * manage storage objects or perform operations RLS intentionally
 * restricts (e.g. deleting other users' uploaded files).
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables."
    );
  }

  return createSupabaseClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
