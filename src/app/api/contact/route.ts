import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { ContactFormSchema } from "@/lib/api-schemas";
import { apiError, validateRequest } from "@/lib/api-helpers";
import { enforceContentLength, enforceRateLimit } from "@/lib/request-guards";

const contactRecipient = process.env.CONTACT_FORM_TO_EMAIL ?? "support@outletmedia.co";

function withLabel(label: string, value: string | null | undefined) {
  const trimmed = value?.trim();
  return `${label}: ${trimmed && trimmed.length > 0 ? trimmed : "n/a"}`;
}

async function sendContactEmail(input: {
  company?: string | null;
  email: string;
  goal?: string | null;
  message: string;
  monthlyBudget?: string | null;
  name: string;
  pageContext?: string | null;
  phone?: string | null;
  preferredContact?: string | null;
  website?: string | null;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM_EMAIL ?? "Outlet Media <noreply@outletmedia.co>",
      to: [contactRecipient],
      subject: `New audit request: ${input.name}${input.company?.trim() ? ` (${input.company.trim()})` : ""}`,
      text: [
        `Name: ${input.name}`,
        `Email: ${input.email}`,
        withLabel("Phone", input.phone),
        withLabel("Business", input.company),
        withLabel("Website", input.website),
        withLabel("Goal", input.goal),
        withLabel("Monthly budget", input.monthlyBudget),
        withLabel("Preferred contact", input.preferredContact),
        withLabel("Page context", input.pageContext),
        "Message:",
        input.message.trim(),
      ].join("\n"),
    }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`Resend API returned ${response.status}${body ? `: ${body}` : ""}`);
  }
}

export async function POST(request: Request) {
  const sizeError = enforceContentLength(request, 16 * 1024);
  if (sizeError) return sizeError;

  const rateLimitError = enforceRateLimit(request, {
    limit: 8,
    scope: "contact",
    windowMs: 60_000,
  });
  if (rateLimitError) return rateLimitError;

  const { data, error: valErr } = await validateRequest(request, ContactFormSchema);
  if (valErr) return valErr;

  const {
    name,
    email,
    phone,
    company,
    website,
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
    withLabel("Website", website),
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

  try {
    await sendContactEmail({
      company,
      email,
      goal,
      message,
      monthlyBudget,
      name,
      pageContext,
      phone,
      preferredContact,
      website,
    });
  } catch (err) {
    console.error("resend email error:", err);
  }

  return NextResponse.json({ ok: true });
}
