import { NextResponse } from "next/server";
import { Resend } from "resend";
import { supabaseAdmin } from "@/lib/supabase";
import { ContactFormSchema } from "@/lib/api-schemas";
import { apiError, validateRequest } from "@/lib/api-helpers";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

function withLabel(label: string, value: string | null | undefined) {
  const trimmed = value?.trim();
  return `${label}: ${trimmed && trimmed.length > 0 ? trimmed : "n/a"}`;
}

export async function POST(request: Request) {
  const { data, error: valErr } = await validateRequest(request, ContactFormSchema);
  if (valErr) return valErr;

  const {
    name,
    email,
    phone,
    company,
    goal,
    monthlyBudget,
    preferredContact,
    pageContext,
    message,
  } = data;

  const fullMessage = [
    message.trim(),
    "",
    withLabel("Business", company),
    withLabel("Phone", phone),
    withLabel("Goal", goal),
    withLabel("Monthly budget", monthlyBudget),
    withLabel("Preferred contact", preferredContact),
    withLabel("Page context", pageContext),
  ].join("\n");

  if (supabaseAdmin) {
    const { error } = await supabaseAdmin
      .from("contact_submissions")
      .insert({ name, email, message: fullMessage });

    if (error) {
      console.error("contact insert error:", error);
      return apiError("Failed to save submission", 500);
    }
  }

  if (resend) {
    try {
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL ?? "Outlet Media <noreply@outletmedia.co>",
        to: "support@outletmedia.co",
        subject: `New landing lead: ${name}${company?.trim() ? ` (${company.trim()})` : ""}`,
        text: [
          `Name: ${name}`,
          `Email: ${email}`,
          withLabel("Phone", phone),
          withLabel("Business", company),
          withLabel("Goal", goal),
          withLabel("Monthly budget", monthlyBudget),
          withLabel("Preferred contact", preferredContact),
          withLabel("Page context", pageContext),
          "Message:",
          message.trim(),
        ].join("\n"),
      });
    } catch (err) {
      console.error("resend email error:", err);
    }
  }

  return NextResponse.json({ ok: true });
}
