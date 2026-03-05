import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import { z } from "zod";
import { adminGuard, apiError, parseJsonBody } from "@/lib/api-helpers";
import { supabaseAdmin } from "@/lib/supabase";

// PATCH /api/admin/users/[id]
// Body: { client_slug: string | null }
// Updates a user's publicMetadata.client_slug via Clerk.

const UpdateUserSchema = z.object({
  client_slug: z.string().nullable(),
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

  const raw = await parseJsonBody<unknown>(request);
  if (raw instanceof Response) return raw;
  const parsed = UpdateUserSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

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

  const slug = parsed.data.client_slug;
  const publicMetadata = { ...existingMeta };
  if (slug) {
    publicMetadata.client_slug = slug;
  } else {
    delete publicMetadata.client_slug;
  }

  const updated = await client.users.updateUserMetadata(id, {
    publicMetadata,
  });

  // Sync client_members table
  if (supabaseAdmin) {
    if (slug) {
      const { data: clientRow } = await supabaseAdmin
        .from("clients")
        .select("id")
        .eq("slug", slug)
        .single();

      if (clientRow) {
        await supabaseAdmin
          .from("client_members")
          .upsert(
            { client_id: clientRow.id, clerk_user_id: id, role: "member" },
            { onConflict: "client_id,clerk_user_id" }
          );
      }
    } else {
      // Clearing client_slug -- only remove the membership that matches the old slug
      // (preserves other client memberships for multi-client users)
      const oldSlug = existingMeta.client_slug as string | undefined;
      if (oldSlug) {
        const { data: oldClient } = await supabaseAdmin
          .from("clients")
          .select("id")
          .eq("slug", oldSlug)
          .single();
        if (oldClient) {
          await supabaseAdmin
            .from("client_members")
            .delete()
            .eq("clerk_user_id", id)
            .eq("client_id", oldClient.id);
        }
      }
    }
  }

  return NextResponse.json({ ok: true, user: updated });
}
