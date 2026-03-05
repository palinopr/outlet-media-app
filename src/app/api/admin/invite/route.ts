import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import { InviteSchema } from "@/lib/api-schemas";
import { adminGuard, validateRequest } from "@/lib/api-helpers";
import { supabaseAdmin } from "@/lib/supabase";

// POST /api/admin/invite
// Body: { email: string, client_slug?: string, role?: "admin" }
// Sends a Clerk invitation email. When the user signs up they get
// the metadata pre-applied (client_slug or role).

export async function POST(request: Request) {
  const adminErr = await adminGuard();
  if (adminErr) return adminErr;

  const { data: body, error: valErr } = await validateRequest(request, InviteSchema);
  if (valErr) return valErr;

  // Validate client_slug exists in clients table
  if (body.client_slug && supabaseAdmin) {
    const { data: clientRow } = await supabaseAdmin
      .from("clients")
      .select("id")
      .eq("slug", body.client_slug)
      .single();

    if (!clientRow) {
      return NextResponse.json({ error: "Client not found" }, { status: 400 });
    }
  }

  const publicMetadata: Record<string, string> = {};
  if (body.client_slug) publicMetadata.client_slug = body.client_slug;
  if (body.client_role) publicMetadata.client_role = body.client_role;
  if (body.role) publicMetadata.role = body.role;

  try {
    const client = await clerkClient();
    await client.invitations.createInvitation({
      emailAddress: body.email,
      publicMetadata,
      ignoreExisting: true,
    });
  } catch (err: unknown) {
    // Clerk errors carry an `errors` array with detailed messages
    const clerkErr = err as { errors?: { message: string }[]; message?: string; status?: number };
    const detail = clerkErr.errors?.[0]?.message ?? clerkErr.message ?? "Failed to create invitation";
    const status = clerkErr.status ?? 500;
    return NextResponse.json({ error: detail }, { status });
  }

  return NextResponse.json({ ok: true });
}
