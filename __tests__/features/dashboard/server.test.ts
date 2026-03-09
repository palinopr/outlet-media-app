import { beforeEach, describe, expect, it, vi } from "vitest";

const { createClerkSupabaseClient, currentUser, state, supabaseAdmin } = vi.hoisted(() => {
  const state = {
    approval_requests: [] as Record<string, unknown>[],
    campaign_client_overrides: [] as Record<string, unknown>[],
    meta_campaigns: [] as Record<string, unknown>[],
  };

  function applyFilters(
    rows: Record<string, unknown>[],
    filters: Array<{ field: string; type: "eq" | "in"; value: unknown }>,
  ) {
    return rows.filter((row) =>
      filters.every((filter) => {
        if (filter.type === "eq") {
          return row[filter.field] === filter.value;
        }

        const values = Array.isArray(filter.value) ? filter.value : [];
        return values.includes(row[filter.field]);
      }),
    );
  }

  const supabaseAdmin = {
    from(table: string) {
      const filters: Array<{ field: string; type: "eq" | "in"; value: unknown }> = [];
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
        order() {
          return this;
        },
        limit(value: number) {
          limitValue = value;
          return this;
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
    createClerkSupabaseClient: vi.fn(),
    currentUser: vi.fn(),
    state,
    supabaseAdmin,
  };
});

vi.mock("@/lib/supabase", () => ({
  createClerkSupabaseClient,
  supabaseAdmin,
}));

vi.mock("@clerk/nextjs/server", () => ({
  currentUser,
}));

vi.mock("@/features/conversations/server", () => ({
  listConversationThreads: vi.fn(),
}));

vi.mock("@/features/approvals/server", () => ({
  listApprovalRequests: vi.fn(),
}));

vi.mock("@/features/crm-follow-up-items/server", () => ({
  listCrmFollowUpItems: vi.fn(),
}));

vi.mock("@/features/assets/server", () => ({
  listAssetLibrary: vi.fn(),
}));

vi.mock("@/features/assets/summary", () => ({
  buildAssetLibrarySummary: vi.fn(),
}));

import { listConversationThreads } from "@/features/conversations/server";
import { listApprovalRequests } from "@/features/approvals/server";
import { listCrmFollowUpItems } from "@/features/crm-follow-up-items/server";
import { getDashboardActionCenter } from "@/features/dashboard/server";

describe("getDashboardActionCenter", () => {
  beforeEach(() => {
    createClerkSupabaseClient.mockReset();
    currentUser.mockReset();
    state.meta_campaigns = [
      {
        campaign_id: "cmp_override",
        client_slug: "legacy",
        name: "Legacy campaign",
      },
    ];
    state.campaign_client_overrides = [
      {
        campaign_id: "cmp_override",
        client_slug: "zamora",
      },
    ];
    state.approval_requests = [
      {
        id: "approval_override",
        title: "Campaign approval",
        summary: "Needs review",
        created_at: "2026-03-06T12:00:00.000Z",
        client_slug: "legacy",
        entity_id: "cmp_override",
        entity_type: "campaign",
        metadata: {},
        status: "pending",
        audience: "shared",
      },
    ];
    vi.mocked(listApprovalRequests).mockResolvedValue([
      {
        id: "approval_override",
        title: "Campaign approval",
        summary: "Needs review",
        createdAt: "2026-03-06T12:00:00.000Z",
        updatedAt: "2026-03-06T12:00:00.000Z",
        clientSlug: "legacy",
        audience: "shared",
        requestType: "generic",
        status: "pending",
        entityId: "cmp_override",
        entityType: "campaign",
        pageId: null,
        taskId: null,
        requestedById: null,
        requestedByName: null,
        decidedById: null,
        decidedByName: null,
        decidedAt: null,
        decisionNote: null,
        metadata: {},
      },
    ]);
    currentUser.mockResolvedValue({ publicMetadata: { role: "member" } });
    createClerkSupabaseClient.mockResolvedValue(null);
    vi.mocked(listConversationThreads).mockResolvedValue([]);
    vi.mocked(listCrmFollowUpItems).mockResolvedValue([]);
  });

  it("backfills reassigned campaign approvals on client action-center surfaces", async () => {
    const center = await getDashboardActionCenter({
      clientSlug: "zamora",
      limit: 4,
      mode: "client",
    });

    expect(center.approvals).toEqual([
      expect.objectContaining({
        campaignId: "cmp_override",
        campaignName: "Legacy campaign",
        clientSlug: "legacy",
        id: "approval_override",
      }),
    ]);
  });
});
