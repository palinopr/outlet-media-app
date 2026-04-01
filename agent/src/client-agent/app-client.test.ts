import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const fetchMock = vi.fn();

function makeJsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

describe("client-agent app client", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubGlobal("fetch", fetchMock);
    fetchMock.mockReset();
    process.env.NEXT_PUBLIC_APP_URL = "https://app.outlet.test";
    process.env.CLIENT_AGENT_WORKER_SECRET = "worker_secret";
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    delete process.env.NEXT_PUBLIC_APP_URL;
    delete process.env.CLIENT_AGENT_WORKER_SECRET;
  });

  it("loads task context through the app-backed worker route", async () => {
    fetchMock.mockResolvedValueOnce(
      makeJsonResponse({
        task_id: "task_1",
        thread_id: "thread_1",
        user_message_id: "msg_user_1",
        assistant_message_id: "msg_assistant_1",
        scope_summary: {
          client_slug: "acme",
          events_enabled: true,
          viewer: "member",
        },
        scope: {
          clientId: "client_1",
          clientMemberId: "member_1",
          clientSlug: "acme",
          allowedCampaignIds: null,
          allowedEventIds: null,
          eventsEnabled: true,
          viewer: "member",
        },
        thread: {
          threadId: "thread_1",
          title: "Thread 1",
          previewText: "Preview",
          referencedEntities: [],
          lastResponseStatus: "pending",
          lastMessageAt: "2026-04-01T12:00:00.000Z",
          updatedAt: "2026-04-01T12:00:00.000Z",
          createdAt: "2026-04-01T12:00:00.000Z",
          messages: [],
        },
        user_message: {
          messageId: "msg_user_1",
          role: "user",
          status: null,
          text: "How much have we spent?",
          blocks: [],
          referencedEntities: [],
          contextPayload: null,
          resolvedRange: null,
          providerResponseId: null,
          clientGeneratedId: "client_request_1",
          clientRequestId: "client_request_1",
          agentTaskId: null,
          createdAt: "2026-04-01T12:00:00.000Z",
        },
        assistant_message: {
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
          clientRequestId: "client_request_1",
          agentTaskId: "task_1",
          createdAt: "2026-04-01T12:00:01.000Z",
        },
      }),
    );

    const { createClientAgentAppClient } = await import("./app-client.js");
    const client = createClientAgentAppClient();
    const result = await client.getTaskContext("task_1");

    expect(fetchMock).toHaveBeenCalledWith(
      "https://app.outlet.test/api/internal/client-agent/tasks/task_1/context",
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer worker_secret",
        }),
      }),
    );
    expect(result).toMatchObject({
      taskId: "task_1",
      threadId: "thread_1",
      userMessageId: "msg_user_1",
      assistantMessageId: "msg_assistant_1",
      scopeSummary: {
        clientSlug: "acme",
        eventsEnabled: true,
        viewer: "member",
      },
    });
  });

  it("sends tool calls and resolve payloads through the worker routes", async () => {
    fetchMock
      .mockResolvedValueOnce(
        makeJsonResponse({
          status: "ok",
          data: { spend: 10000 },
          referenced_entities: [
            {
              entityId: "cmp_1",
              entityType: "campaign",
              name: "Campaign 1",
            },
          ],
          warnings: [],
        }),
      )
      .mockResolvedValueOnce(
        makeJsonResponse({
          status: "answer",
          thread_id: "thread_1",
          assistant_message_id: "msg_assistant_1",
        }),
      );

    const { createClientAgentAppClient } = await import("./app-client.js");
    const client = createClientAgentAppClient();

    const toolResult = await client.runTool("task_1", "get_ads_overview", {
      rangePreset: "lifetime",
    });
    const resolveResult = await client.resolveTask("task_1", {
      status: "answer",
      text: "Lifetime ad spend is $100.00.",
      blocks: [],
      referencedEntities: [
        {
          entityId: "cmp_1",
          entityType: "campaign",
          name: "Campaign 1",
        },
      ],
      contextPayload: null,
      resolvedRange: null,
      providerResponseId: "session_1",
    });

    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      "https://app.outlet.test/api/internal/client-agent/tools",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          Authorization: "Bearer worker_secret",
        }),
        body: JSON.stringify({
          task_id: "task_1",
          tool_name: "get_ads_overview",
          args: {
            rangePreset: "lifetime",
          },
        }),
      }),
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      "https://app.outlet.test/api/internal/client-agent/tasks/task_1/resolve",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          Authorization: "Bearer worker_secret",
        }),
      }),
    );

    expect(toolResult).toMatchObject({
      status: "ok",
      data: { spend: 10000 },
      referencedEntities: [
        {
          entityId: "cmp_1",
          entityType: "campaign",
          name: "Campaign 1",
        },
      ],
    });
    expect(resolveResult).toMatchObject({
      status: "answer",
      threadId: "thread_1",
      assistantMessageId: "msg_assistant_1",
    });
  });

  it("rejects malformed resolved ranges before posting the resolve payload", async () => {
    const { createClientAgentAppClient } = await import("./app-client.js");
    const client = createClientAgentAppClient();

    await expect(
      client.resolveTask("task_1", {
        status: "answer",
        text: "Lifetime ad spend is $100.00.",
        blocks: [],
        referencedEntities: [],
        contextPayload: null,
        resolvedRange: {
          preset: "custom",
          startDate: "04/01/2026",
          endDate: "2026-04-01",
          timezone: "America/Chicago",
        },
        providerResponseId: "session_1",
      }),
    ).rejects.toThrow(/Invalid string: must match pattern/);

    expect(fetchMock).not.toHaveBeenCalled();
  });
});
