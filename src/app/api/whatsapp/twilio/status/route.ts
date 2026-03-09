import { NextResponse } from "next/server";
import { apiError } from "@/lib/api-helpers";
import { ingestTwilioWebhook, verifyTwilioWebhookSignature } from "@/features/whatsapp/server";
import { supabaseAdmin } from "@/lib/supabase";

function forbidden() {
  return apiError("Unauthorized", 401);
}

export async function POST(request: Request) {
  if (!supabaseAdmin) {
    return apiError("Database not configured. Set SUPABASE_SERVICE_ROLE_KEY.", 503);
  }

  const rawBody = await request.text();
  const params = new URLSearchParams(rawBody);
  if (!verifyTwilioWebhookSignature(request.url, params, request.headers.get("x-twilio-signature"))) {
    return forbidden();
  }

  try {
    await ingestTwilioWebhook(params);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[whatsapp-twilio-status-webhook] ingest failed:", message);
    return apiError(message, 500);
  }
}
