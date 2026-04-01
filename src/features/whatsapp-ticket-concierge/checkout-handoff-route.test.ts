import { beforeEach, describe, expect, it, vi } from "vitest";

const { state, supabaseAdmin } = vi.hoisted(() => {
  const state = {
    whatsapp_ticket_concierge_checkout_attempts: [] as Record<string, unknown>[],
    whatsapp_ticket_concierge_option_sets: [] as Record<string, unknown>[],
    whatsapp_ticket_concierge_options: [] as Record<string, unknown>[],
  };

  const supabaseAdmin = {
    from(table: string) {
      const filters: Array<{ field: string; value: unknown }> = [];

      const applyFilters = () =>
        (state[table as keyof typeof state] as Record<string, unknown>[]).filter((row) =>
          filters.every(({ field, value }) => row[field] === value),
        );

      const chain = {
        select() {
          return this;
        },
        eq(field: string, value: unknown) {
          filters.push({ field, value });
          return this;
        },
        async maybeSingle() {
          const rows = applyFilters();
          return { data: rows[0] ?? null, error: null };
        },
      };

      return chain;
    },
  };

  return { state, supabaseAdmin };
});

vi.mock("@/lib/supabase", () => ({
  supabaseAdmin,
}));

import { GET } from "@/app/checkout/[token]/route";
import { buildCheckoutHandoffUrl } from "./checkout-handoff";

describe("checkout handoff route", () => {
  beforeEach(() => {
    process.env.INGEST_SECRET = "test-ingest-secret";

    state.whatsapp_ticket_concierge_checkout_attempts = [
      {
        checkout_url: "https://auth.ticketmaster.com/as/authorization.oauth2?TMUO=abc",
        option_id: "opt_live",
        status: "checkout_ready",
      },
    ];
    state.whatsapp_ticket_concierge_options = [];
    state.whatsapp_ticket_concierge_option_sets = [];
  });

  it("renders a public checkout handoff page for a live token", async () => {
    const url = buildCheckoutHandoffUrl({
      baseUrl: "https://www.outletmedia.net",
      expiresAt: "2099-04-01T00:00:00.000Z",
      optionId: "opt_live",
    });
    const token = url.split("/").pop() ?? "";

    const response = await GET(new Request(`https://www.outletmedia.net/checkout/${token}`), {
      params: Promise.resolve({ token }),
    });

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toContain("text/html");
    const html = await response.text();
    expect(html).toContain("Continue to secure checkout");
    expect(html).toContain("https://auth.ticketmaster.com/as/authorization.oauth2?TMUO=abc");
    expect(html).not.toContain("http-equiv=\"refresh\"");
  });

  it("returns 410 when the token is valid but no checkout attempt is available", async () => {
    state.whatsapp_ticket_concierge_checkout_attempts = [];

    const url = buildCheckoutHandoffUrl({
      baseUrl: "https://www.outletmedia.net",
      expiresAt: "2099-04-01T00:00:00.000Z",
      optionId: "opt_live",
    });
    const token = url.split("/").pop() ?? "";

    const response = await GET(new Request(`https://www.outletmedia.net/checkout/${token}`), {
      params: Promise.resolve({ token }),
    });

    expect(response.status).toBe(410);
  });
});
