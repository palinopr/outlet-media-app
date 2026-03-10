import { NextResponse } from "next/server";
import { WhatsAppSendSchema } from "@/lib/api-schemas";
import { apiError, parseJsonBody, secretGuard } from "@/lib/api-helpers";
import { sendWhatsAppTextMessage } from "@/features/whatsapp/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request: Request) {
  const raw = await parseJsonBody<unknown>(request);
  if (raw instanceof Response) return raw;

  const parsed = WhatsAppSendSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload", details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const secret = request.headers.get("x-ingest-secret") ?? parsed.data.secret;
  const secretError = secretGuard(secret);
  if (secretError) return secretError;

  if (!supabaseAdmin) {
    return apiError("Database not configured. Set SUPABASE_SERVICE_ROLE_KEY.", 503);
  }

  const { secret: _secret, ...input } = parsed.data;

  try {
    const result = await sendWhatsAppTextMessage(input);
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[whatsapp-send] failed:", message);
    return apiError(message, 500);
  }
}
