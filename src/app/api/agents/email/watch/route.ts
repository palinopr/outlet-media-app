import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

function unauthorized() {
  return NextResponse.json({ ok: false }, { status: 401 });
}

export async function POST(request: Request) {
  const expectedSecret = process.env.GMAIL_PUSH_WEBHOOK_SECRET;
  const url = new URL(request.url);
  const secret = url.searchParams.get("secret");

  if (!expectedSecret || secret !== expectedSecret) {
    return unauthorized();
  }

  if (!supabaseAdmin) {
    return NextResponse.json({ ok: false }, { status: 503 });
  }

  const body = await request.json().catch(() => null) as
    | {
        message?: {
          data?: string;
          messageId?: string;
          publishTime?: string;
        };
      }
    | null;

  const encoded = body?.message?.data;
  if (!encoded) {
    return NextResponse.json({ ok: true, ignored: true });
  }

  let payload: { emailAddress?: string; historyId?: string | number } | null = null;
  try {
    payload = JSON.parse(Buffer.from(encoded, "base64").toString("utf-8")) as {
      emailAddress?: string;
      historyId?: string | number;
    };
  } catch {
    return NextResponse.json({ ok: true, ignored: true });
  }

  const historyId = payload?.historyId != null ? String(payload.historyId) : null;
  if (!historyId) {
    return NextResponse.json({ ok: true, ignored: true });
  }

  const taskId = `gmail_${body?.message?.messageId ?? historyId}`;
  const { error } = await supabaseAdmin
    .from("agent_tasks")
    .upsert({
      id: taskId,
      from_agent: "gmail-push",
      to_agent: "email-agent",
      action: "gmail-history",
      params: {
        historyId,
        emailAddress: payload.emailAddress ?? null,
        publishTime: body?.message?.publishTime ?? null,
      },
      tier: "green",
      status: "pending",
    });

  if (error) {
    console.error("[gmail-watch] enqueue failed:", error.message);
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
