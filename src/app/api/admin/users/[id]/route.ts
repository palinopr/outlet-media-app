import { NextResponse } from "next/server";
import { z } from "zod";
import { adminGuard, apiError, validateRequest } from "@/lib/api-helpers";
import { supabaseAdmin } from "@/lib/supabase";

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

  const { data: clientRow } = await supabaseAdmin
    .from("clients")
    .select("id, slug")
    .eq("id", clientId)
    .maybeSingle();

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

  const { data: remaining } = await supabaseAdmin
    .from("client_members")
    .select("clients(slug)")
    .eq("clerk_user_id", id);

  const remainingSlugs = (remaining ?? [])
    .map((r) => (r.clients as unknown as { slug: string })?.slug)
    .filter(Boolean);

  return NextResponse.json({ ok: true, client_slugs: remainingSlugs });
}
