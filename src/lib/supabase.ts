import { cache } from "react";
import { auth, currentUser } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

const getCachedUser = cache(() => currentUser());

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
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

export async function createClerkSupabaseClient() {
  if (!url || !anonKey) return null;

  try {
    const { userId } = await auth();
    if (!userId) return null;

    return createClient(url, anonKey, {
      accessToken: async () => {
        const { getToken } = await auth();
        return getToken();
      },
      auth: {
        autoRefreshToken: false,
        detectSessionInUrl: false,
        persistSession: false,
      },
    });
  } catch {
    return null;
  }
}

/**
 * Returns a Supabase client appropriate for reading feature data.
 *
 * When `useClientScope` is true (client-facing request with a known slug),
 * the function attempts to return a Clerk-scoped client so Supabase RLS
 * policies are enforced for the current user. Admins and server-side
 * callers bypass scoping and get the service-role client.
 *
 * Keep feature reads on this shared helper so admin and client access behavior
 * stays consistent across the narrowed Campaigns/account-access baseline.
 */
export async function getFeatureReadClient(useClientScope: boolean) {
  if (!supabaseAdmin) return null;
  if (!useClientScope) return supabaseAdmin;

  try {
    const user = await getCachedUser();
    const role = (user?.publicMetadata as { role?: string } | null)?.role;
    if (role === "admin") {
      return supabaseAdmin;
    }
  } catch {
    // Never fall back to service-role for non-admin users — deny access.
    return null;
  }

  // Return the Clerk-scoped client with RLS, or null if unavailable.
  // Never fall back to supabaseAdmin for non-admin users.
  return await createClerkSupabaseClient();
}
