import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !anonKey) {
  // Warn at runtime rather than crash at module load, so build still works
  console.warn("Supabase env vars not set - database features will be unavailable");
}

// Client for server components and API routes (uses service role key for writes).
// No Database generic here - Supabase v2 resolves Insert types as `never` when
// the generic is applied to the admin client with circular Omit definitions.
// Payloads are typed explicitly at each call site.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const supabaseAdmin = url && serviceKey
  ? createClient(url, serviceKey)
  : null;

// Client for client components (uses anon key, respects RLS)
export const supabase = url && anonKey
  ? createClient<Database>(url, anonKey)
  : null;
