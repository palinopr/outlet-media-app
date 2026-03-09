import { NextResponse } from "next/server";
import { apiError } from "@/lib/api-helpers";
import {
  ingestEvolutionWebhook,
  verifyEvolutionWebhookRequest,
  type EvolutionWebhookPayload,
} from "@/features/whatsapp/server";
import { supabaseAdmin } from "@/lib/supabase";

function forbidden() {
  return apiError("Unauthorized", 401);
}

export async function POST(request: Request) {
  if (!supabaseAdmin) {
    return apiError("Database not configured. Set SUPABASE_SERVICE_ROLE_KEY.", 503);
  }

  let payload: EvolutionWebhookPayload;
  try {
    payload = (await request.json()) as EvolutionWebhookPayload;
  } catch {
    return apiError("Malformed JSON body", 400);
  }

  if (!verifyEvolutionWebhookRequest(request.headers, payload)) {
    return forbidden();
  }

  try {
    const result = await ingestEvolutionWebhook(payload);
    return NextResponse.json({
      ok: true,
      processed_messages: result.processedMessages,
      processed_statuses: result.processedStatuses,
      queued_tasks: result.taskIds,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const stack = error instanceof Error ? error.stack ?? null : null;
    console.error("[whatsapp-evolution-webhook] ingest failed:", message);
    if (stack) {
      console.error(stack);
    }
    return apiError(message, 500);
  }
}
