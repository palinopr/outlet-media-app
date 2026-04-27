import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import { Resend } from "resend";
import { InviteSchema } from "@/lib/api-schemas";
import { adminGuard, validateRequest } from "@/lib/api-helpers";
import { slugToLabel } from "@/lib/formatters";
import { supabaseAdmin } from "@/lib/supabase";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

// POST /api/admin/invite
// Body: { email: string, client_slug?: string, role?: "admin" }
// Creates a Clerk invitation. When Resend is configured, Outlet sends the
// customer-facing email so the copy and redirect are owned by this app.
// When the user signs up they get the metadata pre-applied (client_slug or role).

function getBaseUrl(request: Request) {
  return process.env.NEXT_PUBLIC_APP_URL ?? new URL(request.url).origin;
}

function getFinalRedirectPath(body: {
  client_slug?: string;
  role?: string;
}) {
  if (body.role === "admin") return "/admin/dashboard";
  if (body.client_slug) return `/client/${encodeURIComponent(body.client_slug)}`;
  return "/client/pending";
}

export function buildInvitationRedirectUrl(
  request: Request,
  body: { client_slug?: string; role?: string },
) {
  const baseUrl = getBaseUrl(request);
  const signUpUrl = new URL("/sign-up", baseUrl);
  const finalUrl = new URL(getFinalRedirectPath(body), baseUrl);

  signUpUrl.searchParams.set("redirect_url", finalUrl.toString());
  return signUpUrl.toString();
}

function getInviteAudienceLabel(body: { client_slug?: string; role?: string }) {
  if (body.role === "admin") return "Outlet Media admin workspace";
  if (body.client_slug) return `${slugToLabel(body.client_slug)} portal`;
  return "Outlet Media portal";
}

function buildInvitationEmail({
  acceptUrl,
  body,
}: {
  acceptUrl: string;
  body: { client_slug?: string; role?: string };
}) {
  const audience = getInviteAudienceLabel(body);
  const text = [
    "You've been invited to Outlet Media.",
    "",
    `Accept the invitation to create your password and access the ${audience}.`,
    "",
    acceptUrl,
    "",
    "This invitation expires in 30 days.",
    "",
    "If you were not expecting this invitation, you can ignore this email.",
  ].join("\n");

  const html = `
    <div style="font-family: Inter, Arial, sans-serif; color: #111827; line-height: 1.5;">
      <p>You've been invited to Outlet Media.</p>
      <p>Accept the invitation to create your password and access the ${audience}.</p>
      <p>
        <a href="${acceptUrl}" style="display: inline-block; background: #4f46e5; color: #ffffff; padding: 12px 18px; border-radius: 6px; text-decoration: none; font-weight: 600;">
          Accept invitation
        </a>
      </p>
      <p style="font-size: 14px; color: #4b5563;">This invitation expires in 30 days.</p>
      <p style="font-size: 14px; color: #4b5563;">If you were not expecting this invitation, you can ignore this email.</p>
    </div>
  `;

  return { html, text };
}

async function sendOutletInvitationEmail({
  acceptUrl,
  body,
  emailAddress,
}: {
  acceptUrl: string;
  body: { client_slug?: string; role?: string };
  emailAddress: string;
}) {
  if (!resend) return false;

  const { html, text } = buildInvitationEmail({ acceptUrl, body });

  await resend.emails.send({
    from: process.env.RESEND_INVITE_FROM_EMAIL
      ?? process.env.RESEND_FROM_EMAIL
      ?? "Outlet Media <noreply@outletmedia.co>",
    to: emailAddress,
    subject: "You're invited to Outlet Media",
    html,
    text,
  });

  return true;
}

export async function POST(request: Request) {
  const adminErr = await adminGuard();
  if (adminErr) return adminErr;

  const { data: body, error: valErr } = await validateRequest(request, InviteSchema);
  if (valErr) return valErr;

  const emailAddress = body.email.trim().toLowerCase();
  const redirectUrl = buildInvitationRedirectUrl(request, body);

  // Validate client_slug exists in clients table
  if (body.client_slug && supabaseAdmin) {
    const { data: clientRow } = await supabaseAdmin
      .from("clients")
      .select("id")
      .eq("slug", body.client_slug)
      .single();

    if (!clientRow) {
      return NextResponse.json({ error: "Client not found" }, { status: 400 });
    }
  }

  const publicMetadata: Record<string, string> = {};
  if (body.client_slug) publicMetadata.client_slug = body.client_slug;
  if (body.client_role) publicMetadata.client_role = body.client_role;
  if (body.role) publicMetadata.role = body.role;

  try {
    const client = await clerkClient();
    const invitation = await client.invitations.createInvitation({
      emailAddress,
      redirectUrl,
      publicMetadata,
      notify: !resend,
      ignoreExisting: true,
    });

    if (resend) {
      if (!invitation.url) {
        return NextResponse.json({ error: "Invitation URL was not returned by Clerk" }, { status: 502 });
      }

      await sendOutletInvitationEmail({
        acceptUrl: invitation.url,
        body,
        emailAddress,
      });
    }
  } catch (err: unknown) {
    // Clerk errors carry an `errors` array with detailed messages
    const clerkErr = err as { errors?: { message: string }[]; message?: string; status?: number };
    const detail = clerkErr.errors?.[0]?.message ?? clerkErr.message ?? "Failed to create invitation";
    const status = clerkErr.status ?? 500;
    return NextResponse.json({ error: detail }, { status });
  }

  return NextResponse.json({ ok: true });
}
