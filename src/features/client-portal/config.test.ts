import { beforeEach, describe, expect, it, vi } from "vitest";

const maybeSingle = vi.fn();
const eq = vi.fn(() => ({ maybeSingle }));
const select = vi.fn(() => ({ eq }));

vi.mock("@/lib/supabase", () => ({
  supabaseAdmin: {
    from: vi.fn(() => ({ select })),
  },
}));

import { getClientPortalConfig } from "./config";

describe("getClientPortalConfig", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns the expanded portal config shape from the clients table", async () => {
    maybeSingle.mockResolvedValue({
      data: {
        id: "client_1",
        slug: "acme",
        events_enabled: true,
        reports_enabled: true,
        portal_brand_name: "Acme Live",
        portal_logo_url: "https://cdn.example.com/acme.png",
        portal_logo_alt: "Acme Live",
      },
      error: null,
    });

    const config = await getClientPortalConfig("acme");

    expect(config).toEqual({
      clientId: "client_1",
      slug: "acme",
      eventsEnabled: true,
      reportsEnabled: true,
      brandName: "Acme Live",
      logoUrl: "https://cdn.example.com/acme.png",
      logoAlt: "Acme Live",
    });
  });
});
