import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  applyEffectiveCampaignClientSlugs,
  clerkClient,
  listActionableInvitations,
  listEffectiveCampaignRowsForClientSlug,
  state,
  supabaseAdmin,
} = vi.hoisted(() => {
  const state = {
    ad_assets: [] as Record<string, unknown>[],
    approval_requests: [] as Record<string, unknown>[],
    asset_comments: [] as Record<string, unknown>[],
    campaign_action_items: [] as Record<string, unknown>[],
    campaign_client_overrides: [] as Record<string, unknown>[],
    campaign_comments: [] as Record<string, unknown>[],
    client_accounts: [] as Record<string, unknown>[],
    client_member_campaigns: [] as Record<string, unknown>[],
    client_member_events: [] as Record<string, unknown>[],
    client_members: [] as Record<string, unknown>[],
    clients: [] as Record<string, unknown>[],
    crm_comments: [] as Record<string, unknown>[],
    event_comments: [] as Record<string, unknown>[],
    tm_events: [] as Record<string, unknown>[],
  };

  function applyFilters(
    rows: Record<string, unknown>[],
    filters: Array<{ field: string; type: "eq" | "in" | "neq" | "is" | "not-null"; value: unknown }>,
  ) {
    return rows.filter((row) =>
      filters.every((filter) => {
        if (filter.type === "eq" || filter.type === "is") {
          return row[filter.field] === filter.value;
        }
        if (filter.type === "neq") {
          return row[filter.field] !== filter.value;
        }
        if (filter.type === "not-null") {
          return row[filter.field] != null;
        }
        const values = Array.isArray(filter.value) ? filter.value : [];
        return values.includes(row[filter.field]);
      }),
    );
  }

  const supabaseAdmin = {
    from(table: string) {
      const filters: Array<{ field: string; type: "eq" | "in" | "neq" | "is" | "not-null"; value: unknown }> = [];
      let limitValue: number | null = null;

      const query = {
        select() {
          return this;
        },
        eq(field: string, value: unknown) {
          filters.push({ field, type: "eq", value });
          return this;
        },
        in(field: string, value: unknown[]) {
          filters.push({ field, type: "in", value });
          return this;
        },
        neq(field: string, value: unknown) {
          filters.push({ field, type: "neq", value });
          return this;
        },
        is(field: string, value: unknown) {
          filters.push({ field, type: "is", value });
          return this;
        },
        not(field: string, operator: string, value: unknown) {
          if (operator === "is" && value === null) {
            filters.push({ field, type: "not-null", value });
          }
          return this;
        },
        order() {
          return this;
        },
        limit(value: number) {
          limitValue = value;
          return this;
        },
        async single() {
          const rows = applyFilters(
            (state[table as keyof typeof state] ?? []) as Record<string, unknown>[],
            filters,
          );
          return { data: rows[0] ?? null, error: null };
        },
        async maybeSingle() {
          const rows = applyFilters(
            (state[table as keyof typeof state] ?? []) as Record<string, unknown>[],
            filters,
          );
          return { data: rows[0] ?? null, error: null };
        },
        then(resolve: (value: { data: Record<string, unknown>[]; error: null }) => unknown) {
          const rows = applyFilters(
            (state[table as keyof typeof state] ?? []) as Record<string, unknown>[],
            filters,
          );
          const data = limitValue == null ? rows : rows.slice(0, limitValue);
          return Promise.resolve({ data, error: null }).then(resolve);
        },
      };

      return query;
    },
  };

  return {
    applyEffectiveCampaignClientSlugs: vi.fn(async (rows: unknown[]) => rows),
    clerkClient: vi.fn(async () => ({
      users: {
        getUser: vi.fn(async () => ({
          emailAddresses: [{ emailAddress: "user@example.com" }],
          firstName: "Test",
          lastName: "User",
        })),
      },
    })),
    listActionableInvitations: vi.fn(async () => []),
    listEffectiveCampaignRowsForClientSlug: vi.fn(async () => []),
    state,
    supabaseAdmin,
  };
});

vi.mock("@/lib/supabase", () => ({
  supabaseAdmin,
}));

vi.mock("@clerk/nextjs/server", () => ({
  clerkClient,
}));

vi.mock("@/lib/campaign-client-assignment", () => ({
  applyEffectiveCampaignClientSlugs,
  listEffectiveCampaignRowsForClientSlug,
}));

vi.mock("@/features/invitations/server", () => ({
  listActionableInvitations,
}));

vi.mock("@/features/settings/connected-accounts", () => ({
  buildConnectedAccountsSummary: vi.fn(() => ({
    attentionCount: 0,
    totalCount: 0,
  })),
}));

import { getClientDetail, getClientSummaries } from "./data";

describe("admin clients data", () => {
  beforeEach(() => {
    Object.keys(state).forEach((key) => {
      (state as Record<string, unknown[]>)[key] = [];
    });
    vi.mocked(listEffectiveCampaignRowsForClientSlug).mockResolvedValue([]);
  });

  it("does not count CRM comments in client summary open-discussion totals", async () => {
    state.clients = [
      {
        created_at: "2026-03-06T12:00:00.000Z",
        id: "client_1",
        name: "Zamora",
        slug: "zamora",
        status: "active",
      },
    ];
    state.crm_comments = [
      {
        client_slug: "zamora",
        id: "crm_comment_1",
        parent_comment_id: null,
        resolved: false,
      },
    ];

    const summaries = await getClientSummaries();

    expect(summaries).toEqual([
      expect.objectContaining({
        id: "client_1",
        openDiscussions: 0,
      }),
    ]);
  });

  it("does not count CRM comments in client detail open-discussion totals", async () => {
    state.clients = [
      {
        created_at: "2026-03-06T12:00:00.000Z",
        id: "client_1",
        name: "Zamora",
        portal_brand_name: null,
        portal_logo_alt: null,
        portal_logo_url: null,
        slug: "zamora",
        status: "active",
      },
    ];
    vi.mocked(listEffectiveCampaignRowsForClientSlug).mockImplementation(
      async () =>
        [
          {
            campaign_id: "cmp_1",
            client_slug: "zamora",
            id: "cmp_1",
            name: "Launch",
            roas: 2.4,
            spend: 10000,
            status: "ACTIVE",
          },
        ] as never,
    );
    state.crm_comments = [
      {
        client_slug: "zamora",
        id: "crm_comment_1",
        parent_comment_id: null,
        resolved: false,
      },
    ];

    const detail = await getClientDetail("client_1");

    expect(detail).toEqual(
      expect.objectContaining({
        id: "client_1",
        openDiscussions: 0,
      }),
    );
  });
});
