import { NextResponse } from "next/server";
import { z } from "zod";
import { adminGuard, apiError, validateRequest } from "@/lib/api-helpers";
import { enforceContentLength } from "@/lib/request-guards";
import { supabaseAdmin } from "@/lib/supabase";
import { logAudit } from "@/app/admin/actions/audit";

// PATCH /api/admin/users/[id]
// Body: { action: "add" | "remove", clientId: string }
// Adds or removes a client membership for a user.

const UpdateUserSchema = z.object({
  action: z.enum(["add", "remove"]),
  clientId: z.string().min(1),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const sizeError = enforceContentLength(request, 8 * 1024);
  if (sizeError) return sizeError;

  const adminErr = await adminGuard();
  if (adminErr) return adminErr;

  const { id: rawId } = await params;
  const id = rawId.replace(/[^a-zA-Z0-9_-]/g, "");
  if (!id) {
    return apiError("Invalid user ID", 400);
  }

  const { data, error: valErr } = await validateRequest(request, UpdateUserSchema);
  if (valErr) return valErr;

  const { action, clientId } = data;

  if (!supabaseAdmin) {
    return apiError("Database not configured", 500);
  }

  const { data: clientRow, error: clientError } = await supabaseAdmin
    .from("clients")
    .select("id, slug")
    .eq("id", clientId)
    .maybeSingle();

  if (clientError) {
    return apiError("Failed to load client", 500);
  }

  if (!clientRow) {
    return apiError("Client not found", 404);
  }

  if (action === "add") {
    const { data: existingMembership, error: existingMembershipError } = await supabaseAdmin
      .from("client_members")
      .select("id")
      .eq("client_id", clientRow.id)
      .eq("clerk_user_id", id)
      .maybeSingle();

    if (existingMembershipError) {
      return apiError("Failed to load existing client membership", 500);
    }

    if (!existingMembership) {
      const { error: insertError } = await supabaseAdmin
        .from("client_members")
        .insert({ client_id: clientRow.id, clerk_user_id: id, role: "member" });

      if (insertError) {
        return apiError("Failed to add client membership", 500);
      }

      await logAudit("client_member", id, "add_client_access", null, {
        client_id: clientRow.id,
        client_slug: clientRow.slug,
        role: "member",
      });
    }
  } else {
    const { error: deleteError } = await supabaseAdmin
      .from("client_members")
      .delete()
      .eq("clerk_user_id", id)
      .eq("client_id", clientRow.id);

    if (deleteError) {
      return apiError("Failed to remove client membership", 500);
    }

    await logAudit("client_member", id, "remove_client_access", {
      client_id: clientRow.id,
      client_slug: clientRow.slug,
    }, null);
  }

  const { data: remaining, error: remainingError } = await supabaseAdmin
    .from("client_members")
    .select("clients(slug)")
    .eq("clerk_user_id", id);

  if (remainingError) {
    return apiError("Failed to load remaining client memberships", 500);
  }

  const remainingSlugs = (remaining ?? [])
    .map((r) => (r.clients as unknown as { slug: string })?.slug)
    .filter(Boolean);

  return NextResponse.json({ ok: true, client_slugs: remainingSlugs });
}
