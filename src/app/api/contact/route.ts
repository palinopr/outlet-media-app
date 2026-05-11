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
  businessLink?: string | null;
  company?: string | null;
  deadline?: string | null;
  desiredOutcome?: string | null;
  email: string;
  fbclid?: string | null;
  gclid?: string | null;
  goal?: string | null;
  hasAdAccount?: string | null;
  message: string;
  monthlyBudget?: string | null;
  name: string;
  pageContext?: string | null;
  phone?: string | null;
  preferredContact?: string | null;
  recommendedOffer?: string | null;
  stage?: string | null;
  utmCampaign?: string | null;
  utmContent?: string | null;
  utmMedium?: string | null;
  utmSource?: string | null;
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
        withLabel("Business link", input.businessLink),
        withLabel("Stage", input.stage),
        withLabel("Desired outcome", input.desiredOutcome),
        withLabel("Has ad account", input.hasAdAccount),
        withLabel("Goal", input.goal),
        withLabel("Monthly budget", input.monthlyBudget),
        withLabel("Deadline", input.deadline),
        withLabel("Recommended offer", input.recommendedOffer),
        withLabel("Preferred contact", input.preferredContact),
        withLabel("Page context", input.pageContext),
        withLabel("UTM source", input.utmSource),
        withLabel("UTM medium", input.utmMedium),
        withLabel("UTM campaign", input.utmCampaign),
        withLabel("UTM content", input.utmContent),
        withLabel("fbclid", input.fbclid),
        withLabel("gclid", input.gclid),
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
    stage,
    desiredOutcome,
    hasAdAccount,
    businessLink,
    deadline,
    recommendedOffer,
    utmSource,
    utmMedium,
    utmCampaign,
    utmContent,
    fbclid,
    gclid,
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
    withLabel("Business link", businessLink),
    withLabel("Phone", phone),
    withLabel("Stage", stage),
    withLabel("Desired outcome", desiredOutcome),
    withLabel("Has ad account", hasAdAccount),
    withLabel("Goal", goal),
    withLabel("Monthly budget", monthlyBudget),
    withLabel("Deadline", deadline),
    withLabel("Recommended offer", recommendedOffer),
    withLabel("Preferred contact", preferredContact),
    withLabel("Page context", pageContext),
    withLabel("UTM source", utmSource),
    withLabel("UTM medium", utmMedium),
    withLabel("UTM campaign", utmCampaign),
    withLabel("UTM content", utmContent),
    withLabel("fbclid", fbclid),
    withLabel("gclid", gclid),
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
      businessLink,
      company,
      deadline,
      desiredOutcome,
      email,
      fbclid,
      gclid,
      goal,
      hasAdAccount,
      message,
      monthlyBudget,
      name,
      pageContext,
      phone,
      preferredContact,
      recommendedOffer,
      stage,
      utmCampaign,
      utmContent,
      utmMedium,
      utmSource,
      website,
    });
  } catch (err) {
    console.error("resend email error:", err);
  }

  return NextResponse.json({ ok: true });
}
