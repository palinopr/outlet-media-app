import { NextResponse } from "next/server";
import { apiError } from "@/lib/api-helpers";
import {
  ingestWhatsAppWebhook,
  verifyWhatsAppWebhookSignature,
  type WhatsAppWebhookPayload,
} from "@/features/whatsapp/server";
import { supabaseAdmin } from "@/lib/supabase";

function forbidden() {
  return apiError("Unauthorized", 401);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("hub.mode");
  const verifyToken = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");
  const expectedVerifyToken = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN;

  if (!expectedVerifyToken) {
    return apiError("WHATSAPP_WEBHOOK_VERIFY_TOKEN is not configured.", 503);
  }

  if (mode === "subscribe" && verifyToken === expectedVerifyToken && challenge) {
    return new NextResponse(challenge, { status: 200 });
  }

  return forbidden();
}

export async function POST(request: Request) {
  if (!supabaseAdmin) {
    return apiError("Database not configured. Set SUPABASE_SERVICE_ROLE_KEY.", 503);
  }

  const rawBody = await request.text();
  if (!verifyWhatsAppWebhookSignature(rawBody, request.headers.get("x-hub-signature-256"))) {
    return forbidden();
  }

  let payload: WhatsAppWebhookPayload;
  try {
    payload = JSON.parse(rawBody) as WhatsAppWebhookPayload;
  } catch {
    return apiError("Malformed JSON body", 400);
  }

  try {
    const result = await ingestWhatsAppWebhook(payload);
    return NextResponse.json({
      ok: true,
      processed_messages: result.processedMessages,
      processed_statuses: result.processedStatuses,
      queued_tasks: result.taskIds,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[whatsapp-webhook] ingest failed:", message);
    return apiError(message, 500);
  }
}
