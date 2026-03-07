import { beforeEach, describe, expect, it, vi } from "vitest";

const { state, supabaseAdmin } = vi.hoisted(() => {
  const state = {
    campaign_action_items: [] as Record<string, unknown>[],
  };

  function applyFilters(
    rows: Record<string, unknown>[],
    filters: Array<{ field: string; type: "eq"; value: unknown }>,
  ) {
    return rows.filter((row) => filters.every((filter) => row[filter.field] === filter.value));
  }

  const supabaseAdmin = {
    from(table: string) {
      const filters: Array<{ field: string; type: "eq"; value: unknown }> = [];
      let updatePayload: Record<string, unknown> | null = null;
      let deleteMode = false;

      const query = {
        select() {
          return this;
        },
        eq(field: string, value: unknown) {
          filters.push({ field, type: "eq", value });
          return this;
        },
        update(payload: Record<string, unknown>) {
          updatePayload = payload;
          return this;
        },
        delete() {
          deleteMode = true;
          return this;
        },
        async maybeSingle() {
          const rows = applyFilters(
            (state[table as keyof typeof state] ?? []) as Record<string, unknown>[],
            filters,
          );
          return {
            data: rows[0] ? { ...rows[0] } : null,
            error: null,
          };
        },
        then(
          resolve: (value: { data: Record<string, unknown>[] | null; error: null }) => unknown,
        ) {
          const rows = applyFilters(
            (state[table as keyof typeof state] ?? []) as Record<string, unknown>[],
            filters,
          );

          if (deleteMode) {
            state[table as keyof typeof state] = (
              (state[table as keyof typeof state] ?? []) as Record<string, unknown>[]
            ).filter((row) => !rows.includes(row)) as never;
            return Promise.resolve({ data: null, error: null }).then(resolve);
          }

          if (updatePayload) {
            for (const row of rows) {
              Object.assign(row, updatePayload);
            }
            return Promise.resolve({ data: rows, error: null }).then(resolve);
          }

          return Promise.resolve({ data: rows, error: null }).then(resolve);
        },
      };

      return query;
    },
  };

  return { state, supabaseAdmin };
});

const {
  adminGuard,
  currentUser,
  getCampaignActionItemById,
  getCampaignWorkflowPaths,
  getEffectiveCampaignClientSlug,
  logAudit,
  logSystemEvent,
  maybeEnqueueCampaignActionItemTriage,
  notifyWorkflowAssignee,
  revalidateWorkflowPaths,
  summarizeChangedFields,
} = vi.hoisted(() => ({
  adminGuard: vi.fn(),
  currentUser: vi.fn(),
  getCampaignActionItemById: vi.fn(),
  getCampaignWorkflowPaths: vi.fn(() => ["/admin/campaigns/cmp_1"]),
  getEffectiveCampaignClientSlug: vi.fn(),
  logAudit: vi.fn(),
  logSystemEvent: vi.fn(),
  maybeEnqueueCampaignActionItemTriage: vi.fn(),
  notifyWorkflowAssignee: vi.fn(),
  revalidateWorkflowPaths: vi.fn(),
  summarizeChangedFields: vi.fn(() => "updated fields"),
}));

vi.mock("@clerk/nextjs/server", () => ({
  currentUser,
}));

vi.mock("@/lib/api-helpers", () => ({
  adminGuard,
}));

vi.mock("@/lib/campaign-client-assignment", () => ({
  getEffectiveCampaignClientSlug,
}));

vi.mock("@/lib/supabase", () => ({
  supabaseAdmin,
}));

vi.mock("@/features/campaign-action-items/server", () => ({
  getCampaignActionItemById,
  maybeEnqueueCampaignActionItemTriage,
}));

vi.mock("@/features/notifications/workflow", () => ({
  notifyWorkflowAssignee,
}));

vi.mock("@/features/system-events/server", () => ({
  logSystemEvent,
  summarizeChangedFields,
}));

vi.mock("@/features/workflow/revalidation", () => ({
  getCampaignWorkflowPaths,
  revalidateWorkflowPaths,
}));

vi.mock("./audit", () => ({
  logAudit,
}));

import {
  deleteCampaignActionItem,
  updateCampaignActionItem,
} from "@/app/admin/actions/campaign-action-items";

describe("campaign action item admin ownership", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    currentUser.mockResolvedValue({
      firstName: "Jane",
      fullName: "Jane Doe",
      id: "user_1",
      username: "jane",
    });
    adminGuard.mockResolvedValue(null);
    getEffectiveCampaignClientSlug.mockResolvedValue("zamora");
    getCampaignActionItemById.mockResolvedValue({
      id: "item_1",
      campaignId: "cmp_1",
      clientSlug: "zamora",
      title: "Review copy v2",
      description: null,
      status: "todo",
      priority: "medium",
      visibility: "shared",
      assigneeId: "assignee_1",
      assigneeName: "Alex",
      dueDate: null,
      createdBy: "user_1",
      position: 0,
      sourceEntityId: null,
      sourceEntityType: null,
      createdAt: "2026-03-06T10:00:00.000Z",
      updatedAt: "2026-03-06T10:05:00.000Z",
    });
    maybeEnqueueCampaignActionItemTriage.mockResolvedValue(null);
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
        position: 0,
      },
    ];
  });

  it("uses effective campaign ownership on update notifications and revalidation", async () => {
    await updateCampaignActionItem({
      assigneeId: "assignee_1",
      assigneeName: "Alex",
      itemId: "item_1",
      title: "Review copy v2",
      visibility: "shared",
    });

    expect(state.campaign_action_items[0]?.client_slug).toBe("zamora");
    expect(logSystemEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        clientSlug: "zamora",
        entityId: "item_1",
      }),
    );
    expect(notifyWorkflowAssignee).toHaveBeenCalledWith(
      expect.objectContaining({
        assigneeId: "assignee_1",
        clientSlug: "zamora",
      }),
    );
    expect(getCampaignWorkflowPaths).toHaveBeenCalledWith("zamora", "cmp_1");
    expect(revalidateWorkflowPaths).toHaveBeenCalledWith(["/admin/campaigns/cmp_1"]);
  });

  it("uses effective campaign ownership on delete revalidation", async () => {
    await deleteCampaignActionItem({ itemId: "item_1" });

    expect(logSystemEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        clientSlug: "zamora",
        entityId: "item_1",
      }),
    );
    expect(getCampaignWorkflowPaths).toHaveBeenCalledWith("zamora", "cmp_1");
    expect(revalidateWorkflowPaths).toHaveBeenCalledWith(["/admin/campaigns/cmp_1"]);
    expect(state.campaign_action_items).toHaveLength(0);
  });
});
