import { NextResponse, type NextRequest } from "next/server";
import { authGuard, apiError } from "@/lib/api-helpers";
import { clerkClient } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase";
import type { MentionUser } from "@/lib/workspace-types";

export async function GET(request: NextRequest) {
  const { error } = await authGuard();
  if (error) return error;

  const q = request.nextUrl.searchParams.get("q") ?? "";
  const clientSlug = request.nextUrl.searchParams.get("client_slug");

  if (!q || q.length < 1) {
    return NextResponse.json({ users: [] });
  }

  const clerk = await clerkClient();
  const { data: clerkUsers } = await clerk.users.getUserList({ query: q, limit: 20 });

  if (!clientSlug || !supabaseAdmin) {
    const users: MentionUser[] = clerkUsers.map((u) => ({
      id: u.id,
      name: [u.firstName, u.lastName].filter(Boolean).join(" ") || u.username || "Unknown",
      email: u.emailAddresses[0]?.emailAddress ?? "",
      imageUrl: u.imageUrl,
    }));
    return NextResponse.json({ users });
  }

  // Filter to users who are members of this client
  const { data: client } = await supabaseAdmin
    .from("clients")
    .select("id")
    .eq("slug", clientSlug)
    .single();

  if (!client) {
    return NextResponse.json({ users: [] });
  }

  const { data: members } = await supabaseAdmin
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
