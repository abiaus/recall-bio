import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Creates an admin client with SERVICE_ROLE key.
 * 
 * **WARNING**: This client bypasses RLS policies entirely.
 * Use only in trusted server contexts (Cron, Webhooks, etc.) 
 * where you explicitly need admin privileges or when handling inbound
 * events that are not tied to a living user session.
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error(
      "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables."
    );
  }

  return createSupabaseClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
