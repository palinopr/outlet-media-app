import { readCheckoutHandoffToken } from "@/features/whatsapp-ticket-concierge/checkout-handoff";
import { supabaseAdmin } from "@/lib/supabase";

function htmlResponse(status: number, body: string) {
  return new Response(body, {
    headers: {
      "Cache-Control": "no-store",
      "Content-Type": "text/html; charset=utf-8",
      "Referrer-Policy": "no-referrer",
      "X-Robots-Tag": "noindex, nofollow",
    },
    status,
  });
}

function renderExpiredPage(): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Checkout expired | Outlet Media</title>
    <style>
      body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background: #0b1020; color: #f7f9fc; }
      main { min-height: 100vh; display: grid; place-items: center; padding: 24px; }
      section { max-width: 460px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); border-radius: 20px; padding: 28px; }
      h1 { margin: 0 0 12px; font-size: 28px; }
      p { margin: 0; line-height: 1.5; color: #d9e1ef; }
    </style>
  </head>
  <body>
    <main>
      <section>
        <h1>Checkout expired</h1>
        <p>This reservation is no longer active. Go back to WhatsApp and ask for a fresh checkout link.</p>
      </section>
    </main>
  </body>
</html>`;
}

function renderCheckoutPage(targetUrl: string): string {
  const escapedUrl = targetUrl.replace(/&/g, "&amp;").replace(/"/g, "&quot;");

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Secure checkout | Outlet Media</title>
    <style>
      body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background: radial-gradient(circle at top, #14213d, #0b1020 58%); color: #f7f9fc; }
      main { min-height: 100vh; display: grid; place-items: center; padding: 24px; }
      section { max-width: 460px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.12); border-radius: 20px; padding: 28px; box-shadow: 0 30px 80px rgba(0,0,0,0.35); }
      .eyebrow { display: inline-block; margin-bottom: 12px; font-size: 12px; letter-spacing: 0.18em; text-transform: uppercase; color: #ffcf6e; }
      h1 { margin: 0 0 12px; font-size: 30px; line-height: 1.1; }
      p { margin: 0 0 18px; line-height: 1.55; color: #d9e1ef; }
      a { display: inline-flex; align-items: center; justify-content: center; min-height: 48px; padding: 0 18px; border-radius: 999px; background: #ffcf6e; color: #101726; font-weight: 700; text-decoration: none; }
      small { display: block; margin-top: 14px; color: #afbdd6; }
    </style>
  </head>
  <body>
    <main>
      <section>
        <span class="eyebrow">Outlet Media</span>
        <h1>Continue to secure checkout</h1>
        <p>We are sending you to the live Ticketmaster checkout now. If it does not continue automatically, tap the button below.</p>
        <a href="${escapedUrl}" target="_blank" rel="noopener noreferrer">Continue to secure checkout</a>
        <small>This reservation is time-sensitive.</small>
      </section>
    </main>
  </body>
</html>`;
}

async function loadCheckoutTarget(optionId: string): Promise<string | null> {
  if (!supabaseAdmin) {
    throw new Error("Database not configured. Set SUPABASE_SERVICE_ROLE_KEY.");
  }

  const { data: attempt, error: attemptError } = await supabaseAdmin
    .from("whatsapp_ticket_concierge_checkout_attempts")
    .select("checkout_url, status")
    .eq("option_id", optionId)
    .maybeSingle();

  if (attemptError) {
    throw new Error(`[concierge] checkout handoff lookup failed: ${attemptError.message}`);
  }

  if (!attempt || attempt.status !== "checkout_ready" || !attempt.checkout_url) {
    return null;
  }

  return attempt.checkout_url;
}

export async function GET(
  request: Request,
  context: { params: Promise<{ token?: string }> },
) {
  const params = await context.params;
  const token =
    params.token ??
    new URL(request.url).pathname.split("/").filter(Boolean).at(-1) ??
    null;

  if (!token) {
    return htmlResponse(404, renderExpiredPage());
  }

  const payload = readCheckoutHandoffToken(token);
  if (!payload || payload.exp <= Date.now()) {
    return htmlResponse(410, renderExpiredPage());
  }

  const checkoutUrl = await loadCheckoutTarget(payload.optionId);
  if (!checkoutUrl) {
    return htmlResponse(410, renderExpiredPage());
  }

  return htmlResponse(200, renderCheckoutPage(checkoutUrl));
}
