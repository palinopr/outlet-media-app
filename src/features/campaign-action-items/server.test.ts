import { beforeEach, describe, expect, it, vi } from "vitest";

const { createClerkSupabaseClient, currentUser, state, supabaseAdmin } = vi.hoisted(() => {
  const state = {
    campaign_action_items: [] as Record<string, unknown>[],
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
      let updatePayload: Record<string, unknown> | null = null;

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
        update(payload: Record<string, unknown>) {
          updatePayload = payload;
          return this;
        },
        async maybeSingle() {
          const rows = applyFilters(
            (state[table as keyof typeof state] ?? []) as Record<string, unknown>[],
            filters,
          );
          return { data: rows[0] ?? null, error: null };
        },
        then(
          resolve: (value: { data: Record<string, unknown>[] | null; error: null }) => unknown,
        ) {
          const tableRows = (state[table as keyof typeof state] ?? []) as Record<string, unknown>[];
          const rows = applyFilters(tableRows, filters);

          if (updatePayload) {
            for (const row of rows) {
              Object.assign(row, updatePayload);
            }
            return Promise.resolve({ data: rows, error: null }).then(resolve);
          }

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

vi.mock("@clerk/nextjs/server", () => ({
  currentUser,
}));

vi.mock("@/lib/supabase", () => ({
  createClerkSupabaseClient,
  getFeatureReadClient: vi.fn().mockResolvedValue(supabaseAdmin),
  supabaseAdmin,
}));

vi.mock("@/lib/agent-dispatch", () => ({
  enqueueExternalAgentTask: vi.fn(),
}));

vi.mock("@/features/notifications/workflow", () => ({
  notifyWorkflowAssignee: vi.fn(),
}));

vi.mock("@/features/system-events/server", () => ({
  logSystemEvent: vi.fn(),
  summarizeChangedFields: vi.fn(),
}));

import {
  createSystemCampaignActionItem,
  listCampaignActionItems,
} from "@/features/campaign-action-items/server";

describe("campaign action item ownership", () => {
  beforeEach(() => {
    createClerkSupabaseClient.mockReset();
    currentUser.mockReset();
    state.meta_campaigns = [
      {
        campaign_id: "cmp_1",
        client_slug: "legacy",
        name: "Legacy campaign",
      },
    ];
    state.campaign_client_overrides = [
      {
        campaign_id: "cmp_1",
        client_slug: "zamora",
      },
    ];
    state.campaign_action_items = [
      {
        id: "item_1",
        campaign_id: "cmp_1",
        client_slug: "legacy",
        title: "Review copy",
        description: null,
        status: "todo",
        priority: "medium",
        visibility: "shared",
        assignee_id: null,
        assignee_name: null,
        due_date: null,
        created_by: "user_1",
        position: 0,
        source_entity_type: "approval_request",
        source_entity_id: "approval_1",
        created_at: "2026-03-06T10:00:00.000Z",
        updated_at: "2026-03-06T10:00:00.000Z",
      },
    ];
    currentUser.mockResolvedValue({ publicMetadata: { role: "member" } });
    createClerkSupabaseClient.mockResolvedValue(null);
  });

  it("lists campaign action items by campaign ownership instead of stored client slug", async () => {
    const items = await listCampaignActionItems({
      audience: "all",
      campaignId: "cmp_1",
      clientSlug: "zamora",
    });

    expect(items).toEqual([
      expect.objectContaining({
        campaignId: "cmp_1",
        clientSlug: "legacy",
        id: "item_1",
      }),
    ]);
  });

  it("self-heals source-linked action items to the effective campaign owner", async () => {
    const item = await createSystemCampaignActionItem({
      campaignId: "cmp_1",
      clientSlug: "legacy",
      sourceEntityId: "approval_1",
      sourceEntityType: "approval_request",
      title: "Review copy",
    });

    expect(item).toEqual(
      expect.objectContaining({
        clientSlug: "zamora",
        id: "item_1",
      }),
    );
    expect(state.campaign_action_items[0]?.client_slug).toBe("zamora");
  });
});
