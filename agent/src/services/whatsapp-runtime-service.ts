interface SendWhatsAppMessageInput {
  approved?: boolean;
  body: string;
  conversationId?: string;
  phoneNumberId?: string;
  replyToMessageId?: string;
  toWaId?: string;
}

interface SendWhatsAppMessageResult {
  conversationId: string | null;
  messageId: string;
  ok: boolean;
}

function getOutletBaseUrl(): string {
  const ingestUrl = process.env.INGEST_URL?.trim();
  if (ingestUrl) {
    return ingestUrl.replace(/\/api\/ingest\/?$/, "");
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (appUrl) {
    return appUrl.replace(/\/$/, "");
  }

  throw new Error("INGEST_URL or NEXT_PUBLIC_APP_URL is required for WhatsApp runtime sends.");
}

export async function sendWhatsAppMessage(
  input: SendWhatsAppMessageInput,
): Promise<SendWhatsAppMessageResult> {
  const secret = process.env.INGEST_SECRET;
  if (!secret) {
    throw new Error("INGEST_SECRET is required for WhatsApp runtime sends.");
  }

  const response = await fetch(`${getOutletBaseUrl()}/api/whatsapp/send`, {
    body: JSON.stringify({
      ...input,
      secret,
    }),
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  const payload = (await response.json().catch(() => null)) as
    | {
        conversationId?: string | null;
        error?: string;
        messageId?: string;
        ok?: boolean;
      }
    | null;

  if (!response.ok || !payload?.ok || !payload.messageId) {
    throw new Error(payload?.error ?? `WhatsApp send API failed (${response.status})`);
  }

  return {
    conversationId: payload.conversationId ?? null,
    messageId: payload.messageId,
    ok: true,
  };
}
