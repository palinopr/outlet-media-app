import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase";
import { apiError } from "@/lib/api-helpers";

export async function GET(request: Request) {
  const { userId } = await auth();
  if (!userId) return apiError("Unauthorized", 401);
  if (!supabaseAdmin) return apiError("Database not configured", 500);

  const url = new URL(request.url);
  const slug = url.searchParams.get("slug");
  if (!slug) return apiError("Missing slug", 400);

  const { data, error } = await supabaseAdmin
    .from("client_accounts")
    .select("ad_account_id, ad_account_name")
    .eq("clerk_user_id", userId)
    .eq("client_slug", slug)
    .eq("status", "active");

  if (error) return apiError("Failed to fetch accounts", 500);

  return NextResponse.json(data ?? []);
}
