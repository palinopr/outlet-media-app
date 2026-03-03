import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { randomBytes, createHmac } from "node:crypto";
import { buildAuthUrl } from "@/lib/meta-oauth";

export async function GET(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const slug = url.searchParams.get("slug");
  if (!slug) {
    return NextResponse.json(
      { error: "Missing slug parameter" },
      { status: 400 },
    );
  }

  const nonce = randomBytes(16).toString("hex");
  const statePayload = JSON.stringify({ userId, slug, nonce });
  const secret = process.env.META_APP_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "Meta not configured" },
      { status: 500 },
    );
  }
  const sig = createHmac("sha256", secret)
    .update(statePayload)
    .digest("hex");
  const state = Buffer.from(`${sig}.${statePayload}`).toString("base64url");

  const authUrl = buildAuthUrl(state);
  return NextResponse.redirect(authUrl);
}
