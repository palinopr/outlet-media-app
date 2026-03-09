import { NextResponse, type NextRequest } from "next/server";
import { authGuard, apiError } from "@/lib/api-helpers";
import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { createClerkSupabaseClient, supabaseAdmin } from "@/lib/supabase";
import type { MentionUser } from "@/lib/workspace-types";

async function getMentionsReadClient(options: { clientSlug: string | null; isAdmin: boolean }) {
  if (!supabaseAdmin) return null;
  if (options.isAdmin || !options.clientSlug) {
    return supabaseAdmin;
  }

  return (await createClerkSupabaseClient()) ?? supabaseAdmin;
}

export async function GET(request: NextRequest) {
  const { userId, error } = await authGuard();
  if (error) return error;

  const q = request.nextUrl.searchParams.get("q") ?? "";
  const clientSlug = request.nextUrl.searchParams.get("client_slug");

  if (!q || q.length < 1) {
    return NextResponse.json({ users: [] });
  }

  const caller = await currentUser();
  const callerRole = (caller?.publicMetadata as { role?: string } | null)?.role;
  const isAdmin = callerRole === "admin";

  if (isAdmin && (!clientSlug || clientSlug === "admin" || !supabaseAdmin)) {
    const clerk = await clerkClient();
    const { data: clerkUsers } = await clerk.users.getUserList({ query: q, limit: 20 });
    const users: MentionUser[] = clerkUsers.map((u) => ({
      id: u.id,
      name: [u.firstName, u.lastName].filter(Boolean).join(" ") || u.username || "Unknown",
      email: u.emailAddresses[0]?.emailAddress ?? "",
      imageUrl: u.imageUrl,
    }));
    return NextResponse.json({ users });
  }

  if (!clientSlug || !supabaseAdmin) {
    return apiError("Client scope required", 403);
  }

  const mentionsDb = await getMentionsReadClient({ clientSlug, isAdmin });
  if (!mentionsDb) {
    return apiError("DB not configured", 500);
  }

  const { data: client } = await mentionsDb
    .from("clients")
    .select("id")
    .eq("slug", clientSlug)
    .single();

  if (!client) {
    return NextResponse.json({ users: [] });
  }

  if (!isAdmin) {
    const { data: membership } = await mentionsDb
      .from("client_members")
      .select("id")
      .eq("client_id", client.id)
      .eq("clerk_user_id", userId)
      .maybeSingle();

    if (!membership) {
      return apiError("Forbidden", 403);
    }
  }

  const clerk = await clerkClient();
  const { data: clerkUsers } = await clerk.users.getUserList({ query: q, limit: 20 });
  const { data: members } = await mentionsDb
    .from("client_members")
    .select("clerk_user_id")
    .eq("client_id", client.id);

  const memberIds = new Set((members ?? []).map((m) => m.clerk_user_id));

  // Also include admins
  const users: MentionUser[] = clerkUsers
    .filter((u) => {
      const role = (u.publicMetadata as { role?: string })?.role;
      return role === "admin" || memberIds.has(u.id);
    })
    .map((u) => ({
      id: u.id,
      name: [u.firstName, u.lastName].filter(Boolean).join(" ") || u.username || "Unknown",
      email: u.emailAddresses[0]?.emailAddress ?? "",
      imageUrl: u.imageUrl,
    }));

  return NextResponse.json({ users });
}
