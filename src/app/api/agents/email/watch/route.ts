import { NextResponse } from "next/server";

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

  return NextResponse.json({
    ignored: true,
    ok: true,
    retired: true,
  });
}
