import { NextResponse } from "next/server";
import { Resend } from "resend";
import { supabaseAdmin } from "@/lib/supabase";
import { ContactFormSchema } from "@/lib/api-schemas";
import { apiError, parseJsonBody } from "@/lib/api-helpers";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export async function POST(request: Request) {
  const raw = await parseJsonBody<unknown>(request);
  if (raw instanceof Response) return raw;

  const parsed = ContactFormSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload", details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const { name, email, message } = parsed.data;

  // 1. Store in Supabase
  if (supabaseAdmin) {
    const { error } = await supabaseAdmin
      .from("contact_submissions")
      .insert({ name, email, message });

    if (error) {
      console.error("contact insert error:", error);
      return apiError("Failed to save submission", 500);
    }
  }

  // 2. Send notification email via Resend
  if (resend) {
    try {
      await resend.emails.send({
        from: "Outlet Media <onboarding@resend.dev>",
        to: "support@outletmedia.co",
        subject: `New contact form: ${name}`,
        text: [
          `Name: ${name}`,
          `Email: ${email}`,
          `Message:`,
          message,
        ].join("\n"),
      });
    } catch (err) {
      console.error("resend email error:", err);
    }
  }

  return NextResponse.json({ ok: true });
}
