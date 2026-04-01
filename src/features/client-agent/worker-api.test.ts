import { beforeEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";

const {
  state,
  supabaseAdmin,
  getClientPortalConfig,
  getThread,
  resolvePendingAssistantMessage,
  failPendingAssistantMessage,
  isStoreReadError,
  logSystemEvent,
  revalidateClientAgentPath,
  searchScope,
  getAdsOverview,
  getEventsOverview,
  getCampaignDetails,
  getEventDetails,
  getCreativeDetails,
  getDemographicBreakdown,
  getGeographyBreakdown,
  getPlacementBreakdown,
  compareEntities,
  getTimeseries,
} = vi.hoisted(() => {
  const state = {
    agentTasks: [] as Record<string, unknown>[],
    clientMembers: [] as Record<string, unknown>[],
    clientMemberCampaigns: [] as Record<string, unknown>[],
    clientMemberEvents: [] as Record<string, unknown>[],
  };

  function applyFilters(
    rows: Record<string, unknown>[],
    filters: Array<{ field: string; value: unknown }>,
  ) {
    return rows.filter((row) =>
      filters.every((filter) => row[filter.field] === filter.value),
    );
  }

  const supabaseAdmin = {
    from(table: string) {
      const filters: Array<{ field: string; value: unknown }> = [];
      const query = {
        select() {
          return this;
        },
        eq(field: string, value: unknown) {
          filters.push({ field, value });
          return this;
        },
        async maybeSingle() {
          const rows = applyFilters(
            state[
              table === "agent_tasks"
                ? "agentTasks"
                : table === "client_members"
                  ? "clientMembers"
                  : table === "client_member_campaigns"
                    ? "clientMemberCampaigns"
                    : "clientMemberEvents"
            ],
            filters,
          );

          return { data: rows[0] ?? null, error: null };
        },
        then(
          resolve: (value: {
            data: Record<string, unknown>[];
            error: { message: string } | null;
          }) => unknown,
        ) {
          const rows = applyFilters(
            state[
              table === "agent_tasks"
                ? "agentTasks"
                : table === "client_members"
                  ? "clientMembers"
                  : table === "client_member_campaigns"
                    ? "clientMemberCampaigns"
                    : "clientMemberEvents"
            ],
            filters,
          ).map((row) => ({ ...row }));

          return Promise.resolve({ data: rows, error: null }).then(resolve);
        },
      };

      return query;
    },
  };

  return {
    state,
    supabaseAdmin,
    getClientPortalConfig: vi.fn(),
    getThread: vi.fn(),
    resolvePendingAssistantMessage: vi.fn(),
    failPendingAssistantMessage: vi.fn(),
    isStoreReadError: vi.fn(() => false),
    logSystemEvent: vi.fn(),
    revalidateClientAgentPath: vi.fn(),
    searchScope: vi.fn(),
    getAdsOverview: vi.fn(),
    getEventsOverview: vi.fn(),
    getCampaignDetails: vi.fn(),
    getEventDetails: vi.fn(),
    getCreativeDetails: vi.fn(),
    getDemographicBreakdown: vi.fn(),
    getGeographyBreakdown: vi.fn(),
    getPlacementBreakdown: vi.fn(),
    compareEntities: vi.fn(),
    getTimeseries: vi.fn(),
  };
});

vi.mock("@/features/client-portal/config", () => ({
  getClientPortalConfig,
}));

vi.mock("@/features/system-events/server", () => ({
  logSystemEvent,
}));

vi.mock("@/features/workflow/revalidation", () => ({
  revalidateClientAgentPath,
}));

vi.mock("@/lib/supabase", () => ({
  supabaseAdmin,
}));

vi.mock("./tools", () => ({
  searchScope,
  getAdsOverview,
  getEventsOverview,
  getCampaignDetails,
  getEventDetails,
  getCreativeDetails,
  getDemographicBreakdown,
  getGeographyBreakdown,
  getPlacementBreakdown,
  compareEntities,
  getTimeseries,
}));

vi.mock("./store", () => ({
  getThread,
  resolvePendingAssistantMessage,
  failPendingAssistantMessage,
  isStoreReadError,
}));

import { getTaskContext, resolveTask, runTool } from "./worker-api";

describe("worker-api", () => {
  beforeEach(() => {
    state.agentTasks = [];
    state.clientMembers = [];
    state.clientMemberCampaigns = [];
    state.clientMemberEvents = [];
    getClientPortalConfig.mockReset();
    getThread.mockReset();
    resolvePendingAssistantMessage.mockReset();
    failPendingAssistantMessage.mockReset();
    isStoreReadError.mockReset();
    isStoreReadError.mockReturnValue(false);
    logSystemEvent.mockReset();
    revalidateClientAgentPath.mockReset();
    searchScope.mockReset();
    getAdsOverview.mockReset();
    getEventsOverview.mockReset();
    getCampaignDetails.mockReset();
    getEventDetails.mockReset();
    getCreativeDetails.mockReset();
    getDemographicBreakdown.mockReset();
    getGeographyBreakdown.mockReset();
    getPlacementBreakdown.mockReset();
    compareEntities.mockReset();
    getTimeseries.mockReset();

    getClientPortalConfig.mockResolvedValue({
      clientId: "client_1",
      slug: "acme",
      eventsEnabled: true,
    });
    state.clientMembers.push({
      id: "member_1",
      client_id: "client_1",
      scope: "assigned",
    });
    state.agentTasks.push({
      id: "task_1",
      from_agent: "client-portal",
      to_agent: "client-agent",
      action: "reply",
      status: "pending",
      params: {
        clientSlug: "acme",
        threadId: "thread_1",
        userMessageId: "msg_user_1",
        assistantMessageId: "msg_assistant_1",
        viewerContext: "member",
        clientMemberId: "member_1",
        previewAdminUserId: null,
      },
    });
  });

  it("rejects task contexts when the queued messages are not bound to the same turn", async () => {
    getThread.mockResolvedValue({
      threadId: "thread_1",
      title: "Last show",
      previewText: null,
      referencedEntities: [],
      lastResponseStatus: "pending",
      lastMessageAt: "2026-04-01T00:00:00.000Z",
      updatedAt: "2026-04-01T00:00:00.000Z",
      createdAt: "2026-04-01T00:00:00.000Z",
      messages: [
        {
          messageId: "msg_user_1",
          role: "user",
          status: null,
          text: "What was my last show?",
          blocks: [],
          referencedEntities: [],
          contextPayload: null,
          resolvedRange: null,
          providerResponseId: null,
          clientGeneratedId: null,
          agentTaskId: null,
          clientRequestId: "req_user",
          createdAt: "2026-04-01T00:00:00.000Z",
        },
        {
          messageId: "msg_assistant_1",
          role: "assistant",
          status: "pending",
          text: "Thinking…",
          blocks: [],
          referencedEntities: [],
          contextPayload: null,
          resolvedRange: null,
          providerResponseId: null,
          clientGeneratedId: null,
          agentTaskId: "task_other",
          clientRequestId: "req_other",
          createdAt: "2026-04-01T00:00:01.000Z",
        },
      ],
    });

    const result = await getTaskContext("task_1");

    expect(result).toMatchObject({
      ok: false,
      status: 409,
      error: "Task messages are invalid",
    });
  });

  it("returns invalid tool arguments when a tool rejects the payload schema", async () => {
    getThread.mockResolvedValue({
      threadId: "thread_1",
      title: "Ads",
      previewText: null,
      referencedEntities: [],
      lastResponseStatus: "pending",
      lastMessageAt: "2026-04-01T00:00:00.000Z",
      updatedAt: "2026-04-01T00:00:00.000Z",
      createdAt: "2026-04-01T00:00:00.000Z",
      messages: [
        {
          messageId: "msg_user_1",
          role: "user",
          status: null,
          text: "How much have we spent on ads?",
          blocks: [],
          referencedEntities: [],
          contextPayload: null,
          resolvedRange: null,
          providerResponseId: null,
          clientGeneratedId: null,
          agentTaskId: null,
          clientRequestId: "req_1",
          createdAt: "2026-04-01T00:00:00.000Z",
        },
        {
          messageId: "msg_assistant_1",
          role: "assistant",
          status: "pending",
          text: "Thinking…",
          blocks: [],
          referencedEntities: [],
          contextPayload: null,
          resolvedRange: null,
          providerResponseId: null,
          clientGeneratedId: null,
          agentTaskId: "task_1",
          clientRequestId: "req_1",
          createdAt: "2026-04-01T00:00:01.000Z",
        },
      ],
    });
    searchScope.mockImplementation(() => {
      z.object({ query: z.string().min(1) }).parse({});
      return {
        status: "ok" as const,
        data: {},
        referencedEntities: [],
      };
    });

    const result = await runTool({
      taskId: "task_1",
      toolName: "search_scope",
      args: {},
    });

    expect(result).toMatchObject({
      ok: false,
      status: 400,
      error: "Invalid tool arguments",
    });
  });

  it("logs resolve events with a stable idempotency key", async () => {
    resolvePendingAssistantMessage.mockResolvedValue({
      ok: true,
      message: {
        messageId: "msg_assistant_1",
        role: "assistant",
        status: "answer",
        text: "You have spent $12,000 on ads.",
        blocks: [],
        referencedEntities: [],
        contextPayload: null,
        resolvedRange: {
          preset: "lifetime",
          startDate: "2024-01-01",
          endDate: "2026-04-01",
          timezone: "America/Chicago",
        },
        providerResponseId: "provider_1",
        clientGeneratedId: null,
        agentTaskId: "task_1",
        clientRequestId: "req_1",
        createdAt: "2026-04-01T00:00:01.000Z",
      },
    });

    const result = await resolveTask("task_1", {
      status: "answer",
      text: "You have spent $12,000 on ads.",
      blocks: [],
      referencedEntities: [],
      contextPayload: null,
      resolvedRange: {
        preset: "lifetime",
        startDate: "2024-01-01",
        endDate: "2026-04-01",
        timezone: "America/Chicago",
      },
      providerResponseId: "provider_1",
    });

    expect(result).toMatchObject({
      ok: true,
      body: {
        status: "answer",
        thread_id: "thread_1",
        assistant_message_id: "msg_assistant_1",
      },
    });
    expect(logSystemEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        eventName: "client_agent_answer_generated",
        idempotencyKey: "client_agent_result:task_1:answer",
      }),
    );
  });
});
