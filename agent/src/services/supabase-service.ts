import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let supabase: SupabaseClient | null | undefined;

export function getServiceSupabase(): SupabaseClient | null {
  if (supabase !== undefined) {
    return supabase;
  }

  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  supabase = url && key ? createClient(url, key) : null;
  return supabase;
}
