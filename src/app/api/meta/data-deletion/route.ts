import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { supabaseAdmin } from "@/lib/supabase";
import { verifySignedRequest } from "@/lib/meta-oauth";
import { enforceContentLength, enforceRateLimit } from "@/lib/request-guards";

export async function POST(request: Request) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const sizeError = enforceContentLength(request, 16 * 1024);
  if (sizeError) return sizeError;

  const rateLimitError = enforceRateLimit(request, {
    limit: 60,
    scope: "meta-data-deletion",
    windowMs: 60_000,
  });
  if (rateLimitError) return rateLimitError;

  let signedRequest: string;
  try {
    const formData = await request.formData();
    signedRequest = formData.get("signed_request") as string;
    if (!signedRequest) throw new Error("Missing signed_request");
  } catch {
    return NextResponse.json(
      { error: "Missing signed_request" },
      { status: 400 },
    );
  }

  let payload: { user_id: string };
  try {
    payload = verifySignedRequest(signedRequest);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
  }

  const confirmationCode = `del_${randomBytes(12).toString("hex")}`;

  if (!supabaseAdmin) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }

  const { error: deleteError } = await supabaseAdmin
    .from("client_accounts")
    .delete()
    .eq("meta_user_id", payload.user_id);

  if (deleteError) {
    console.error("[meta/data-deletion] failed to delete Meta client account data:", deleteError.message);
    return NextResponse.json({ error: "Deletion failed" }, { status: 500 });
  }

  return NextResponse.json({
    url: `${appUrl}/deletion-status/${confirmationCode}`,
    confirmation_code: confirmationCode,
  });
}
