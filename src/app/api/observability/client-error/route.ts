import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { z } from "zod";
import { authGuard, validateRequest } from "@/lib/api-helpers";
import { supabaseAdmin } from "@/lib/supabase";

const ClientErrorSchema = z.object({
  digest: z.string().max(200).optional(),
  message: z.string().min(1).max(1000),
  metadata: z.record(z.string(), z.unknown()).optional(),
  route: z.string().max(500).optional(),
  stack: z.string().max(8000).optional(),
});

function scrub(value: string | undefined) {
  if (!value) return value;
  return value
    .replace(/sk_(live|test)_[A-Za-z0-9_-]+/g, "[redacted]")
    .replace(/pk_(live|test)_[A-Za-z0-9_-]+/g, "[redacted]")
    .replace(/Bearer\s+[A-Za-z0-9._~+\-/]+=*/gi, "[redacted]")
    .replace(/(password|secret|token|key)=([^\s&]+)/gi, "$1=[redacted]");
}

export async function POST(request: Request) {
  const { userId, error: authError } = await authGuard();
  if (authError) return authError;

  const { data, error } = await validateRequest(request, ClientErrorSchema);
  if (error) return error;

  if (!supabaseAdmin) {
    return NextResponse.json({ ok: true, logged: false });
  }

  const user = await currentUser().catch(() => null);
  const { error: insertError } = await supabaseAdmin
    .from("application_errors")
    .insert({
      digest: scrub(data.digest) ?? null,
      message: scrub(data.message) ?? "Client error",
      metadata: data.metadata ?? {},
      route: scrub(data.route) ?? null,
      source: "client",
      stack: scrub(data.stack) ?? null,
      user_email: user?.emailAddresses[0]?.emailAddress ?? null,
      user_id: userId,
    });

  if (insertError) {
    console.error("[observability/client-error] failed to record error:", insertError.message);
    return NextResponse.json({ ok: true, logged: false });
  }

  return NextResponse.json({ ok: true, logged: true });
}
