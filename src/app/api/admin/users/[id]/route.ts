import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import { z } from "zod";
import { adminGuard, apiError, validateRequest } from "@/lib/api-helpers";
import { supabaseAdmin } from "@/lib/supabase";

// PATCH /api/admin/users/[id]
// Body: { action: "add" | "remove", client_slug: string }
// Adds or removes a client membership for a user.

const UpdateUserSchema = z.object({
  action: z.enum(["add", "remove"]),
  client_slug: z.string().min(1),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminErr = await adminGuard();
  if (adminErr) return adminErr;

  const { id: rawId } = await params;
  const id = rawId.replace(/[^a-zA-Z0-9_-]/g, "");
  if (!id) {
    return apiError("Invalid user ID", 400);
  }

  const { data, error: valErr } = await validateRequest(request, UpdateUserSchema);
  if (valErr) return valErr;

  const client = await clerkClient();

  let existingMeta: Record<string, unknown>;
  try {
    const user = await client.users.getUser(id);
    existingMeta =
      typeof user.publicMetadata === "object" && user.publicMetadata !== null
        ? (user.publicMetadata as Record<string, unknown>)
        : {};
  } catch {
    return apiError("User not found", 404);
  }

  const { action, client_slug: slug } = data;

  if (!supabaseAdmin) {
    return apiError("Database not configured", 500);
  }

  // Look up client by slug
  const { data: clientRow } = await supabaseAdmin
    .from("clients")
    .select("id")
    .eq("slug", slug)
    .single();

  if (!clientRow) {
    return apiError("Client not found", 404);
  }

  if (action === "add") {
    await supabaseAdmin
      .from("client_members")
      .upsert(
        { client_id: clientRow.id, clerk_user_id: id, role: "member" },
        { onConflict: "client_id,clerk_user_id" }
      );
  } else {
    await supabaseAdmin
      .from("client_members")
      .delete()
      .eq("clerk_user_id", id)
      .eq("client_id", clientRow.id);
  }

  // Sync publicMetadata.client_slug to first remaining membership (legacy compat)
  const { data: remaining } = await supabaseAdmin
    .from("client_members")
    .select("clients(slug)")
    .eq("clerk_user_id", id);

  const remainingSlugs = (remaining ?? [])
    .map((r) => (r.clients as unknown as { slug: string })?.slug)
    .filter(Boolean);

  const publicMetadata = { ...existingMeta };
  if (remainingSlugs.length > 0) {
    publicMetadata.client_slug = remainingSlugs[0];
  } else {
    delete publicMetadata.client_slug;
  }

  await client.users.updateUserMetadata(id, { publicMetadata });

  return NextResponse.json({ ok: true, client_slugs: remainingSlugs });
}
