import { beforeEach, describe, expect, it, vi } from "vitest";

const { state, supabaseAdmin } = vi.hoisted(() => {
  const state = {
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

import { GET } from "./route";

describe("concierge map route", () => {
  beforeEach(() => {
    state.whatsapp_ticket_concierge_option_sets = [
      {
        expires_at: "2099-01-01T00:00:00.000Z",
        id: "set_live",
        status: "active",
      },
      {
        expires_at: "2099-01-01T00:00:00.000Z",
        id: "set_replaced",
        status: "replaced",
      },
      {
        expires_at: "2000-01-01T00:00:00.000Z",
        id: "set_expired",
        status: "active",
      },
    ];
    state.whatsapp_ticket_concierge_options = [
      {
        id: "opt_live",
        map_svg: "<svg>live</svg>",
        map_token: "live-token",
        option_set_id: "set_live",
      },
      {
        id: "opt_replaced",
        map_svg: "<svg>replaced</svg>",
        map_token: "replaced-token",
        option_set_id: "set_replaced",
      },
      {
        id: "opt_expired",
        map_svg: "<svg>expired</svg>",
        map_token: "expired-token",
        option_set_id: "set_expired",
      },
    ];
  });

  it("returns 404 for an unknown token", async () => {
    await expect(GET(new Request("https://example.com/api/whatsapp/concierge/maps/bad-token"))).resolves.toMatchObject({
      status: 404,
    });
  });

  it("returns 410 when the option set has been replaced or expired", async () => {
    await expect(GET(new Request("https://example.com/api/whatsapp/concierge/maps/expired-token"))).resolves.toMatchObject({
      status: 410,
    });
  });

  it("returns the SVG with cache headers for a live token", async () => {
    const response = await GET(new Request("https://example.com/api/whatsapp/concierge/maps/ignored"), {
      params: Promise.resolve({ token: "live-token" }),
    });

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("image/svg+xml; charset=utf-8");
    expect(response.headers.get("Cache-Control")).toBe("public, max-age=60");
    expect(await response.text()).toBe("<svg>live</svg>");
  });

  it("returns 404 when neither params nor the path include a token", async () => {
    await expect(GET(new Request("https://example.com/api/whatsapp/concierge/maps/"))).resolves.toMatchObject({
      status: 404,
    });
  });
});
