import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url) {
  console.warn("Supabase env vars not set - database features will be unavailable");
}

// Client for server components and API routes (uses service role key for writes).
// No Database generic here - Supabase v2 resolves Insert types as `never` when
// the generic is applied to the admin client with circular Omit definitions.
// Payloads are typed explicitly at each call site.
export const supabaseAdmin = url && serviceKey
  ? createClient(url, serviceKey)
  : null;
